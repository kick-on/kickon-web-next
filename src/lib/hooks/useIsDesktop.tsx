'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export default function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

	useEffect(() => {
		const device = UAParser().device;
		setIsDesktop(device.type !== 'mobile' && device.type !== 'tablet');
	}, []);

	return isDesktop;
}
