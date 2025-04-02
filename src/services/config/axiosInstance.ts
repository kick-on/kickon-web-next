import axios, {
	AxiosInstance,
	AxiosInterceptorManager,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';
import { SERVER_URL } from './constants';
import { postNewToken } from '../auth';

interface CustomInstance extends AxiosInstance {
	interceptors: {
		request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse>;
	};
	getUri(config?: AxiosRequestConfig): string;
	request<T>(config: AxiosRequestConfig): Promise<T>;
	get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
	delete<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
	options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const axiosInstance: CustomInstance = axios.create({
	baseURL: SERVER_URL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config;

		if (error.response) {
			// 인증 실패 시
			if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
				originalRequest._retry = true; // 무한 루프 방지

				const prevRefreshToken = localStorage.getItem('refreshToken');

				// 리프레시 토큰이 있으면 토큰 재발급 후 다시 시도
				if (prevRefreshToken) {
					const newTokenResponse = await postNewToken({ refreshToken: prevRefreshToken });

					// 토큰 재발급 성공
					if (newTokenResponse && typeof newTokenResponse !== 'string') {
						// 새 토큰 저장
						localStorage.setItem('refreshToken', newTokenResponse.refreshToken);
						localStorage.setItem('accessToken', newTokenResponse.accessToken);

						// 요청 재시도
						originalRequest.headers.Authorization = `Bearer ${newTokenResponse.accessToken}`;
						return axiosInstance(originalRequest);
					} else {
						// 토큰 재발급 실패
						localStorage.clear();
					}
				}
			}

			// 그 외 서버 응답이 있는 오류 (FailResponse)
			return error.response.data;
		}
		return Promise.reject(error); // 기타 오류
	},
);

export default axiosInstance;
