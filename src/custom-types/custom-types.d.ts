//import React from 'react'

declare type Nullable<T> = T | null | undefined

declare type AnyObject = Record<string, unknown>

declare type StateSetter<T> = (value: T|((oldValue: T) => T)) => void

declare type Override<T, R> = Omit<T, keyof R> & R

declare type Class<T> = new (...args: any[]) => T

declare type ReactComponentRef<T extends HTMLElement> = React.MutableRefObject<T|null>

declare type JSXProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>

declare type JSXButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>