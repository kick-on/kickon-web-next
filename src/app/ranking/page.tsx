import RankingList from '@/components/layouts/with-side/ranking-list/ranking-list';

export default function Page() {
	return (
		<div className="grow p-4 flex flex-col items-center gap-4 @mobile:w-dvw">
			<RankingList mode="season" />
			<RankingList mode="predict" />
		</div>
	);
}
