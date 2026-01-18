'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import XIcon from '@/assets/x.svg';
import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import { formatDate } from '@/lib/utils';
import PollBottomButton from '@/components/common/poll/poll-bottom-button';
import PollOptionInputItem from '@/components/common/poll/poll-option-input-item';
import PollOptionItem from '@/components/common/poll/poll-option-item';
import VoteViewIcon from '@/assets/editor/vote-view.svg';
import { usePollStore } from '@/lib/store/usePollStore';
import { toDateTimeLocal } from '@/lib/utils/date/toDateTimeLocal';

export type PollMode = 'create' | 'view';
export type PollStatus = 'active' | 'closed';
export type VoteStatus = 'idle' | 'voting' | 'voted' | 'revoting';

export interface PollOption {
	pk: number;
	option: string;
	voteCount: number;
}

export interface PollDto {
	pk: number;
	title: string;
	isMultipleChoice: boolean;
	isClosed: boolean;
	options: PollOption[];
	endAt: string;
	totalVoteCount: number;
	isVoted: boolean;
	votedOptionPks: number[];
}

export default function PollComponent({ node, deleteNode }: NodeViewProps) {
	const { editor } = useEditorContext();
	const datetimeRef = useRef<HTMLInputElement>(null);

	// const pollData = null;
	const pollData: PollDto = useMemo(
		() => ({
			pk: 1,
			title: '축구 goat는 누구?',
			isMultipleChoice: false,
			isClosed: false,
			options: [
				{ pk: 1, option: '펠레', voteCount: 10 },
				{ pk: 2, option: '메시', voteCount: 50 },
				{ pk: 3, option: '마라도나', voteCount: 40 },
			],
			endAt: '2026-01-17T14:22:13.172Z',
			totalVoteCount: 100,
			isVoted: false,
			votedOptionPks: [2],
		}),
		[],
	);

	// 처음 게시글 작성 시에만 true (게시글 수정 시 false)
	const isEditable = node?.attrs?.isEditable ?? false;

	const pollMode: PollMode = editor?.isEditable ? 'create' : 'view';
	const pollStatus: PollStatus = pollData?.isClosed ? 'closed' : 'active';
	const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');

	useEffect(() => {
		const initialVoteStatus = pollData?.isVoted ? 'voted' : 'idle';
		setVoteStatus(initialVoteStatus);
	}, [pollData]);

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
		if (pollData) {
			setTitle(pollData.title);
			setOptions(pollData.options.map((o) => o.option));
			setEndAt(pollData.endAt);
			setIsMultipleChoice(pollData.isMultipleChoice);
		}
	}, [pollData]);

	return (
		<NodeViewWrapper
			className={clsx(
				'flex flex-col gap-4 pb-3 border border-black-300 rounded-lg',
				pollMode === 'create' && !isEditable && 'bg-black-100 pointer-events-none',
			)}
		>
			<div className="grid grid-cols-[1fr_auto] gap-10 justify-between items-center px-3 py-1.5 bg-black-200 rounded-t-lg">
				<span className="w-full text-header-01 max-w-full truncate">
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
							<VoteViewIcon />
							{pollData?.title ?? '투표 제목을 불러올 수 없습니다.'}
						</div>
					)}
				</span>

				<div className="flex gap-4 text-black-700">
					<div className="flex gap-2 items-center text-caption-01 font-medium">
						<span className={clsx('flex items-center', isEditable ? 'gap-0.5' : 'gap-1')}>
							투표 마감일
							<label
								className={isEditable ? 'cursor-pointer' : 'cursor-default'}
								tabIndex={0}
								role="button"
								onClick={() => datetimeRef?.current?.showPicker()}
							>
								<input
									ref={datetimeRef}
									type="datetime-local"
									value={toDateTimeLocal(endAt)}
									onChange={(e) => setEndAt(e.target.value)}
									className="w-4 outline-0"
								/>
								{`${endDate} ${endTime}`}
							</label>
						</span>
						{(isEditable || isMultipleChoice) && (
							<>
								<div className="h-3 w-px bg-black-700" />
								<span className="flex items-center gap-1">
									복수 선택
									<input
										type="checkbox"
										checked={isMultipleChoice ?? false}
										onChange={(e) => setIsMultipleChoice(e.target.checked)}
										className="cursor-pointer appearance-none relative bg-black-200 border border-black-700 w-3 h-3
											rounded-xs outline-0 checked:border-0 checked:bg-primary-900 before:absolute
											before:inset-x-0.5 before:inset-y-px before:mb-px text-white
											before:bg-[url('/check.svg')] before:bg-contain before:bg-no-repeat before:bg-center"
									/>
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
							<XIcon className="w-4 h-4 text-black-700" />
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
						pollData.options.map((content, i) => (
							<PollOptionItem
								key={content.pk}
								pollStatus={pollStatus}
								voteStatus={voteStatus}
								index={i + 1}
								pollOption={content}
								totalVoteCount={pollData.totalVoteCount}
								isVoted={false}
								checked={false}
								toggleCheck={(pk) => {
									return true;
								}}
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
