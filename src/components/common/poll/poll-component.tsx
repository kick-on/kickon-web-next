'use client';

import React, { useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import XIcon from '@/assets/x.svg';
import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import { toDateTimeLocal } from '@/lib/utils/date/toDateTimeLocal';
import { formatDate } from '@/lib/utils';
import PollBottomButton from '@/components/common/poll/poll-bottom-button';

export type PollMode = 'create' | 'view';
export type PollStatus = 'active' | 'closed';
export type VoteStatus = 'idle' | 'voted' | 'revote';

interface PollContent {
	pk: number;
	content: string;
	voteCount: number;
}

interface PollComponentProps extends NodeViewProps {
	pollData?: {
		pk: number;
		title: string;
		isMultipleChoice: boolean;
		isClosed: boolean;
		contents: PollContent[];
		endAt: string;
		totalVoteCount: number;
		isVoted: boolean;
		votedOptionPks: number[];
	};
}

export default function PollComponent({ node, updateAttributes, deleteNode, pollData }: PollComponentProps) {
	const { editor } = useEditorContext();
	const datetimeRef = useRef<HTMLInputElement>(null);

	// 처음 게시글 작성 시에만 true (게시글 수정 시 false)
	const isEditable = node?.attrs?.isEditable;
	const [isRevoting, setIsRevoting] = useState(false);

	const pollMode: PollMode = editor?.isEditable ? 'create' : 'view';
	const pollStatus: PollStatus = pollData?.isClosed ? 'closed' : 'active';
	const voteStatus: VoteStatus = (() => {
		if (isRevoting) return 'revote';
		return pollData?.isVoted ? 'voted' : 'idle';
	})();

	const { formattedDate: endDate, formattedTime: endTime } = formatDate(pollData?.endAt);

	return (
		<NodeViewWrapper
			className={clsx(
				'flex flex-col gap-4 pb-3 border border-black-300 rounded-lg',
				!isEditable && 'bg-black-100 pointer-events-none',
			)}
		>
			<div className="grid grid-cols-[1fr_auto] gap-10 justify-between items-center px-3 py-1.5 bg-black-200 rounded-t-lg">
				<span className="w-full text-header-01 max-w-full truncate">
					{pollMode === 'create' ? (
						<input
							type="text"
							placeholder="투표 제목을 입력하세요."
							className="w-full placeholder:text-black-700 outline-0 py-1"
							value={pollData?.title ?? ''}
							onChange={(e) => updateAttributes({ question: e.target.value })}
						/>
					) : (
						<span className="w-full py-1">{pollData?.title ?? '투표 제목을 불러올 수 없습니다.'}</span>
					)}
				</span>

				<div className="flex gap-4 text-black-700">
					<div className="flex gap-2 items-center text-caption-01 font-medium">
						<span className="flex items-center gap-0.5">
							투표 마감일
							<label
								className="cursor-pointer"
								tabIndex={0}
								role="button"
								onClick={() => datetimeRef?.current?.showPicker()}
							>
								<input
									ref={datetimeRef}
									type="datetime-local"
									value={toDateTimeLocal(pollData?.endAt)}
									className="w-4 outline-0"
								/>
								{`${endDate} ${endTime}`}
							</label>
						</span>
						{(isEditable || pollData?.isMultipleChoice) && (
							<>
								<div className="h-3 w-px bg-black-700" />
								<span className="flex items-center gap-1">
									복수 선택
									<input
										type="checkbox"
										checked={pollData?.isMultipleChoice ?? false}
										className="cursor-pointer appearance-none bg-black-200 border border-black-700 w-3 h-3 rounded-xs outline-0"
									/>
								</span>
							</>
						)}
					</div>
					{isEditable && (
						<button onClick={deleteNode} className="" aria-label="삭제">
							<XIcon className="w-4 h-4 text-black-700" />
						</button>
					)}
				</div>
			</div>

			{/* 항목 목록 */}
			<div className="space-y-4 pl-2 pr-4">
				{[1, 2].map((option, index) => (
					<div key={index} className="flex items-center gap-2.5">
						<div className="h-4 border-r border-black-300 w-8 text-center text-body-05">{index + 1}</div>
						<input
							type="text"
							className="flex-1 p-2 rounded bg-black-100  text-body-05 outline-0"
							placeholder="내용을 입력하세요."
							value={''}
							onChange={(e) => {}}
						/>
					</div>
				))}
			</div>

			<PollBottomButton pollMode={pollMode} pollStatus={pollStatus} voteStatus={voteStatus} />
		</NodeViewWrapper>
	);
}
