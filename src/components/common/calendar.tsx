'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';
import { getMonthlyMatchList, getMyCalendar, getPredictionDates } from '@/services/apis/calendar';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { formatFromTo, getEndOfWeek, getStartOfWeek, getTileClassName, stripTime } from '@/lib/utils';

import { renderNavigationLabel } from '../features/calendar/renderers/render-navigation-label';
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

	const [isCollapsed, setIsCollapsed] = useState(isMatch ? false : true); // 접혀 있는 상태인가
	const [markedDatesMap, setMarkedDatesMap] = useState<Record<string, number>>({});

	const [predictionRange, setPredictionRange] = useState<{
		start: Date;
		end: Date;
	} | null>(null);

	// URL 파라미터에서 년월 정보 가져오기
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

	const [firstDayOfCurrentMonth, setFirstDayOfCurrentMonth] = useState(getYearMonthFromUrl);

	// URL 파라미터 업데이트
	const updateUrlParams = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	};

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

	// URL 파라미터가 변경될 때 새로운 월의 첫째 날 업데이트
	useEffect(() => {
		const newMonthStart = getYearMonthFromUrl();
		setFirstDayOfCurrentMonth(newMonthStart);
	}, [searchParams]);

	// 승부 예측 가능 기간 조회
	useEffect(() => {
		async function fetchPredictionDates() {
			try {
				const response = await getPredictionDates();
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

	// 월이 변경될 때마다 호출
	useEffect(() => {
		async function fetchMarkedDates() {
			try {
				const formattedDate = formatFromTo(firstDayOfCurrentMonth);
				console.log(formattedDate);
				const response = isMatch ? await getMonthlyMatchList(formattedDate) : await getMyCalendar();
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

		fetchMarkedDates();
	}, [firstDayOfCurrentMonth, isMatch]);

	const today = stripTime(new Date());

	//TODO: 여기 다시 보셈 ㄱㄱ
	// 오늘 날짜 기준으로 고정
	const todayMonth = today.getMonth();
	const todayYear = today.getFullYear();

	// const maxDate = new Date(todayYear, todayMonth + 2, 1); // 다음 달의 1일

	// 화살표 표시 여부
	const minDate = new Date(todayYear, todayMonth, 1); // 이번 달
	const canGoPrevMonth = isMatch ? firstDayOfCurrentMonth.getTime() > minDate.getTime() : true;
	const canGoNextMonth =
		firstDayOfCurrentMonth.getTime() < new Date(todayYear, isMatch ? todayMonth + 1 : todayMonth, 1).getTime();

	// 오늘 기준 주 시작/끝
	const todayWeekStart = getStartOfWeek(today);

	// 현재 주 시작/끝 (selectedDate 기준)
	const currentWeekStart = selectedDate ? getStartOfWeek(selectedDate) : todayWeekStart;
	const currentWeekEnd = getEndOfWeek(currentWeekStart);

	const handleWeekChange = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
		setSelectedDate(stripTime(newDate));
		const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1); // 달이 바뀌어서 갱신
		setFirstDayOfCurrentMonth(newMonthStart);
	};

	// 화살표 활성화 조건
	const canGoPrevWeek = currentWeekStart.getTime() > todayWeekStart.getTime();
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
							${isCollapsed ? 'h-[250px]' : ' h-[470px] @mobile:max-h-[500px]'}
							relative transition-all duration-[500ms] ease-linear opacity-100`}
					onClickDay={(value) => setSelectedDate(stripTime(value))}
					navigationLabel={({ date }) =>
						renderNavigationLabel({
							year: date.getFullYear(),
							month: date.toLocaleString('ko-KR', { month: 'long' }),
							canGoPrev: isCollapsed ? canGoPrevWeek : canGoPrevMonth,
							canGoNext: isCollapsed ? canGoNextWeek : canGoNextMonth,
							onMonthChange: (direction) => {
								if (isCollapsed) {
									handleWeekChange(direction);
								} else {
									handleMonthChange(direction);
								}
							},
						})
					}
					prevLabel={null}
					nextLabel={null}
					prev2Label={null}
					next2Label={null}
					formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
					tileClassName={({ date }) =>
						getTileClassName({
							dateOfTile: date,
							firstDayOfCurrentMonth: firstDayOfCurrentMonth,
							isCollapsed,
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
					onClick={() => setIsCollapsed((prev) => !prev)}
					className="flex w-full justify-center absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-transparent border-none cursor-pointer"
				>
					<Image
						src="/chevron/calendar-up.svg"
						alt="toggle"
						width={36}
						height={36}
						style={{
							transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</button>
			</div>
		</div>
	);
}
