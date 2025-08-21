import { getHalftimeList } from '@/services/apis/shorts/shorts.api';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useHalftimeListQuery(sort, size) {
	return useInfiniteQuery({
		queryKey: ['halftimeList', sort, size],
		queryFn: ({ pageParam }) => {
			return getHalftimeList({ sort, size, page: pageParam });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (lastPage.meta.hasNext) {
				return lastPageParam + 1;
			}
			return undefined;
		},
	});
}
