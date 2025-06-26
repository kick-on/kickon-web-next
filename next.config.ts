import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'k.kakaocdn.net',
			},
			{
				protocol: 'https',
				hostname: 'k.kakaocdn.net',
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
				hostname: 'media.api-sports.io',
			},
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
			},
			{
				protocol: 'https',
				hostname: 'img1.kakaocdn.net',
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
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});
		return config;
	},
};

if (process.env.NEXT_PUBLIC_NODE_ENV === 'prod') {
	nextConfig.compiler = {
		removeConsole: true,
	};
}

module.exports = nextConfig;
