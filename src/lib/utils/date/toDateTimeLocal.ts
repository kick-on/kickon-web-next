export const toDateTimeLocal = (isoString: string) => {
	if (!isoString) return '';

	const date = new Date(isoString);
	// 현재 브라우저의 시간대(KST)로 오프셋 보정
	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

	// ISO 문자열로 바꾼 뒤 뒤에 Z와 초 단위 등을 잘라냄 (YYYY-MM-DDThh:mm)
	return localDate.toISOString().slice(0, 16);
};
