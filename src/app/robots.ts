import { MetadataRoute } from 'next';
import { DOMAIN_URL } from '@/services/config/constants';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/auth/'],
		},
		sitemap: `${DOMAIN_URL}/sitemap.xml`,
	};
}
