import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export default async function getDeviceType() {
	let device: UAParser.IDevice | null = null;

	if (typeof window === 'undefined') {
		// 서버사이드
		const headerList = await headers();
		const uaString = headerList.get('user-agent') ?? '';
		device = UAParser(uaString).device;
	} else {
		// 클라이언트 사이드
		device = UAParser().device;
	}
	// 모바일 데스크톱 외 나머지는 모두 데스크톱으로 취급
	const isMobile = device.type === 'mobile';
	const isTablet = device.type === 'tablet';
	const isDesktop = device.type !== 'tablet' && device.type !== 'mobile';

	return { isMobile, isTablet, isDesktop };
}
