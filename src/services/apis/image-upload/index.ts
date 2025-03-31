import { SERVER_URL } from '@/services/config/constants';
import { PresignedUrlRequest, GetPresignedUrlResponse } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';

export async function getPresignedUrl(fileName: string, isNews: boolean): Promise<GetPresignedUrlResponse> {
	const requestBody: PresignedUrlRequest = {
		type: isNews ? 'news-images' : 'board-images',
		fileName: fileName,
	};

	const response = await fetch(`${SERVER_URL}/api/aws/presigned-url`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('presigned Url 요청 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('presigned Url 요청 실패');
	}

	return response.json();
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<EmptySuccessResponse> {
	const response = await fetch(presignedUrl, {
		method: 'PUT',
		headers: {
			'x-amz-acl': 'public-read', // S3에서 공개적으로 읽을 수 있도록 설정
		},
		body: file, // `file`을 그대로 body에 넣어야 함! (JSON X)
	});

	if (!response.ok) {
		const errorText = await response.text(); // 응답 본문 확인
		console.error('S3 업로드 실패 - 응답 상태:', response.status, response.statusText);
		console.error('S3 응답 본문:', errorText);
		throw new Error('S3 업로드 실패');
	}
	return response.json();
}
