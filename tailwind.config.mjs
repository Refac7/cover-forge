/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'ind-red': '#ff1f1f',      // 核心高亮红
				'ind-dark': '#0a0a0a',     // 深色背景
				'ind-black': '#000000',    // 纯黑
				'ind-gray': '#333333',     // 边框灰
				'ind-light': '#eeeeee',    // 主要文字白/灰
			},
			fontFamily: {
				// 定义字体栈
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				// 网格背景图案
				'grid-pattern': "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
			}
		},
	},
	plugins: [],
}