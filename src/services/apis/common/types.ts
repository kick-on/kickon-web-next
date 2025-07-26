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

// 뉴스 게시글 생성
export interface CommonCreatePostRequest {
	team: number;
	title: string;
	contents: string;
	usedImageKeys?: string[];
}
