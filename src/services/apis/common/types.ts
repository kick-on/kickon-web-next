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
}
