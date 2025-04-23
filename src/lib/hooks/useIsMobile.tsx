'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const device = UAParser().device;
		setIsMobile(device.type === 'mobile');
	}, []);

	return isMobile;
}
