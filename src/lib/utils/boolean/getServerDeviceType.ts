import { UAParser } from 'ua-parser-js';

export function getServerDeviceType() {
	const device = UAParser().device;

	// 모바일 데스크톱 외 나머지는 모두 데스크톱으로 취급
	const isMobile = device.type === 'mobile';
	const isTablet = device.type === 'tablet';
	const isDesktop = device.type !== 'tablet' && device.type !== 'mobile';

	return { isMobile, isTablet, isDesktop };
}
