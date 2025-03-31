export const getTimeAgo = (createdAt: string) => {
	const now = new Date();
	const date = new Date(createdAt);
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // 초 단위 차이 계산

	if (diff < 60) return `${diff}초 전`;
	const minutes = Math.floor(diff / 60);
	if (minutes < 60) return `${minutes}분 전`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}시간 전`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}일 전`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}개월 전`;
	const years = Math.floor(days / 365);
	return `${years}년 전`;
};
