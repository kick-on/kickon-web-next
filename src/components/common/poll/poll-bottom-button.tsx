'use client';

import type { PollMode, PollStatus, VoteStatus } from '@/components/common/poll/poll-component';
import React from 'react';
import { usePollStore } from '@/lib/store/usePollStore';
import { useClosePollMutation, useCreateVoteMutation, useEditVoteMutation } from '@/lib/hooks/queries/usePollQuery';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

interface PollBottomButtonProps {
	pollMode: PollMode;
	pollStatus: PollStatus;
	voteStatus: VoteStatus;
	setVoteStatus: (value: VoteStatus) => void;
	checkedOptionPks: number[];
	pollPk: number | undefined;
	isMyPoll: boolean;
}

const baseButtonClassName =
	'flex-1 text-button-03 py-2.5 bg-black-200 hover:bg-black-300 rounded transition-colors text-black-700 @mobile:text-button-04 disabled:text-black-400';

export default function PollBottomButton({
	pollMode,
	pollStatus,
	voteStatus,
	setVoteStatus,
	checkedOptionPks,
	pollPk,
	isMyPoll,
}: PollBottomButtonProps) {
	const { options, setOptions } = usePollStore();
	const createVoteMutation = useCreateVoteMutation();
	const editVoteMutation = useEditVoteMutation();
	const closePollMutation = useClosePollMutation();

	const isConfirmButtonDisabled = checkedOptionPks.length === 0 || Number.isNaN(pollPk);

	const handleVoteConfirm = async () => {
		await createVoteMutation.mutateAsync({
			poll: pollPk,
			pollOptions: checkedOptionPks,
		});
	};

	const handleRevoteConfirm = async () => {
		await editVoteMutation.mutateAsync({
			pollPk,
			body: {
				pollOptions: checkedOptionPks,
			},
		});
	};

	const handlePollClose = async () => {
		await closePollMutation.mutateAsync(pollPk);
	};

	const { currentUserInfo } = useCurrentUserInfoStore();

	if (!currentUserInfo) {
		return (
			<div className="text-caption-01 text-center bg-primary-50 py-1 rounded-b-lg -mb-3">
				결과를 확인하려면 로그인하고 투표에 참여하세요!
			</div>
		);
	}

	if (pollMode === 'create') {
		return (
			<button onClick={() => setOptions([...options, ''])} className={`${baseButtonClassName} mx-4 @mobile:mx-3`}>
				+ 항목 추가
			</button>
		);
	}

	if (pollStatus === 'closed') {
		return null;
	}

	if (voteStatus === 'idle') {
		return (
			<button onClick={() => setVoteStatus('voting')} className={`${baseButtonClassName} mx-4 @mobile:mx-3`}>
				투표하기
			</button>
		);
	}

	if (voteStatus === 'voting') {
		return (
			<div className="flex gap-4 mx-4 @mobile:gap-2 @mobile:mx-3">
				<button onClick={() => setVoteStatus('idle')} className={baseButtonClassName}>
					취소
				</button>
				<button disabled={isConfirmButtonDisabled} onClick={handleVoteConfirm} className={baseButtonClassName}>
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
				<button disabled={isConfirmButtonDisabled} onClick={handleRevoteConfirm} className={baseButtonClassName}>
					확인
				</button>
			</div>
		);
	}

	if (voteStatus === 'voted') {
		return (
			<div className="flex gap-4 mx-4 @mobile:gap-2 @mobile:mx-3">
				<button onClick={() => setVoteStatus('revoting')} className={baseButtonClassName}>
					다시 투표하기
				</button>
				{isMyPoll && (
					<button disabled={Number.isNaN(pollPk)} onClick={handlePollClose} className={baseButtonClassName}>
						투표 종료
					</button>
				)}
			</div>
		);
	}
}
