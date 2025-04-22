'use client';
import { useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

export default function MinWidth() {
	useEffect(() => {
		const device = UAParser().device;
		if (device.type !== 'mobile') {
			document.body.style.minWidth = '48rem';
		}
	}, []);

	return null;
}
