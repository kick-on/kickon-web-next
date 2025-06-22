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
				hostname: '**',
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
