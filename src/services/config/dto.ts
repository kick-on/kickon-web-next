export interface BaseResponse<T = Record<string, never>, M = MetaDto | null> {
	code: string;
	message: string;
	data: T;
	meta: M;
}

// 성공 응답 (데이터가 없는 경우)
export type EmptySuccessResponse = BaseResponse<Record<string, never>, MetaDto>;

// 성공 응답 (데이터가 있는 경우)
export type SuccessResponse<T> = BaseResponse<T, MetaDto>;

// 실패 응답
export type FailResponse = BaseResponse<null, null>;

export interface MetaDto {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasNext: boolean;
}
