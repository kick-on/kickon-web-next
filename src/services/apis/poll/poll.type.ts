import { SuccessResponse } from '@/services/config/dto';

// common
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

export interface PollOption {
	pk: number;
	content: string;
	voteCount: number;
}

// 투표 조회
export type GetPollResponse = SuccessResponse<PollDto>;

// 투표 생성
export interface CreatePollRequest {
	title: string;
	endAt: string;
	isMultipleChoice: boolean;
	contents: string[];
	board: number;
}

export type CreatePollResponse = SuccessResponse<PollDto>;
