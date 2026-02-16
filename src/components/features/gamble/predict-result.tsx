'use client';

import { useEffect, useState } from 'react';
import PredictCard from '../home/predict-card';
import { GameDto, GetMyPredictionsRequest } from '@/services/apis/game/game.type';
import { getMyPredictions } from '@/services/apis/game/game.api';
import { formatFromTo } from '@/lib/utils';
import NoGameCard from './no-game-card';
import Stat from './stat';
import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import { useRouter } from 'next/navigation';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useCalendarStore } from '@/lib/store/useCalendarStore';

export default function PredictResult() {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const { selectedDate } = useCalendarStore();
	const [games, setGames] = useState<GameDto[]>([]);
	const router = useRouter();

	useEffect(() => {
		if (!currentUserInfo) return;

		const apiCaller = async () => {
			const request: GetMyPredictionsRequest = {
				from: formatFromTo(selectedDate),
				to: formatFromTo(selectedDate),
			};

			try {
				const response = await getMyPredictions(request);
				setGames(response.data.games);
			} catch (error) {
				alert(error.message);
			}
		};

		apiCaller();
	}, [selectedDate, currentUserInfo]);

	if (!currentUserInfo) {
		router.replace('/gamble?type=match');
		return null;
	}

	return (
		<div className="space-y-9">
			<div className="pt-6 px-4 pb-13 border-b-16 border-black-100">
				<Stat />
			</div>

			<div className="px-4">
				<MatchPredictionCalendar type="predict" />
			</div>

			{games.length === 0 ? (
				<NoGameCard type="predict" onClick={() => router.replace('/gamble?type=match')} />
			) : (
				games.map((game, i) => (
					<div key={game.pk}>
						<PredictCard game={game} type="finished" />
						{i !== games.length - 1 && <hr className="mx-[1.125rem] border-black-200 my-2" />}
					</div>
				))
			)}
		</div>
	);
}
