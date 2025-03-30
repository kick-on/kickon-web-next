import { SuccessResponse } from '@/services/config/dto';

export interface PresignedUrlRequest {
	type: string;
	fileName: string;
}

export interface PresignedUrlResponse {
	presignedUrl: string;
	s3Url: string;
}

export type GetPresignedUrlResponse = SuccessResponse<PresignedUrlResponse>;
