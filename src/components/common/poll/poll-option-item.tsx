'use client';

import React from 'react';
import type { PollContent, PollStatus, VoteStatus } from '@/components/common/poll/poll-component';
import clsx from 'clsx';
import CheckIcon from '@/assets/check.svg';

interface PollOptionItemProps {
	pollStatus: PollStatus;
	voteStatus: VoteStatus;
	index: number;
	pollContent: PollContent;
	totalVoteCount: number;
	isVoted: boolean;
	checked: boolean;
	toggleCheck: (pk: number) => boolean;
}

export default function PollOptionItem({
	pollStatus,
	voteStatus,
	index,
	pollContent,
	totalVoteCount,
	isVoted,
	checked,
	toggleCheck,
}: PollOptionItemProps) {
	const voteRate = Math.floor((pollContent.voteCount / totalVoteCount) * 100);

	const handleChange = () => {
		toggleCheck(pollContent.pk);
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2.5 text-body-06 font-medium">
				{voteStatus === 'revote' ? (
					<input
						type="checkbox"
						checked={checked}
						onChange={handleChange}
						className="appearance-none h-4 w-4 ml-4 rounded-full"
					/>
				) : (
					<div className="h-4 w-8 border-r border-black-300 text-center leading-4">{index}</div>
				)}
				<div className="flex gap-1.5 items-center">
					<span>{pollContent.content}</span>
					{voteStatus === 'voted' && isVoted && (
						<CheckIcon className="w-2.5 h-2.5 text-primary-900 stroke-[1.5] mb-px" />
					)}
				</div>
			</div>

			{(pollStatus === 'closed' || (voteStatus !== 'idle' && pollContent)) && (
				<div className="flex gap-3 w-full px-3 items-center">
					<div className="relative h-1 w-full max-w-sm rounded-full bg-black-200">
						<div
							style={{ width: `${voteRate}%` }}
							className={clsx('absolute h-full rounded-full', isVoted ? 'bg-primary-900' : 'bg-black-500')}
						/>
					</div>
					<span className="text-caption-02 text-black-800">({voteRate}%)</span>
				</div>
			)}
		</div>
	);
}
