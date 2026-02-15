'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';
import { getMonthlyMatchList, getMyPredictionDates } from '@/services/apis/calendar';
import { formatFromTo, getTileClassName, stripTime } from '@/lib/utils';

import { NavigationLabel } from '../features/calendar/navigation-label';
import { RenderTileContent } from '../features/calendar/renderers/render-tile-content';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import clsx from 'clsx';

interface MatchPredictionCalendarProps {
	type: 'match' | 'predict';
	isPopover?: boolean;
	selectedDate?: Date;
	setSelectedDate?: (date: Date) => void; // 선택한 날짜 상위로 올림
}

export default function MatchPredictionCalendar({
	type,
	isPopover,
	selectedDate,
	setSelectedDate,
}: MatchPredictionCalendarProps) {
	const isDesktop = useIsDesktop();
	const router = useRouter();
	const searchParams = useSearchParams();
	const isMatch = type === 'match';

	const [isWeekCalendar, setIsWeekCalendar] = useState(isMatch ? false : true); // 주 단위 캘린더인가 (접힌 상태인가)
	const [markedDatesMap, setMarkedDatesMap] = useState<Record<string, number>>({}); // 경기가 있는 날짜들

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

	const firstDayOfCurrentMonth = getYearMonthFromUrl(); // 현재 월의 첫째 날

	const updateUrlWithDate = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	useEffect(() => {
		// 점찍기 페치 (type에 따라 분기)
		async function fetchMarkedDates() {
			try {
				const formattedDate = formatFromTo(firstDayOfCurrentMonth);
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

	const calendarData = {
		firstDayOfCurrentMonth,
		selectedDate,
		setSelectedDate,
		isWeekCalendar,
		isMatch,
		markedDatesMap,
		updateUrlWithDate,
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
					className={clsx(
						'custom-calendar custom-calendar-mobile px-[5px] pt-[26px] relative transition-all duration-[500ms] ease-linear opacity-100',
						isWeekCalendar ? 'max-h-[250px]' : 'max-h-[1000px]',
						!isDesktop && isPopover ? 'pb-[20px]' : 'pb-[48px]',
					)}
					onClickDay={(value) => {
						const clickedDate = stripTime(value);
						setSelectedDate(clickedDate);

						// 만약 선택된 날짜의 달이 현재 파라미터의 달과 다르다면 -> 파라미터 변경 -> 자동으로 firstDayOfCurrentMonth도 변경
						if (clickedDate.getMonth() !== firstDayOfCurrentMonth.getMonth()) {
							updateUrlWithDate(clickedDate);
						}
					}}
					navigationLabel={({}) => <NavigationLabel {...calendarData} />}
					prevLabel={null}
					nextLabel={null}
					prev2Label={null}
					next2Label={null}
					formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
					tileClassName={({ date }) =>
						getTileClassName({
							dateOfTile: date,
							...calendarData,
						})
					}
					tileContent={({ date }) => <RenderTileContent date={date} {...calendarData} />}
				/>

				{!isPopover && (
					<button
						onClick={() => setIsWeekCalendar((prev) => !prev)}
						className="flex w-full justify-center absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-transparent border-none cursor-pointer"
					>
						<Image
							src="/chevron/calendar-up.svg"
							alt=""
							width={36}
							height={36}
							style={{
								transform: isWeekCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s ease',
							}}
						/>
					</button>
				)}
			</div>
		</div>
	);
}
