import { SuccessResponse } from '@/services/config/dto';

export type GetBannerResposne = SuccessResponse<BannerDto[]>;

export interface BannerDto {
	id: string;
	title: string;
	thumbnailUrl: string;
	embeddedUrl: string;
	orderNum: number;
}
