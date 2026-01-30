import { MetadataRoute } from 'next';
import { DOMAIN_URL } from '@/services/config/constants';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = DOMAIN_URL;

	// 정적 경로
	const routes = ['', '/news', '/board', '/gamble', '/ranking', '/halftime'].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: 'daily' as const,
		priority: route === '' ? 1 : 0.8,
	}));

	return routes;
}
