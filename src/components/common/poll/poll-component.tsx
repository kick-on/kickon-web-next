'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import XIcon from '@/assets/x.svg';
import clsx from 'clsx';
import { formatDate } from '@/lib/utils';
import PollBottomButton from '@/components/common/poll/poll-bottom-button';
import PollOptionInputItem from '@/components/common/poll/poll-option-input-item';
import PollOptionItem from '@/components/common/poll/poll-option-item';
import VoteViewIcon from '@/assets/editor/vote-view.svg';
import { usePollStore } from '@/lib/store/usePollStore';
import { toDateTimeLocal } from '@/lib/utils/date/toDateTimeLocal';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePollQuery } from '@/lib/hooks/queries/usePollQuery';

export type PollMode = 'create' | 'view';
export type PollStatus = 'active' | 'closed';
export type VoteStatus = 'idle' | 'voting' | 'voted' | 'revoting';

const getBoardPk = (pathname) => {
	const segments = pathname.split('/');
	const boardPk = segments.find((segment) => /^\d+$/.test(segment));

	if (boardPk) {
		return Number(boardPk);
	}

	const detailData = sessionStorage.getItem('detailContent');
	if (detailData) {
		const parsedData = JSON.parse(detailData);
		return parsedData.data.pk;
	}

	return null;
};

export default function PollComponent({ deleteNode }: Partial<NodeViewProps>) {
	const datetimeRef = useRef<HTMLInputElement>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const boardPk = getBoardPk(pathname);

	const { data } = usePollQuery(boardPk);
	const pollData = data?.data;

	// 처음 게시글 작성 시에만 true (게시글 수정 시 false)
	const isEditable = pathname.includes('post') && !searchParams.get('edit');
	const pollMode: PollMode = pathname.includes('post') ? 'create' : 'view';
	const pollStatus: PollStatus = pollData?.isClosed ? 'closed' : 'active';
	const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');

	const {
		title,
		options,
		endAt,
		isMultipleChoice,
		setTitle,
		setOptions,
		setIthOption,
		setEndAt,
		setIsMultipleChoice,
		clearPollStore,
	} = usePollStore();
	const { formattedDate: endDate, formattedTime: endTime } = formatDate(endAt, 'numeric');

	useEffect(() => {
		if (!pollData) return;

		const initialVoteStatus = pollData.isVoted ? 'voted' : 'idle';
		setVoteStatus(initialVoteStatus);

		setTitle(pollData.title);
		setEndAt(pollData.endAt);
		setIsMultipleChoice(pollData.isMultipleChoice);

		if (pollData.options.length > 0) {
			setOptions(pollData.options.map((o) => o.content));
		}
	}, [pollData]);

	// view mode : 옵션 선택 로직
	const [checkedOptionPks, setCheckedOptionPks] = useState<number[]>([]);
	const toggleCheckedOptionPks = (pk: number) => {
		// 기존에 이미 체크되어 있던 값인지 검사
		const isChecked = checkedOptionPks.includes(pk);

		if (pollData.isMultipleChoice) {
			const updated = isChecked ? checkedOptionPks.filter((cpk) => cpk !== pk) : [...checkedOptionPks, pk];
			setCheckedOptionPks(updated);
			return;
		}

		const updated = isChecked ? [] : [pk];
		setCheckedOptionPks(updated);
		return;
	};

	return (
		<NodeViewWrapper
			className={clsx(
				'flex flex-col gap-4 @mobile:gap-3 pb-3 border border-black-300 rounded-lg',
				pollMode === 'create' && !isEditable && 'bg-black-100 pointer-events-none',
			)}
		>
			<div className="relative grid grid-cols-[1fr_auto] @mobile:grid-rows-[auto_auto] @mobile:grid-cols-none @mobile:gap-0 gap-10 justify-between items-center px-3 py-1.5 bg-black-200 rounded-t-lg">
				<div className="w-full text-header-01 max-w-full truncate">
					{pollMode === 'create' ? (
						<input
							type="text"
							placeholder="투표 제목을 입력하세요."
							className="w-full placeholder:text-black-700 outline-0 py-1"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					) : (
						<div className="w-full py-1 flex gap-2 items-center">
							<VoteViewIcon className="@mobile:hidden" />
							{pollData?.title ?? '투표 제목을 불러올 수 없습니다.'}
						</div>
					)}
				</div>

				<div className="flex gap-4 text-black-700">
					<div className="flex gap-2 items-center text-caption-01 @mobile:text-caption-02 @mobile:py-1 font-medium">
						<span className={clsx('flex items-center', isEditable ? 'gap-0.5' : 'gap-1')}>
							투표 마감
							<label
								className={isEditable ? 'cursor-pointer' : 'cursor-default'}
								tabIndex={0}
								role="button"
								onClick={() => datetimeRef?.current?.showPicker()}
							>
								{pollMode === 'create' && (
									<input
										ref={datetimeRef}
										type="datetime-local"
										value={toDateTimeLocal(endAt)}
										onChange={(e) => setEndAt(e.target.value)}
										className="w-4 outline-0"
									/>
								)}
								{`${endDate} ${endTime}`}
							</label>
						</span>
						{(pollMode === 'create' || isMultipleChoice) && (
							<>
								<div className="h-3 w-px bg-black-700" />
								<span className="flex items-center gap-1">
									복수 선택
									{pollMode === 'create' && (
										<input
											type="checkbox"
											checked={isMultipleChoice ?? false}
											onChange={(e) => setIsMultipleChoice(e.target.checked)}
											className="cursor-pointer appearance-none relative bg-black-200 border border-black-700 w-3 h-3
											rounded-xs outline-0 checked:border-0 checked:bg-primary-900 before:absolute
											before:inset-x-0.5 before:inset-y-px before:mb-px text-white
											before:bg-[url('/check.svg')] before:bg-contain before:bg-no-repeat before:bg-center"
										/>
									)}
								</span>
							</>
						)}
					</div>
					{isEditable && (
						<button
							onClick={() => {
								clearPollStore();
								deleteNode?.();
							}}
							className=""
							aria-label="삭제"
						>
							<XIcon className="w-4 h-4 text-black-700 @mobile:absolute @mobile:top-2.5 @mobile:right-2.5" />
						</button>
					)}
				</div>
			</div>

			{/* 항목 목록 */}
			<div className="space-y-4 pl-2 pr-4">
				{pollMode === 'create'
					? options.map((option, i) => (
							<PollOptionInputItem
								key={i}
								index={i + 1}
								option={option}
								onChange={(e) => setIthOption(e.target.value, i)}
							/>
						))
					: pollData &&
						pollData.options.map((option, i) => (
							<PollOptionItem
								key={option.pk}
								pollStatus={pollStatus}
								voteStatus={voteStatus}
								index={i + 1}
								pollOption={option}
								totalVoteCount={pollData.totalVoteCount}
								isVoted={pollData.votedOptionPks.includes(option.pk)}
								checked={checkedOptionPks.includes(option.pk)}
								handleChange={() => toggleCheckedOptionPks(option.pk)}
							/>
						))}
			</div>

			<PollBottomButton
				pollMode={pollMode}
				pollStatus={pollStatus}
				voteStatus={voteStatus}
				setVoteStatus={setVoteStatus}
			/>
		</NodeViewWrapper>
	);
}
