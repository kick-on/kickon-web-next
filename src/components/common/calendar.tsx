'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';
import { getMonthlyMatchList, getMyPredictionDates, getPredictionOpenPeriod } from '@/services/apis/calendar';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { formatFromTo, getEndOfWeek, getStartOfWeek, getTileClassName, stripTime } from '@/lib/utils';

import { NavigationLabel } from '../features/calendar/renderers/render-navigation-label';
import { RenderTileContent } from '../features/calendar/renderers/render-tile-content';

interface MatchPredictionCalendarProps {
	type: 'match' | 'predict';
	selectedDate: Date;
	setSelectedDate: (date: Date) => void; // 선택한 날짜 상위로 올림
}

export default function MatchPredictionCalendar({ selectedDate, setSelectedDate, type }: MatchPredictionCalendarProps) {
	const isMobile = useIsMobile();
	const router = useRouter();
	const searchParams = useSearchParams();

	const isMatch = type === 'match';

	const [isWeekCalendar, setIsWeekCalendar] = useState(isMatch ? false : true); // 주 단위 캘린더인가 (접힌 상태인가)
	const [markedDatesMap, setMarkedDatesMap] = useState<Record<string, number>>({}); // 경기가 있는 날짜들
	const [predictionRange, setPredictionRange] = useState<{
		start: Date;
		end: Date;
	} | null>(null);

	const getYearMonthFromUrl = () => {
		const year = searchParams.get('year');
		const month = searchParams.get('month');

		if (year && month) {
			return new Date(parseInt(year), parseInt(month) - 1, 1);
		}

		// 파라미터가 없으면 현재 월
		const today = new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	};

	const [firstDayOfCurrentMonth, setFirstDayOfCurrentMonth] = useState(getYearMonthFromUrl); // 현재 월의 첫째 날

	// URL 파라미터 업데이트
	const updateUrlParams = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	// URL 파라미터가 변경될 때 새로운 월의 첫째 날 업데이트
	useEffect(() => {
		const newMonthStart = getYearMonthFromUrl();
		setFirstDayOfCurrentMonth(newMonthStart);
	}, [searchParams]);

	// 승부 예측 가능 기간 조회
	useEffect(() => {
		async function fetchPredictionDates() {
			try {
				const response = await getPredictionOpenPeriod();
				console.log(response);
				if (response?.data) {
					const { startDate, endDate } = response.data;
					setPredictionRange({
						start: new Date(startDate),
						end: new Date(endDate),
					});
				}
			} catch (e) {
				console.error('승부예측 가능 날짜 범위 불러오기 실패:', e);
			}
		}

		fetchPredictionDates();
	}, []);

	// 월이 변경되면 해당 월의 경기 날짜 조회 + 상위로 변경된 월의 1일 전달 (가장 가까운 경기 날 조회)
	useEffect(() => {
		async function fetchMarkedDates() {
			try {
				const formattedDate = formatFromTo(firstDayOfCurrentMonth);
				const response = isMatch ? await getMonthlyMatchList(formattedDate) : await getMyPredictionDates();
				console.log(response);
				if (response?.data?.dates) {
					const parsedDates = response.data.dates.map((d) => {
						const [year, month, day] = d.date.split('-').map(Number);
						return new Date(year, month - 1, day);
					});

					console.log(parsedDates);
					const countMap: Record<string, number> = {};
					response.data.dates.forEach(({ date, count }) => {
						countMap[date] = count;
					});
					setMarkedDatesMap(countMap);
				}
			} catch (e) {
				console.error('캘린더 점찍기용 날짜 조회 실패:', e);
			}
		}
		//setSelectedDate(firstDayOfCurrentMonth); -> 서버 복구되면 재시도

		fetchMarkedDates();
	}, [firstDayOfCurrentMonth, isMatch]);

	const today = stripTime(new Date());

	const handleMonthChange = (direction: 'prev' | 'next') => {
		const currentYear = firstDayOfCurrentMonth.getFullYear();
		const currentMonth = firstDayOfCurrentMonth.getMonth();

		let newYear = currentYear;
		let newMonth = currentMonth + (direction === 'next' ? 1 : -1);

		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		} else if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}

		const newDate = new Date(newYear, newMonth, 1);
		updateUrlParams(newDate);
	};

	const handleYearChange = (newYear: number) => {
		const newDate = new Date(newYear, firstDayOfCurrentMonth.getMonth(), 1);
		updateUrlParams(newDate);
	};

	// predictionRange가 있으면 start 기준으로 이전 달 이동 막기
	const canGoPrevMonth = predictionRange
		? firstDayOfCurrentMonth.getTime() >
			new Date(predictionRange.start.getFullYear(), predictionRange.start.getMonth(), 1).getTime()
		: true;

	// predictionRange가 있으면 end 기준으로 다음 달 이동 막기
	const canGoNextMonth = predictionRange
		? firstDayOfCurrentMonth.getTime() <
			new Date(predictionRange.end.getFullYear(), predictionRange.end.getMonth(), 1).getTime()
		: true;

	const currentWeekStart = selectedDate ? getStartOfWeek(selectedDate) : getStartOfWeek(today);
	const currentWeekEnd = getEndOfWeek(currentWeekStart);

	const handleWeekChange = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
		setSelectedDate(stripTime(newDate));

		// 새로운 주가 속한 달 계산
		const newMonth = newDate.getMonth();
		const currentMonth = firstDayOfCurrentMonth.getMonth();

		// 주 이동으로 달이 바뀌었을 때만 갱신
		if (newMonth !== currentMonth) {
			const newMonthStart = new Date(newDate.getFullYear(), newMonth, 1);
			setFirstDayOfCurrentMonth(newMonthStart);
		}
	};

	const canGoPrevWeek = currentWeekStart.getTime() > getStartOfWeek(today).getTime();

	const canGoNextWeek = predictionRange
		? currentWeekEnd.getTime() < stripTime(new Date(predictionRange.end)).getTime()
		: true;

	return (
		<div className="w-full">
			<div className="relative">
				<Calendar
					key={firstDayOfCurrentMonth.toISOString()}
					view="month"
					formatDay={(locale, date) => `${date.getDate()}`}
					activeStartDate={firstDayOfCurrentMonth}
					calendarType="gregory"
					locale="ko-KR"
					className={`custom-calendar
							${isMobile && 'custom-calendar-mobile'} 
							${isWeekCalendar ? 'h-[250px]' : ' h-full @mobile:max-h-[500px]'}
							relative transition-all duration-[500ms] ease-linear opacity-100`}
					onClickDay={(value) => setSelectedDate(stripTime(value))}
					navigationLabel={({ date }) => (
						<NavigationLabel
							year={date.getFullYear()}
							month={date.toLocaleString('ko-KR', { month: 'long' })}
							canGoPrev={isWeekCalendar ? canGoPrevWeek : canGoPrevMonth}
							canGoNext={isWeekCalendar ? canGoNextWeek : canGoNextMonth}
							isMatch={isMatch}
							onMonthChange={(direction) => {
								if (isWeekCalendar) {
									handleWeekChange(direction);
								} else {
									handleMonthChange(direction);
								}
							}}
							onYearChange={handleYearChange}
						/>
					)}
					prevLabel={null}
					nextLabel={null}
					prev2Label={null}
					next2Label={null}
					formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
					tileClassName={({ date }) =>
						getTileClassName({
							dateOfTile: date,
							firstDayOfCurrentMonth: firstDayOfCurrentMonth,
							isWeekCalendar,
							today,
							selectedDate,
							isMatch,
							predictionRange,
							markedDatesMap,
						})
					}
					tileContent={({ date }) => (
						<RenderTileContent
							date={date}
							today={today}
							predictionRange={predictionRange}
							markedDatesMap={markedDatesMap}
						/>
					)}
				/>

				<button
					onClick={() => setIsWeekCalendar((prev) => !prev)}
					className="flex w-full justify-center absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-transparent border-none cursor-pointer"
				>
					<Image
						src="/chevron/calendar-up.svg"
						alt="toggle"
						width={36}
						height={36}
						style={{
							transform: isWeekCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</button>
			</div>
		</div>
	);
}
