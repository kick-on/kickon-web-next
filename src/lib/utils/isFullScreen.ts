export const isFullScreen = (pathname: string) => {
	// 모바일 하프타임 동적라우팅 ex. /halftime/[id]
	if (pathname.includes('halftime') && pathname.split('/').at(-1) !== 'halftime') {
		return true;
	}

	return false;
};
