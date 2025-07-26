import { SuccessResponse } from '@/services/config/dto';
import { CommonDetailDto } from '../common/types';
import { categories } from '@/lib/constants/options';

// Enum
export type Category = (typeof categories)[number]['value'];

// 뉴스 상세 조회
export interface GetDetailDto extends CommonDetailDto {
	thumbnailUrl: string;
	category: Category;
}
export type GetDetailResponse = SuccessResponse<CommonDetailDto>;
