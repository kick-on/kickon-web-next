export function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
	return null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
	document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/`;
}

export function deleteCookie(name: string) {
	document.cookie = `${name}=''; max-age=1; path=/`;
}
