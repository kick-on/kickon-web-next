import { getHalftimeList } from '@/services/apis/shorts/shorts.api';
import { HalftimeSortType } from '@/services/apis/shorts/shorts.type';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useHalftimeListQuery = (sort: HalftimeSortType, size: number) => {
	return useInfiniteQuery({
		queryKey: ['halftimeList', sort, size],
		queryFn: ({ pageParam }) => getHalftimeList({ sort, size, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined),
	});
};
