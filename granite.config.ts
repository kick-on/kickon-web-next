import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
	appName: 'kick-on',
	brand: {
		displayName: '킥온', // 화면에 노출될 앱의 한글 이름
		primaryColor: '#c00c0be5', // 화면에 노출될 앱의 기본 색상
		icon: '',
	},
	web: {
		host: '172.30.1.60',
		port: 3000,
		commands: {
			dev: 'next dev',
			build: 'next build',
		},
	},
	permissions: [],
	outdir: '.next',
});
