import ComponentFrame from '@/components/common/componentFrame';
import RankingItem from './ranking-item';
import SelectBox from './select-box';

export default function RankingList({ mode }: { mode: 'season' | 'predict' }) {
	return (
		<ComponentFrame>
			<div className="p-4 title5-semibold">이번 시즌 순위</div>
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
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
				<RankingItem mode={mode} />
			</div>
		</ComponentFrame>
	);
}
