'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';
import { getMonthlyMatchList, getMyPredictionDates, getPredictionOpenPeriod } from '@/services/apis/calendar';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { formatFromTo, getTileClassName, stripTime } from '@/lib/utils';

import { NavigationLabel } from '../features/calendar/navigation-label';
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

	useEffect(() => {
		// 년,월 계산 (params 기반)
		const newMonthStart = getYearMonthFromUrl();

		// 첫째 날은 searchParams가 바뀐 경우에만 업데이트
		if (newMonthStart.getTime() !== firstDayOfCurrentMonth.getTime()) {
			setFirstDayOfCurrentMonth(newMonthStart);
		}

		// 점찍기 페치 (type에 따라 분기)
		async function fetchMarkedDates() {
			try {
				const formattedDate = formatFromTo(newMonthStart);
				const response = type === 'match' ? await getMonthlyMatchList(formattedDate) : await getMyPredictionDates();

				if (response?.data?.dates) {
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
	}, [searchParams, type]);

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

	const calendarContext = {
		firstDayOfCurrentMonth,
		selectedDate,
		setSelectedDate,
		isWeekCalendar,
		predictionRange,
		isMatch,
		markedDatesMap,
		updateUrlParams,
	};

	return (
		<div className="w-full">
			<div className="relative">
				<Calendar
					key={`${firstDayOfCurrentMonth.toISOString()}`}
					view="month"
					formatDay={(locale, date) => `${date.getDate()}`}
					activeStartDate={firstDayOfCurrentMonth}
					calendarType="gregory"
					locale="ko-KR"
					className={`custom-calendar
							${isMobile && 'custom-calendar-mobile'} 
							${isWeekCalendar ? 'max-h-[250px]' : 'max-h-[1000px]'}
							relative transition-all duration-[500ms] ease-linear opacity-100`}
					onClickDay={(value) => {
						const newDate = stripTime(value);
						setSelectedDate(newDate);

						// 만약 선택된 날짜의 달이 현재 달과 다르면 activeStartDate 업데이트
						if (newDate.getMonth() !== firstDayOfCurrentMonth.getMonth()) {
							const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
							setFirstDayOfCurrentMonth(newMonthStart);
						}
					}}
					navigationLabel={({}) => <NavigationLabel {...calendarContext} />}
					prevLabel={null}
					nextLabel={null}
					prev2Label={null}
					next2Label={null}
					formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
					tileClassName={({ date }) =>
						getTileClassName({
							dateOfTile: date,
							...calendarContext,
						})
					}
					tileContent={({ date }) => <RenderTileContent date={date} {...calendarContext} />}
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
