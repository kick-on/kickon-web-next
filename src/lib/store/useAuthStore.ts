import { create } from 'zustand';
import { deleteCookie, getCookie } from '../utils';

interface AuthStore {
	accessToken: string | null;
	setToken: (token: string) => void;
	clearToken: () => void;
	getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	accessToken: null,

	setToken: (token) => {
		set({ accessToken: token });
	},

	clearToken: () => {
		set({ accessToken: null });
	},

	// 쿠키에서 토큰을 가져옴
	getToken: () => {
		const stateToken = get().accessToken;
		if (stateToken) {
			return stateToken;
		}

		const cookieToken = getCookie('accessToken');
		if (cookieToken) {
			deleteCookie('accessToken');
			set({ accessToken: cookieToken });
			return cookieToken;
		}

		return null;
	},
}));

export default useAuthStore;
