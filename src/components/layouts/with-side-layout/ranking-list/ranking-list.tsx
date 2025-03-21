import ComponentFrame from '@/components/common/componentFrame';
import RankingItem from './ranking-item';
import SelectBox from './select-box';
import { getActualSeasonRanking, getGambleSeasonRanking } from '@/services/apis/ranking';

export default async function RankingList({ mode }: { mode: 'season' | 'predict' }) {
	const response = mode === 'predict' ? await getGambleSeasonRanking(1) : await getActualSeasonRanking(1);

	return (
		<ComponentFrame>
			<div className="p-4 title5-semibold">{mode === 'season' ? '이번 시즌 순위' : '승부예측 순위'}</div>
			<div className="p-4 pl-2 border border-black-200 border-x-0 button4-medium">
				<SelectBox />
			</div>
			<div className="flex justify-between p-4 subtitle2-medium text-black-700">
				<div className="w-7 text-center">순위</div>
				<div className="flex gap-2">
					{mode === 'season' ? (
						<>
							<div className="w-7 text-center">경기</div>
							<div className="w-7 text-center">승점</div>
							<div className="w-7 text-center">득점</div>
						</>
					) : (
						<>
							<div className="w-7 text-center">경기</div>
							<div className="w-12 text-center">점수</div>
						</>
					)}
				</div>
			</div>
			<div className="p-4 pt-0">
				{response === null ? (
					<div>데이터를 불러오지 못했어요.</div>
				) : (
					response.data.map(({ rankOrder }) => <RankingItem key={rankOrder} mode={mode} />)
				)}
			</div>
		</ComponentFrame>
	);
}
