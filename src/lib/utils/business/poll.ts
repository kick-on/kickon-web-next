export const getEditingBoardPk = () => {
	const detailData = sessionStorage.getItem('detailContent');

	if (detailData) {
		const parsedData = JSON.parse(detailData);
		return parsedData.data.pk;
	}
	return null;
};
