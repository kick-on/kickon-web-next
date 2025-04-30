export const getTimestampedFileName = (originalName: string) => {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, '0'); // 숫자를 항상 두 자리로 패딩 처리 5 -> 05

	const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`; // getMonth는 0부터 시작

	const dotIndex = originalName.lastIndexOf('.'); // 확장자 구분
	const name = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName; // 파일명 부분
	const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : ''; // 확장자 부분

	return `${name}_${timestamp}${ext}`;
};
