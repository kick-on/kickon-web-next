export const getAuthToken = (): string | null => {
	if (typeof window === 'undefined') return null; // SSR 방지
	return localStorage.getItem('accessToken');
};
