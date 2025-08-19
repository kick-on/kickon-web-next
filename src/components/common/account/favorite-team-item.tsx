'use client';

import { TeamDto } from '@/services/apis/team/dto';
import clsx from 'clsx';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

export default function FavoriteTeamItem({
	team,
	orderNum,
	isActive, // 현재 선택 중인 값인지
	isDisabled, // 드래그 가능한지
	isClickable, // 클릭 가능한지
	onClickItem,
	onClickXButton,
}: {
	team: TeamDto | null;
	orderNum: number;
	isActive: boolean;
	isDisabled?: boolean;
	isClickable?: boolean;
	onClickItem?: () => void;
	onClickXButton?: (e: React.MouseEvent) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: team?.pk ?? -1,
		disabled: isDisabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 2 : team ? 1 : 0,
		boxShadow: isDragging ? '0px 4px 10px 0px rgba(0, 0, 0, 0.16)' : '',
		touchAction: 'none',
	};

	return (
		<div className="grow flex flex-col gap-1 relative">
			<div
				className="w-full h-7 @mobile:h-6 flex justify-center items-center
          bg-black-900 rounded-lg text-black-000 caption1-medium"
			>
				{orderNum}
			</div>

			{/* 드래그 중일 때 원래 위치 표시 */}
			{isDragging && (
				<div
					className="absolute bottom-0 left-0 w-full h-auto aspect-[5/4]
						rounded-lg bg-primary-50 border-2 border-primary-50"
				/>
			)}

			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				role="button"
				tabIndex={0}
				onClick={onClickItem}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						onClickItem();
					}
				}}
				className={clsx(
					`relative w-full h-auto aspect-[5/4] flex flex-col gap-1
					justify-center items-center rounded-lg bg-black-000`,
					isDisabled && !isClickable ? 'pointer-events-none' : 'cursor-pointer',
					isActive ? 'p-[4px] pb-[2px] border-2 border-primary-900' : 'p-[5px] pb-[3px] border border-black-300',
				)}
			>
				{/* 팀 선택 취소 x 버튼 */}
				{/* 1순위 팀 선택 전 또는 응원팀이 없는 경우 x 버튼 표시 안 함 */}
				{isClickable && !(orderNum === 1 && (!team || team.pk === NO_CHEERING_TEAM_PK)) && (
					<button
						onClick={onClickXButton}
						className={clsx(
							'absolute w-4 h-4 rounded-full bg-black-200',
							isActive ? 'top-[3px] right-[3px]' : 'top-1 right-1',
						)}
					>
						<Image className="m-auto" src="/x/small.svg" alt="삭제" width={12} height={12} />
					</button>
				)}

				{/* 팀 로고 & draggable 아이콘 */}
				{team && (
					<>
						<div
							className={clsx('relative w-auto grow aspect-square', {
								'my-3': isDisabled,
							})}
						>
							<Image className="w-auto h-auto object-contain" src={team.logoUrl} alt="로고" fill />
						</div>
						{!isDisabled && (
							<div className={clsx('flex gap-0.5', { 'brightness-0': isDragging })}>
								<Image src="/draggable.svg" alt="드래그 아이콘" width={18} height={18} />
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
