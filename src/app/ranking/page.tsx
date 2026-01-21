import { Metadata } from 'next';
import RankingList from '@/components/layouts/with-side/ranking-list/ranking-list';

export const metadata: Metadata = {
	title: '랭킹',
};

export default function Page() {
	return (
		<div className="grow p-4 flex flex-col items-center gap-4 @mobile:w-dvw">
			<RankingList mode="season" />
			<RankingList mode="predict" />
		</div>
	);
}
