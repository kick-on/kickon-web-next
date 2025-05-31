export const addTimestampToFileName = (originalName: string) => {
	const now = new Date();

	// Intl.DateTimeFormat을 사용해 날짜와 시간 부분을 각각 숫자로 포맷
	const formatter = new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const parts = formatter.formatToParts(now);
	const timestamp = parts
		.filter((part) => part.type !== 'literal') // '.', ' ', ':' 같은 구분자는 제외
		.map((part) => part.value)
		.join(''); // "20250503145809" 같은 문자열로 변환

	const dotIndex = originalName.lastIndexOf('.');
	const name = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
	const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';

	// 특수문자 제거 + 공백은 언더바로 대체
	const cleanedName = name.replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, '_');

	return `${cleanedName}_${timestamp}${ext}`;
};

export function extractImageFilenamesFromContent(content: string): string[] {
	const regex = /<img[^>]+src=["']([^"']+)["']/g;
	// <img 태그로 시작하고, src 속성이 올 때까지 모든 속성을 허용
	// src="..." 또는 src='...' 형태의 URL을 추출

	const matches = []; // 추출한 파일명을 담을 배열
	let match; // regex.exec()로 찾은 결과를 저장할 변수

	while ((match = regex.exec(content)) !== null) {
		// 정규식을 이용해 content 문자열에서 <img src="...">를 반복으로 찾아냄
		const url = match[1];
		const filename = decodeURIComponent(url.split('/').pop() || '');
		if (filename) matches.push(filename);
	}

	return matches;
}
