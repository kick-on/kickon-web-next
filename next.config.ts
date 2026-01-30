import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**.kakaocdn.net',
			},
			{
				protocol: 'https',
				hostname: '**.kakaocdn.net',
			},
			{
				protocol: 'https',
				hostname: 'premierskillsenglish.britishcouncil.org',
			},
			{
				protocol: 'https',
				hostname: 'media.gettyimages.com',
			},
			{
				protocol: 'https',
				hostname: 'kickon-files-bucket.s3.ap-northeast-2.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'kau-kickon-files-bucket.s3.ap-northeast-2.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'media.api-sports.io',
			},
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
			},
			{
				protocol: 'https',
				hostname: 'ssl.pstatic.net',
			},
			{
				protocol: 'https',
				hostname: 'img.coupangstreaming.com',
			},
		],
		dangerouslyAllowSVG: true, // SVG 허용 (보안 주의)
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // svg script 공격을 방지하기 위함
	},

	// async headers() {
	// 	return [
	// 		{
	// 			// public 폴더 내의 모든 .svg 파일에 content type 헤더 추가
	// 			source: '/:path*.svg',
	// 			headers: [
	// 				{
	// 					key: 'Content-Type',
	// 					value: 'image/svg+xml',
	// 				},
	// 			],
	// 		},
	// 	];
	// },

	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // ?url이 없을 때 SVGR 사용
				use: ['@svgr/webpack'],
			},
		);

		fileLoaderRule.exclude = /\.svg$/i;
		return config;
	},
};

if (process.env.NEXT_PUBLIC_NODE_ENV === 'prod') {
	nextConfig.compiler = {
		removeConsole: true,
	};
}

module.exports = nextConfig;
