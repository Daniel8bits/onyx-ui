import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { IconType } from 'react-icons';


export function toRegExp(mask: string): [string, RegExp, number[], number[], number[]] | never {
    let maskRegExpString = "^";
    let baseString = ""
    let curlyBracket = false
    let inverseSlash = false
    const curlyBracketsBegins: number[] = []
    const curlyBracketsEnds: number[] = []
    const inverseSlashPositions: number[] = []
    for(let i = 0; i < mask.length; i++) {
        if(!curlyBracket) {
            if(mask[i] === '\\' && !inverseSlash) {
                inverseSlash = true
                inverseSlashPositions.push(i)
            }
            else if((mask[i] === '{' && inverseSlash) || mask[i] !== '{') {
                maskRegExpString += mask[i]
                baseString += mask[i]
                inverseSlash = false
            }
            else if(mask[i] === '{') {
                curlyBracket = true
                curlyBracketsBegins.push(i)
            }
            continue;
        }
        if(mask[i] === '}') {
            curlyBracket = false
            curlyBracketsEnds.push(i)
            continue;
        }
        switch(mask[i]) {
            case 'e':
            case 'A':
            case 'a':
            case 'd':
                baseString += "_"
                break;
            default:
                baseString += mask[i]
        }
        switch(mask[i]) {
            case 'e':
                maskRegExpString += '([a-zA-Z]|_)'
                break;
            case 'A':
                maskRegExpString += '([A-Z]|_)'
                break;
            case 'a':
                maskRegExpString += '([a-z]|_)'
                break;
            case 'd':
                maskRegExpString += '(\\d|_)'
                break;
            default:
                maskRegExpString += mask[i]
        }
    
    }
    if(curlyBracket) {
        throw new Error('Mask expression must have closing curly brackets!')
    }
    maskRegExpString += "$"
    return [
        baseString, 
        new RegExp(maskRegExpString), 
        curlyBracketsBegins,
        curlyBracketsEnds, 
        inverseSlashPositions
    ]
}

export interface UITextFieldProps {
    id: string;
    label?: string;
    mask?: string
    className?: string;
    placeholder?: string;
    ariaLabel?: string;
    defaultValue?: string
    template?: string;
    password?: boolean;
    disabled?: boolean
    icon?: IconType
    iconPosition?: 'left' | 'right'
    onFocus?: (ev: React.FocusEvent) => void;
    onBlur?: (ev: React.FocusEvent) => void;
    onChange?: (ev: React.ChangeEvent) => void;
    onKeyUp?: (ev: React.KeyboardEvent) => void;
    onKeyDown?: (ev: React.KeyboardEvent) => void;
    onMouseUp?: (ev: React.MouseEvent) => void;
    onAction?: (value: string) => void
    onClickIcon?: () => void
    onLoad?: (ref: React.RefObject<HTMLInputElement>) => void
    iconContainerRef?: React.RefObject<HTMLDivElement>
}

const UITextField: React.ForwardRefRenderFunction<HTMLInputElement, UITextFieldProps> = (props, externRef) => {
    const previousValue = useRef<string>('')
    const inputTextRef = useRef<HTMLInputElement>(null)

    const handleMasking = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        
        const input = e.currentTarget
        const inputCurrentValue = input.value
        const caretPosition = input.selectionStart ?? 0
        const char = e.key
        let value = previousValue.current

        if(!props.mask) return
        
        if(
            char !== 'Backspace' && (
            caretPosition >= inputCurrentValue.length ||
            char.length !== 1 ||
            !(char >= 'a' && char <= 'z' || 
            char >= 'A' && char <= 'Z' || 
            char >= '0' && char <= '9' ||
            char === ' '))
        ) {
            input.value = value
            return;
        }

        const [
            base, 
            regex,
            curlyBracketsBegins, 
            curlyBracketsEnds,
            inverseSlashPositions
        ] = toRegExp(props.mask)
        const aux = value.split('')
        let switched: boolean = false
        let newCaretPosition: number|null = null
        let curlyBracket = false
        let inverseSlash = false
        value = '';

        const handleBackspacing = (beginPosition: number) => {
            if(!props.mask) return
            const maskPosition = getCurrentMaskPosition(beginPosition);
            for(let k = beginPosition; k >= 0; k--) {
                // trying to find the right position to remove the char
                if(!switched && base[k] === '_' && props.mask[maskPosition] !== '_') {
                    const oldValue: string = value;
                    value = oldValue.substring(0, k)
                    value += base[k]
                    value += oldValue.substring(k+1)
                    aux[k] = base[k]
                    
                    switched = true
                    newCaretPosition = k
                }
                else if(!switched && k === 0) {
                    newCaretPosition = caretPosition
                    break;
                }
            }
        }

        const getCurrentMaskPosition = (i: number) => {
            let position = 0;
            for(let k = 0; k < curlyBracketsBegins.length; k++) {
                if(i+position >= curlyBracketsBegins[k]) {
                    position += 1
                }
                if(i+position >= curlyBracketsEnds[k]) {
                    position += 1
                }
                if(i+position >= inverseSlashPositions[k]) {
                    position += 1
                }
            }
            return i+position
        }

        let maskPosition: number
        const find = (arr: number[], value: number): boolean => 
                    arr.find((position) => position === value) !== undefined
        for(let i = 0; i < base.length; i++) {
            maskPosition = getCurrentMaskPosition(i);
            if(!curlyBracket) {
                if(!inverseSlash && find(inverseSlashPositions, maskPosition)) {
                    inverseSlash = true
                    continue;
                }
                else if(!inverseSlash && find(curlyBracketsBegins, maskPosition-1)) {
                    curlyBracket = true;
                }
                else if(inverseSlash) {
                    inverseSlash = false;
                }
            }
            if(curlyBracket) {
                // in case of char !== 'Backspace'
                if(char !== 'Backspace' && newCaretPosition === null) {
                    // trying to find the right position to put the char
                    if(!switched && i >= caretPosition && 
                        base[i] === '_' && props.mask[maskPosition] !== '_') {
                        aux[i] = char
                        switched = true
                    }
                    // trying to find the right position to put the caret
                    if(i+1 === aux.length) {
                        newCaretPosition = caretPosition+1
                    }
                    else if(switched && base[i+1] === '_' && props.mask[maskPosition+1] !== '_') {
                        newCaretPosition = i+1
                    }
                }
                // in case of char === 'Backspace'
                else if(caretPosition > 0 && i > 0 && newCaretPosition === null) {
                    if(i === caretPosition) {
                        handleBackspacing(i-1)
                    }
                }

                if(find(curlyBracketsEnds, maskPosition-1)) {
                    curlyBracket = false;
                }
            }

            value += aux[i]

        }

        if(char === 'Backspace' && caretPosition === base.length) {
            handleBackspacing(base.length-1)
        }

        // it implies caretPosition === 0
        if(newCaretPosition === null) {
            newCaretPosition = 0
        }

        if(value.match(regex)) {
            e.preventDefault()
            input.value = value
            previousValue.current = value;
            input.setSelectionRange(newCaretPosition, newCaretPosition)
            input.focus()
        }
    }, [props.mask])

    
     function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if(props.mask) {
            handleMasking(event)
        }
        if(props.onKeyDown) {
            props.onKeyDown(event)
        }
    }

    useEffect(() => {

        if(inputTextRef.current) {
            if(externRef) {
                (externRef as React.MutableRefObject<HTMLInputElement>).current = inputTextRef.current
            }
            props.onLoad?.(inputTextRef)
        }
    
        if(props.mask && inputTextRef.current) {


            const [base] = toRegExp(props.mask)
            const input = inputTextRef.current
            //console.log(props.id + '#TESTE> ' + base);
                
            input.maxLength = base.length
            input.value = base;
            previousValue.current = base
        } else if (props.defaultValue && inputTextRef.current) {
            inputTextRef.current.value = props.defaultValue
        }
    }, []);

    /**
     * UIInputText default action
     * Occurs when the user insert some text and the key is released
     * @param event 
     */
     function actionPerformed(event: React.KeyboardEvent<HTMLInputElement>): void {
        if(props.disabled) return
        if(props.onKeyUp) {
            props.onKeyUp(event)
        }
        if(props.onAction && inputTextRef.current) {
            props.onAction(inputTextRef.current.value)
        }
    }

    const input = () => {

        const inputElement = <input 
            ref={inputTextRef}
            id={props.id}
            name={props.id}
            type={props.password ? 'password' : 'text'}
            placeholder={props.placeholder ?? ''}
            aria-label={props.ariaLabel ?? props.label ?? undefined}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onKeyUp={actionPerformed}
            onKeyDown={handleKeyDown}
            onChange={props.onChange}
            onMouseUp={props.onMouseUp}
            onClick={e => e.stopPropagation()}
            disabled={props.disabled}
        />

        const handleIconClick = (e: React.MouseEvent) => {
            if(props.disabled) return
            props.onClickIcon?.()
        }

        if(props.icon) {
            return (
                <div 
                    ref={props.iconContainerRef}
                    className={`${props.onClickIcon ? 'icon-as-button' : ''}`} 
                >
                    {(!props.iconPosition || props.iconPosition === 'left') &&
                        <button type='button' onClick={handleIconClick} aria-label='button'><props.icon /></button>}
                    {inputElement}
                    {props.iconPosition === 'right' &&
                        <button type='button' onClick={handleIconClick} aria-label='button'><props.icon /></button>}
                </div>
            )
        }

        return inputElement;

    }

    return (
        <div className={`ui-textfield ${props.className ?? ''} ${props.template ?? 'default'} ${props.disabled ? 'disabled' : ''} ${props.icon && props.iconPosition ? 'hasIcon' : ''}`}>
          {props.label && 
            <label htmlFor={props.id}>
              {props.label}
            </label>}
          {input()}
        </div>
    );
};

export default forwardRef(UITextField);