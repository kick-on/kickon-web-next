'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export default function useIsTablet() {
	const [isTablet, setIsTablet] = useState<boolean | null>(null);

	useEffect(() => {
		const device = UAParser().device;
		setIsTablet(device.type === 'tablet');
	}, []);

	return isTablet;
}
