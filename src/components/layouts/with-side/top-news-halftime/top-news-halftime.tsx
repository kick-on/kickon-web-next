'use client';

import ComponentFrame from '@/components/common/component-frame';
import TabBar from './tab-bar';
import { useState } from 'react';
import TopHalftime from './top-halftime';
import TopNews from './top-news';
import useTopNews from '@/lib/hooks/useTopNews';

export interface Tab {
	label: string;
	isActive: boolean;
}

export default function TopNewsHalftime() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { news, newsTab } = useTopNews(); // 초기 렌더링 시 조회된 news 타입에 따라 tab 반영
	const tabs = [
		{ label: '오늘의 하프타임🔥', isActive: selectedIndex === 0 },
		{ label: newsTab, isActive: selectedIndex === 1 },
	];

	return (
		<ComponentFrame className={`p-4 space-y-2.5 ${selectedIndex === 0 ? 'pb-6' : 'pb-0'}`}>
			<TabBar tabs={tabs} onClick={(i: number) => setSelectedIndex(i)} />

			{selectedIndex === 0 ? <TopHalftime /> : <TopNews news={news} />}
		</ComponentFrame>
	);
}
