import { PostNewsContentsRequest } from './dto';
import { GetDetailResponse } from '../detail/dto';
import { fetcher } from '@/lib/server/fetcher';

export async function postNewContents(
	data: PostNewsContentsRequest,
	isNews: boolean = false,
): Promise<GetDetailResponse> {
	try {
		const endpoint = isNews ? '/api/news' : '/api/board';
		console.log(endpoint);
		const response = await fetcher<GetDetailResponse>({ method: 'POST', url: endpoint, body: data });

		return response;
	} catch (error) {
		console.error('API 요청 실패:', error);
		throw error;
	}
}
