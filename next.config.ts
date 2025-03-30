import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['kickon-files-bucket.s3.ap-northeast-2.amazonaws.com', 'media.api-sports.io'],
	},
};

export default nextConfig;
