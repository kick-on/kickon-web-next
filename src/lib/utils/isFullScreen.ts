// 숨겨야 할 전체화면 경로 리스트
const fullScreenRoutes = ['/notice'];
const fullScreenRoutePatterns = [/^\/halftime\/[^/]+$/]; // 뒤에 id가 있는 경우

export const isFullScreen = (pathname: string): boolean => {
	// 정확히 일치하는 경로
	if (fullScreenRoutes.includes(pathname)) return true;

	// 패턴에 일치하는 경로
	return fullScreenRoutePatterns.some((pattern) => pattern.test(pathname));
};
