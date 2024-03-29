/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client"  />

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react({tsDecorators: true}), dts()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'aquino',
			fileName: 'aquino',

		},
		rollupOptions: {
			external: ['react', 'react-dom'],

		},
	},
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, './src/components'), 
      '@utils': path.resolve(__dirname, './src/utils'),
      '@style': path.resolve(__dirname, './src/style'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
			'@layouts': path.resolve(__dirname, './src/layouts'),
      '@test': path.resolve(__dirname, './src/test'),
			'@internals': path.resolve(__dirname, './src/internals'),
      '@custom-types': path.resolve(__dirname, './src/custom-types'),
		},
	},
});
