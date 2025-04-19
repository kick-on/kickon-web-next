'use client';
import { useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

export default function MinWidth() {
	const device = UAParser().device;

	useEffect(() => {
		if (device.type !== 'mobile') {
			document.body.style.minWidth = '48rem';
		}
	}, [device]);

	return null;
}
