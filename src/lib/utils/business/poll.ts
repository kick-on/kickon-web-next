export const getBoardPk = (pathname: string, isPostPage: boolean, isPostEditing: boolean) => {
	// 게시글 작성
	if (isPostPage && !isPostEditing) {
		return null;
	}

	// 게시글 수정
	if (isPostPage && isPostEditing) {
		const detailData = sessionStorage.getItem('detailContent');

		if (detailData) {
			const parsedData = JSON.parse(detailData);
			return parsedData.data.pk;
		}
		return null;
	}

	// 게시글 조회
	const segments = pathname.split('/');
	const boardPk = segments.find((segment) => /^\d+$/.test(segment));

	if (boardPk) {
		return Number(boardPk);
	}

	return null;
};
