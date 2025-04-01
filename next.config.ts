import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			'k.kakaocdn.net',
			'premierskillsenglish.britishcouncil.org',
			'media.gettyimages.com',
			'kickon-files-bucket.s3.ap-northeast-2.amazonaws.com',
			'media.api-sports.io',
			'i.ytimg.com',
			'img1.kakaocdn.net',
		],
	},
};

module.exports = nextConfig;
