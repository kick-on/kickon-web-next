'use client';

import React from 'react';
import type { PollOption, PollStatus, VoteStatus } from '@/components/common/poll/poll-component';
import clsx from 'clsx';
import CheckIcon from '@/assets/check.svg';

interface PollOptionItemProps {
	pollStatus: PollStatus;
	voteStatus: VoteStatus;
	index: number;
	pollOption: PollOption;
	totalVoteCount: number;
	isVoted: boolean;
	checked: boolean;
	toggleCheck: (pk: number) => boolean;
}

export default function PollOptionItem({
	pollStatus,
	voteStatus,
	index,
	pollOption,
	totalVoteCount,
	isVoted,
	checked,
	toggleCheck,
}: PollOptionItemProps) {
	const voteRate = Math.floor((pollOption.voteCount / totalVoteCount) * 100);

	const handleChange = () => {
		toggleCheck(pollOption.pk);
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2.5 pl-3 text-body-06 font-medium">
				{voteStatus === 'voting' || voteStatus === 'revoting' ? (
					<input
						type="checkbox"
						checked={checked}
						onChange={handleChange}
						className="relative appearance-none h-3 w-3 rounded-full border border-black-500
							checked:border-0 checked:bg-primary-900 before:absolute before:inset-x-0.5 before:inset-y-0
							before:bg-[url('/check.svg')] before:bg-contain before:bg-no-repeat before:bg-center text-white"
					/>
				) : (
					<div className="h-4 w-5 border-r border-black-300 leading-4">{index}</div>
				)}
				<div className="flex gap-1.5 items-center">
					<span>{pollOption.option}</span>
					{voteStatus === 'voted' && isVoted && (
						<CheckIcon className="w-2.5 h-2.5 text-primary-900 stroke-[1.5] mb-px" />
					)}
				</div>
			</div>

			{(pollStatus === 'closed' || voteStatus === 'voted' || voteStatus === 'revoting') && (
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
