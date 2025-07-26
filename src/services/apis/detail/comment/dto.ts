export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}

// 댓글 조회
export interface CommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	replies: string[];
	kicked: boolean;
}
