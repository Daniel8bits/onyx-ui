import matchers from '@testing-library/jest-dom';
import {expect} from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';

expect.extend(matchers);

global.ResizeObserver = ResizeObserver;
