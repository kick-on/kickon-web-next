export interface BaseSuccessResponse<T> {
	code: string;
	message: string;
	data: T;
	meta: MetaDto;
}

export interface MetaDto {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}
