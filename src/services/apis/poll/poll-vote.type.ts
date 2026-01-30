// 투표 참여
export interface CreateVoteRequest {
	poll: number;
	pollOptions: number[];
}

// 재투표
export interface EditVoteRequest {
	pollOptions: number[];
}

export interface EditVoteParams {
	pollPk: number;
	body: EditVoteRequest;
}
