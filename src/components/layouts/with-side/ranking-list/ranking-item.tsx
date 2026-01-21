import { ActualRankingDto } from '@/services/apis/ranking/ranking.type';
import Image from 'next/image';

export default function RankingItem({
	mode,
	rankOrder,
	teamLogoUrl,
	teamName,
	gameNum,
	points,
	wonScores,
}: Partial<ActualRankingDto> & { mode: 'season' | 'predict' }) {
	return (
		<div className="flex justify-between h-9 body6-medium items-center">
			<div className="flex gap-2.5">
				<div className="flex justify-center items-center w-7">{rankOrder}</div>
				<Image
					unoptimized
					className="w-[1.125rem] h-[1.125rem] object-contain"
					width={18}
					height={18}
					src={teamLogoUrl}
					alt=""
				/>
				<div>{teamName || '팀 이름'}</div>
			</div>
			<div className="flex gap-2">
				{mode === 'season' ? (
					<>
						<div className="text-center w-7">{gameNum}</div>
						<div className="text-center w-7">{points}</div>
						<div className="text-center w-7">{wonScores}</div>
					</>
				) : (
					<>
						<div className="w-7 text-center">{gameNum}</div>
						<div className="w-12 text-center">{points}</div>
					</>
				)}
			</div>
		</div>
	);
}
