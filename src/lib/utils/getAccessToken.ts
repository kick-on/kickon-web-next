export const getAccessToken = (): string | null => {
	if (typeof window === 'undefined') return null; // SSR 방지
	return localStorage.getItem('accessToken');
};
export const getRefreshToken = (): string | null => {
	if (typeof window === 'undefined') return null; // SSR 방지
	return localStorage.getItem('refreshToken');
};
