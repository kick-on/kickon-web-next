'use client';

import { Dispatch, SetStateAction } from 'react';
import FavoriteTeamItem from './favorite-team-item';
import Image from 'next/image';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import { TeamDto } from '@/services/apis/team/dto';

export default function FavoriteTeamList({
	isEditable,
	favoriteTeams,
	setFavoriteTeams,
	selectedIndex,
	setSelectedIndex,
}: {
	isEditable: boolean;
	favoriteTeams: (TeamDto | null)[];
	setFavoriteTeams: Dispatch<SetStateAction<TeamDto[]>>;
	selectedIndex: number;
	setSelectedIndex: Dispatch<SetStateAction<number>>;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10, // 10px 이상 움직여야 드래그 감지
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const index = favoriteTeams.findIndex((item) => item?.pk === active.id);

		// 길이가 1이거나 해당 요소가 null이라면 리턴
		if (favoriteTeams[index]) {
			setSelectedIndex(index);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		// team이 null인 경우 해당 위치로의 drop 방지
		if (over.id === -1) return;

		if (active.id !== over.id) {
			setFavoriteTeams((items) => {
				const oldIndex = items.findIndex((item) => item?.pk === active.id);
				const newIndex = items.findIndex((item) => item?.pk === over.id);

				const newItems = arrayMove(items, oldIndex, newIndex);
				// 드래그한 요소의 새 인덱스를 active 상태로 설정
				setSelectedIndex(newIndex);
				return newItems;
			});
		}
	};

	// favorite team item 추가 버튼 클릭 핸들러
	const handleAddButtonClick = () => {
		setFavoriteTeams([...favoriteTeams, null]);
		setSelectedIndex(favoriteTeams.length);
	};

	// favorite team item 내부 x 버튼 클릭 핸들러
	const handleXButtonClick = (e: React.MouseEvent, index: number) => {
		e.stopPropagation();

		// 모두 삭제 시 favoriteTeams를 [null]로 설정하여 추가 버튼이 생성되지 않도록 함
		const newFavoriteTeams = favoriteTeams.filter((_, i) => i !== index);
		setFavoriteTeams(newFavoriteTeams.length ? newFavoriteTeams : [null]);

		// 현재 선택된 팀을 삭제할 경우 첫 번째 요소나 마지막 요소를 active
		if (selectedIndex === index) {
			const newSelectedIndex = index === 0 ? 0 : newFavoriteTeams.length - 1;
			setSelectedIndex(newSelectedIndex);
		} else {
			// 그 외 기존 요소에 대한 active 유지
			const selectedMap = favoriteTeams[selectedIndex];
			const newSelectedIndex = newFavoriteTeams.indexOf(selectedMap);
			setSelectedIndex(newSelectedIndex);
		}
	};

	const handleItemClick = (index: number) => {
		setSelectedIndex(index);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-3 gap-2.5 items-end">
				<SortableContext items={favoriteTeams.map((team) => team?.pk ?? -1)} strategy={verticalListSortingStrategy}>
					{favoriteTeams.map((team, i) => (
						<FavoriteTeamItem
							key={team?.pk ?? -1}
							orderNum={i + 1}
							team={team ?? null}
							isActive={isEditable && selectedIndex === i}
							isDisabled={
								!isEditable ||
								!team ||
								favoriteTeams.length === 1 ||
								(favoriteTeams.length === 2 && !favoriteTeams.at(-1))
							}
							onClickItem={() => handleItemClick(i)}
							onClickXButton={(e) => handleXButtonClick(e, i)}
						/>
					))}
				</SortableContext>
				{
					// 수정 가능 상태에서
					// 이전 팀 선택이 완료되고 (응원팀이 없어요 제외)
					// 선택 팀이 3개 미만일 때 추가 버튼 표시
					isEditable &&
						favoriteTeams.at(-1) !== null &&
						favoriteTeams[0].pk !== NO_CHEERING_TEAM_PK &&
						favoriteTeams.length < 3 && (
							<button
								onClick={handleAddButtonClick}
								className="w-full h-auto aspect-[5/4] flex flex-col gap-1 justify-center items-center 
								rounded-lg bg-black-000 p-[5px] border border-black-300"
							>
								<div className="relative w-12 h-12 @mobile:w-[2.1875rem] @mobile:h-[2.1875rem]">
									<Image src={'/plus.svg'} alt="팀 추가 버튼" fill className="w-auto h-auto" />
								</div>
							</button>
						)
				}
			</div>
		</DndContext>
	);
}
