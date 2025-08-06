'use client';

import ComponentFrame from '@/components/common/component-frame';
import TabBar from './tab-bar';
import { useState } from 'react';
import TopHalftime from './top-halftime';

export interface Tab {
	label: string;
	isActive: boolean;
}

export default function TopNewsHalftime() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const tabs = [
		{ label: '오늘의 하프타임🔥', isActive: selectedIndex === 0 },
		{ label: '많이 본 뉴스 TOP5', isActive: selectedIndex === 1 },
	];

	return (
		<ComponentFrame className="p-4 pb-6">
			<TabBar tabs={tabs} onClick={(i: number) => setSelectedIndex(i)} />

			{selectedIndex === 0 ? <TopHalftime /> : null}
		</ComponentFrame>
	);
}
