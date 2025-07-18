'use client';

import { useEffect, useState } from 'react';
import PredictCard from '../home/predict-card';
import { GameDto, GetGamesRequest } from '@/services/apis/game/dto';
import { getGames } from '@/services/apis/game';
import { formatFromTo } from '@/lib/utils/formatFromTo';
import NoGameCard from '../home/no-game-card';
import MatchPredictionCalendar from '@/components/common/calendar';

export default function MatchOn() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [games, setGames] = useState<GameDto[]>([]);

	useEffect(() => {
		const apiCaller = async () => {
			const request: GetGamesRequest = {
				league: 1,
				status: 'proceeding',
				from: formatFromTo(selectedDate),
				to: formatFromTo(selectedDate),
			};
			console.log(request);

			try {
				const response = await getGames(request);

				if (response) {
					setGames(response.data.games);
				} else {
					alert('실패');
				}
			} catch (error) {
				console.error(error);
			}
		};

		apiCaller();
	}, [selectedDate]);

	return (
		<div className="pt-6 space-y-9">
			<div>
				<MatchPredictionCalendar type="match" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
			</div>

			<div>
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
		</div>
	);
}
