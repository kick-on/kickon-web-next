import { TeamDto } from '../team/dto';
import { UserDto } from '../user/dto';

// 뉴스 게시글 상세
export interface CommonDetailDto {
	pk: number;
	title: string;
	content: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
	isKicked: boolean;
	thumbnailUrl: string;
	category: string;
	usedImageKeys: string[];
}

// 댓글 상세
export interface CommonCommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	replies: string[];
	kicked: boolean;
}

// 댓글 생성 요청
export interface CommonCreateNewReply {
	parentReply?: number;
	contents: string;
}

// 댓글 수정 요청
export interface CommonPatchReply {
	contents: string;
	usedImageKeys?: string[];
}
