import { Metadata } from 'next';
import { getNewsDetail } from '@/services/apis/news/news.api';
import { getBoardDetail } from '@/services/apis/board/board.api';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
	const { type, id } = await params;
	const idNum = Number(id);

	try {
		let title = '';
		let category = '';

		if (type === 'news') {
			const response = await getNewsDetail(idNum);
			if (response && response.data) {
				title = response.data.title;
				category = '뉴스';
			}
		} else if (type === 'board') {
			const response = await getBoardDetail(idNum);
			if (response && response.data) {
				title = response.data.title;
				category = '클럽 커뮤니티';
			}
		}

		if (title) {
			return {
				title: `${title} | ${category}`,
			};
		}
	} catch (error) {
		console.error('Metadata fetch failed:', error);
	}

	return {};
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
