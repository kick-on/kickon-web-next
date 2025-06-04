'use client';

import { TeamDto } from '@/services/apis/team/dto';
import clsx from 'clsx';
import Image from 'next/image';

export default function FavoriteTeamItem({
	team,
	orderNum,
	isActive,
	onClickItem,
	onClickXButton,
}: {
	team: TeamDto | null;
	orderNum: number;
	isActive: boolean;
	onClickItem: () => void;
	onClickXButton: (e: React.MouseEvent) => void;
}) {
	return (
		<div className="grow space-y-1">
			<div
				className="w-full h-7 @mobile:h-6 flex justify-center items-center
          bg-black-900 rounded-lg text-black-000 caption1-medium"
			>
				{orderNum}
			</div>

			<div
				role="button"
				tabIndex={0}
				onClick={onClickItem}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						onClickItem();
					}
				}}
				className={clsx(
					`relative w-full h-auto aspect-[5/4] cursor-pointer
          flex flex-col gap-1 justify-center items-center rounded-lg bg-black-000`,
					isActive ? 'p-[4px] pb-[2px] border-2 border-primary-900' : 'p-[5px] pb-[3px] border border-black-300',
				)}
			>
				{/* 팀 선택 취소 x 버튼 */}
				{!(orderNum === 1 && !team) && (
					// 1순위 팀 선택 전에는 x 버튼 표시 안 함
					<button
						onClick={onClickXButton}
						className={clsx(
							'absolute w-4 h-4 rounded-full bg-black-200',
							isActive ? 'top-[3px] right-[3px]' : 'top-1 right-1',
						)}
					>
						<Image className="m-auto" src="/small-x.svg" alt="삭제" width={12} height={12} />
					</button>
				)}

				{/* 팀 로고 & draggable 아이콘 */}
				{team && (
					<>
						<div className="relative w-auto grow aspect-square">
							<Image className="w-auto h-auto object-cover" src="/logo/icon-red.svg" alt="로고" fill />
						</div>
						<div className="flex gap-0.5">
							<Image src="/draggable.svg" alt="왼쪽 화살표" width={18} height={18} />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
