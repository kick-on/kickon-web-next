'use client';

import type { PollMode, PollStatus, VoteStatus } from '@/components/common/poll/poll-component';
import React from 'react';

interface PollBottomButtonProps {
	pollMode: PollMode;
	pollStatus: PollStatus;
	voteStatus: VoteStatus;
	setVoteStatus: (value: VoteStatus) => void;
}

const baseButtonClassName =
	'flex-1 text-button-03 py-2.5 bg-black-200 hover:bg-black-300 rounded transition-colors text-black-700';

export default function PollBottomButton({ pollMode, pollStatus, voteStatus, setVoteStatus }: PollBottomButtonProps) {
	if (pollMode === 'create') {
		return (
			<button onClick={() => {}} className={`${baseButtonClassName} mx-4`}>
				+ 항목 추가
			</button>
		);
	}

	if (pollStatus === 'closed') {
		return null;
	}

	if (voteStatus === 'idle') {
		return (
			<button onClick={() => setVoteStatus('voting')} className={`${baseButtonClassName} mx-4`}>
				투표하기
			</button>
		);
	}

	if (voteStatus === 'voted') {
		const isMyVote = true;
		return (
			<div className="flex gap-4 mx-4">
				<button onClick={() => setVoteStatus('revoting')} className={baseButtonClassName}>
					다시 투표하기
				</button>
				{isMyVote && (
					<button onClick={() => {}} className={baseButtonClassName}>
						투표 종료
					</button>
				)}
			</div>
		);
	}

	if (voteStatus === 'voting') {
		return (
			<div className="flex gap-4 mx-4">
				<button onClick={() => setVoteStatus('idle')} className={baseButtonClassName}>
					취소
				</button>
				<button onClick={() => setVoteStatus('voted')} className={baseButtonClassName}>
					확인
				</button>
			</div>
		);
	}

	if (voteStatus === 'revoting') {
		return (
			<div className="flex gap-4 mx-4">
				<button onClick={() => setVoteStatus('voted')} className={baseButtonClassName}>
					취소
				</button>
				<button onClick={() => setVoteStatus('voted')} className={baseButtonClassName}>
					확인
				</button>
			</div>
		);
	}
}
