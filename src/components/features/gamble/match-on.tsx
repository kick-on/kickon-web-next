'use client';

import { useEffect, useState } from 'react';
import PredictCard from '../home/predict-card';
import { GameDto, GetGamesRequest } from '@/services/apis/game/dto';
import { getGames } from '@/services/apis/game';
import { formatFromTo } from '@/lib/utils/formatFromTo';
import NoGameCard from '../home/no-game-card';

export default function MatchOn() {
	const [selectedDate, setSelectedDate] = useState(new Date('2025-07-19'));
	const [games, setGames] = useState<GameDto[]>([]);

	useEffect(() => {
		const apiCaller = async () => {
			const request: GetGamesRequest = {
				league: 1,
				status: 'proceeding',
				from: formatFromTo(selectedDate),
				to: formatFromTo(selectedDate),
			};

			try {
				const response = await getGames(request);

				if (response) {
					setGames(response.data.games);
				}
			} catch (error) {
				console.error(error);
			}
		};

		apiCaller();
	}, [selectedDate]);

	return (
		<div className="pt-6 space-y-9">
			<div>캘린더</div>

			{games.length === 0 ? (
				<NoGameCard />
			) : (
				games.map((game, i) => (
					<div key={game.pk}>
						<PredictCard game={game} type="proceeding" />
						{i !== games.length - 1 && <hr className="mx-[1.125rem] border-black-200 my-2" />}
					</div>
				))
			)}
		</div>
	);
}
