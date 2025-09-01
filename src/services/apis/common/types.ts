import { TeamDto } from '../team/dto';
import { UserDto } from '../user/dto';

// 뉴스 게시글 목록
export interface CommonPostListDto {
	pk: number;
	title: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
}

// 뉴스 게시글 상세
export interface CommonPostDetailDto extends CommonPostListDto {
	content: string;
	isKicked: boolean;
	usedImageKeys: string[];
}

// 뉴스 게시글 생성
export interface CommonCreatePostRequest {
	team: number;
	title: string;
	contents: string;
	usedImageKeys?: string[];
	usedVideoKeys?: string[];
	embeddedLink?: string[];
}

// 댓글 상세
export interface CommonCommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	replies: CommonCommentDto[];
	kicked: boolean;
}

// 댓글 생성 요청
export interface CommonCreateNewReplyDto {
	parentReply?: number;
	contents: string;
}

// 댓글 수정 요청
export interface CommonPatchReplyDto {
	contents: string;
	usedImageKeys?: string[];
}

// 댓글 킥 요청
export interface CommonCommentKickDto {
	reply: number;
}

// 상세페이지 신고하기 요청
export interface CommonReportDetailDto {
	reason: string;
}
