export const appendParams = <T>(params: URLSearchParams, req: T) => {
	Object.entries(req).forEach(([key, value]) => {
		if (value !== undefined) {
			params.append(key, String(value));
		}
	});
};
