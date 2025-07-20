'use client';

import TabBar from './tab-bar';
import MatchOn from '../match-on';
import PredictResult from '../predict-result';
import { useSearchParams } from 'next/navigation';

export default function CategoryTab() {
	const searchParams = useSearchParams();
	const type = searchParams.get('type') ?? 'match';

	return (
		<div className="flex flex-col overflow-hidden">
			<TabBar type={type} />

			{type === 'match' ? <MatchOn /> : <PredictResult />}
		</div>
	);
}
