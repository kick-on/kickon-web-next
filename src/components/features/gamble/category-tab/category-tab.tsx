'use client';

import { useState } from 'react';
import TabBar from './tab-bar';
import Stat from '../stat';
import MatchOn from '../match-on';

export default function CategoryTab() {
	const [selectedTab, setSelectedTab] = useState('매치ON');

	return (
		<div className="flex flex-col overflow-hidden">
			<TabBar selectedTab={selectedTab} onClickButton={(tab: string) => setSelectedTab(tab)} />

			{selectedTab === '매치ON' ? (
				<MatchOn />
			) : (
				<div className="mt-4 mx-4 mb-13">
					<Stat />
				</div>
			)}
		</div>
	);
}
