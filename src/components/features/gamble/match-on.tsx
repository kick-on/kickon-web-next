'use client';

import { useEffect, useState } from 'react';
import PredictCard from '../home/predict-card';
import { GameDto, GetGamesRequest } from '@/services/apis/game/dto';
import { getGames } from '@/services/apis/game';
import { formatFromTo } from '@/lib/utils';
import NoGameCard from './no-game-card';
import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import { getNextMatchDate } from '@/services/apis/calendar';

export default function MatchOn() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [games, setGames] = useState<GameDto[]>([]);
	const [trigger, setTrigger] = useState(0);

	// 가장 가까운 예정 경기일 조회
	useEffect(() => {
		async function fetchNextMatchDate() {
			try {
				const today = new Date();
				const todayStr = today.toISOString().split('T')[0];

				const response = await getNextMatchDate(todayStr);
				console.log(response);
				if (response?.data.nextDate) {
					const [year, month, day] = response.data.nextDate.split('-').map(Number);
					const date = new Date(year, month - 1, day);
					setSelectedDate(date);
				}
			} catch (e) {
				console.error('가장 가까운 예정 경기 날짜 가져오기 실패:', e);
			}
		}
		fetchNextMatchDate();
	}, [trigger]);

	// 날짜별 경기 리스트 조회
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
			<div className="px-4">
				<MatchPredictionCalendar type="match" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
			</div>

			<div>
				{games.length === 0 ? (
					<NoGameCard type="match" onClick={() => setTrigger(trigger + 1)} />
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
