'use client';

import { useState } from 'react';
import TabBar from './tab-bar';
import MatchOn from '../match-on';
import PredictResult from '../predict-result';

export default function CategoryTab() {
	const [selectedTab, setSelectedTab] = useState('매치ON');

	return (
		<div className="flex flex-col overflow-hidden">
			<TabBar selectedTab={selectedTab} onClickButton={(tab: string) => setSelectedTab(tab)} />

			{selectedTab === '매치ON' ? <MatchOn /> : <PredictResult />}
		</div>
	);
}
