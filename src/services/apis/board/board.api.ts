import { fetcher } from '@/lib/server/fetcher';
import {
	GetBoardDetailResponse,
	GetBoardListRequest,
	GetBoardListResponse,
	GetRecommendedBoardRequest,
	GetRecommendedBoardResponse,
	PatchBoardDetailRequest,
	CreateBoardRequest,
	CreateBoardResponse,
} from './board.type';
import { SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

// 게시글 리스트 조회
export const getBoardList = async ({
	team,
	size,
	page,
	order,
	infinite,
	lastBoard,
	lastViewCount,
}: GetBoardListRequest) => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));
	// 무한 스크롤
	if (infinite !== undefined) params.append('infinite', String(infinite));
	if (lastBoard !== undefined) params.append('lastBoard', String(lastBoard));
	if (lastViewCount !== undefined) params.append('lastViewCount', String(lastViewCount));

	try {
		const response = await fetcher<GetBoardListResponse | FailResponse>({
			method: 'GET',
			url: `/api/board?${params.toString()}`,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error('게시글 리스트 조회 실패: ', `${SERVER_URL}/api/board?${params.toString()}`, response);
			return null;
		}

		return response;
	} catch (error) {
		console.error('게시글 리스트 조회 실패: ', `${SERVER_URL}/api/board?${params.toString()}`, error);
	}
};

// 게시글 상세 조회
export const getBoardDetail = async (id: number): Promise<GetBoardDetailResponse | null> => {
	try {
		const response = await fetcher<GetBoardDetailResponse>({ method: 'GET', url: `/api/board/${id}` });

		if (!response) {
			console.error('게시글 상세 조회 실패 - 응답 없음');
			throw new Error('게시글 상세 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('게시글 상세 조회 실패:', error);
		throw error;
	}
};

// 게시글 생성
export async function createBoard(data: CreateBoardRequest): Promise<CreateBoardResponse> {
	try {
		const response = await fetcher<CreateBoardResponse>({ method: 'POST', url: '/api/board', body: data });

		return response;
	} catch (error) {
		console.error('API 요청 실패:', error);
		throw error;
	}
}

// 게시글 수정
export const patchBoardDetail = async (
	boardPk: number,
	requestBody: PatchBoardDetailRequest,
): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'PATCH',
			url: `/api/board/${boardPk}`,
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('게시글 수정 실패:', error);
		throw error;
	}
};

// 게시글 삭제
export const deleteBoardDetail = async (boardPk: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: `/api/board/${boardPk}` });

		return response;
	} catch (error) {
		console.error('게시글 삭제 실패:', error);
		throw error;
	}
};

// 함께 볼 만한 게시글 조회
export const getRecommendedBoard = async ({ type }: GetRecommendedBoardRequest) => {
	const params = new URLSearchParams();

	if (type !== undefined) params.append('type', type);

	const response = await fetcher<GetRecommendedBoardResponse | null>({
		method: 'GET',
		url: `/api/board/home?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error(response);
		return null;
	}
	return response;
};

// 게시글 상세페이지 킥
export const createBoardKick = async (id: number): Promise<EmptySuccessResponse> => {
	try {
		const body = { board: id };
		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: '/api/board-kick', body });

		return response;
	} catch (error) {
		console.error('게시글 상세페이지 킥 생성 실패:', error);
		throw error;
	}
};
