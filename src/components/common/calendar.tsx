'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import Image from 'next/image';

import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';
import { getMonthlyMatchList, getNextMatchDate } from '@/services/apis/calendar';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { getEndOfWeek, getStartOfWeek, isSameDate, stripTime } from '@/lib/utils/calendarUtils';

interface MatchPredictionCalendarProps {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void; // 선택한 날짜 상위로 올림
}

export default function MatchPredictionCalendar({ selectedDate, setSelectedDate }: MatchPredictionCalendarProps) {
	const isMobile = useIsMobile();
	const router = useRouter();
	const searchParams = useSearchParams();

	const calendarRef = useRef<HTMLDivElement>(null);

	const [isCollapsed, setIsCollapsed] = useState(false); // 접혀 있는 상태인가
	const [markedCountMap, setMarkedCountMap] = useState<Record<string, number>>({});

	// const [predictionRange, setPredictionRange] = useState<{
	// 	start: Date;
	// 	end: Date;
	// } | null>(null);

	// URL 파라미터에서 년월 정보 가져오기
	const getDateForActiveMonth = () => {
		const year = searchParams.get('year');
		const month = searchParams.get('month');

		if (year && month) {
			return new Date(parseInt(year), parseInt(month) - 1, 1);
		}

		// 파라미터가 없으면 현재 월
		const today = new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	};

	const [dateForActiveMonth, setDateForActiveMonth] = useState(getDateForActiveMonth);

	// URL 파라미터 업데이트
	const updateUrlParams = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.replace(`?${params.toString()}`);
	};

	const handleMonthChange = (direction: 'prev' | 'next') => {
		const currentYear = dateForActiveMonth.getFullYear();
		const currentMonth = dateForActiveMonth.getMonth();

		let newYear = currentYear;
		let newMonth = currentMonth + (direction === 'next' ? 1 : -1);

		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		} else if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}

		// 범위 체크
		const newDate = new Date(newYear, newMonth, 1);
		if (newDate >= minDate && newDate < maxDate) {
			setDateForActiveMonth(newDate);
			updateUrlParams(newDate); // URL 파라미터 업데이트
		}
	};

	// URL 파라미터가 변경될 때 activeDate 업데이트
	useEffect(() => {
		const newActiveDate = getDateForActiveMonth();
		setDateForActiveMonth(newActiveDate);
	}, [searchParams]);

	// // 승부 예측 가능 기간 조회
	// useEffect(() => {
	// 	async function fetchPredictionDates() {
	// 		try {
	// 			const response = await getPredictionDates();
	// 			console.log(response);
	// 			if (response?.data) {
	// 				const { startDate, endDate } = response.data;
	// 				setPredictionRange({
	// 					start: new Date(startDate),
	// 					end: new Date(endDate),
	// 				});
	// 			}
	// 		} catch (e) {
	// 			console.error('승부예측 가능 날짜 범위 불러오기 실패:', e);
	// 		}
	// 	}

	// 	fetchPredictionDates();
	// }, []);

	// activeDate가 변경될 때마다 API 호출
	useEffect(() => {
		async function fetchMarkedDates() {
			try {
				const year = dateForActiveMonth.getFullYear();
				const month = String(dateForActiveMonth.getMonth() + 1).padStart(2, '0');
				const day = String(dateForActiveMonth.getDate()).padStart(2, '0');
				const formattedDate = `${year}-${month}-${day}`;

				console.log(formattedDate);
				const response = await getMonthlyMatchList(formattedDate);
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
					setMarkedCountMap(countMap);
				}
			} catch (e) {
				console.error('캘린더 점찍기용 날짜 조회 실패:', e);
			}
		}

		fetchMarkedDates();
	}, [dateForActiveMonth]);

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
					setSelectedDate(date); // API로 받은 날짜로 포커스 설정
				}
			} catch (e) {
				console.error('가장 가까운 예정 경기 날짜 가져오기 실패:', e);
			}
		}
		fetchNextMatchDate();
	}, []);

	// const [hasDisabledAfterDates, setHasDisabledAfterDates] = useState(false);

	// // activeDate나 predictionRange가 변경될 때 체크
	// useEffect(() => {
	// 	if (!predictionRange) {
	// 		setHasDisabledAfterDates(false);
	// 		return;
	// 	}

	// 	// 현재 달의 첫날과 마지막날 구하기
	// 	const year = activeDate.getFullYear();
	// 	const month = activeDate.getMonth();
	// 	const firstDay = new Date(year, month, 1);
	// 	const lastDay = new Date(year, month + 1, 0);

	// 	// 현재 달에 disabled-after 날짜가 있는지 확인
	// 	let hasDisabled = false;
	// 	for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
	// 		if (stripTime(d) > predictionRange.end) {
	// 			hasDisabled = true;
	// 			break;
	// 		}
	// 	}

	// 	setHasDisabledAfterDates(hasDisabled);
	// }, [activeDate, predictionRange]);

	const today = stripTime(new Date());

	const startOfWeek = getStartOfWeek(selectedDate);
	const endOfWeek = getEndOfWeek(startOfWeek);

	// 오늘 날짜 기준으로 고정
	const todayMonth = today.getMonth();
	const todayYear = today.getFullYear();

	// 오늘 달과 다음 달만 허용
	const minDate = new Date(todayYear, todayMonth, 1);
	const maxDate = new Date(todayYear, todayMonth + 2, 1); // 다음 달의 다음 달 1일

	// 화살표 표시 여부
	const canGoPrev = dateForActiveMonth.getTime() > minDate.getTime();
	const canGoNext = dateForActiveMonth.getTime() < new Date(todayYear, todayMonth + 1, 1).getTime();

	return (
		<div className="calendar-wrapper">
			<div className={`calendar-container ${isCollapsed ? 'collapsed' : ''}`}>
				<div ref={calendarRef} className="calendar-anim-wrapper">
					<Calendar
						key={dateForActiveMonth.toISOString()}
						view="month"
						formatDay={(locale, date) => `${date.getDate()}`}
						activeStartDate={dateForActiveMonth}
						calendarType="gregory"
						locale="ko-KR"
						className={`custom-calendar ${isMobile && 'custom-calendar-mobile'}`}
						onClickDay={(value) => setSelectedDate(stripTime(value))}
						navigationLabel={({ date }) => {
							const year = date.getFullYear();
							const month = date.toLocaleString('ko-KR', { month: 'long' });

							return (
								<div className="flex w-full flex-1 items-center justify-center">
									<div className="absolute left-0 @mobile:ml-5 ml-9 year">{year}년</div>

									<div className="relative w-full flex-1 flex items-center justify-center">
										{/* 왼쪽 화살표 */}
										{canGoPrev && (
											<div
												role="button"
												tabIndex={0}
												className="absolute mr-25 cursor-pointer"
												onClick={() => handleMonthChange('prev')}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														handleMonthChange('prev');
													}
												}}
											>
												<Image
													src="/chevron/calendar-left.svg"
													alt="왼쪽 화살표"
													width={24}
													height={24}
													className="w-6 h-6 @mobile:w-[18px] @mobile:h-[18px]"
												/>
											</div>
										)}

										{/* 월 중앙 */}
										{month && (
											<span className="flex justify-center items-center">
												<span className="month-number">{month.slice(0, -1)}</span>
												<span className="month-text">{month.slice(-1)}</span>
											</span>
										)}

										{/* 오른쪽 화살표 */}
										{canGoNext && (
											<div
												role="button"
												tabIndex={0}
												className="absolute ml-25 cursor-pointer"
												onClick={() => handleMonthChange('next')}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														handleMonthChange('next');
													}
												}}
											>
												<Image
													src="/chevron/calendar-right.svg"
													alt="오른쪽 화살표"
													width={24}
													height={24}
													className="w-6 h-6 @mobile:w-[18px] @mobile:h-[18px]"
												/>
											</div>
										)}
									</div>
								</div>
							);
						}}
						prevLabel={null}
						nextLabel={null}
						prev2Label={null}
						next2Label={null}
						formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
						tileClassName={({ date }) => {
							const d = stripTime(date);
							const isCurrentMonth = date.getMonth() === dateForActiveMonth.getMonth();
							if (!isCurrentMonth) return 'hidden-other-month-tile';
							if (isCollapsed && (d < startOfWeek || d > endOfWeek)) return 'hidden-tile';

							const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
							const hasDot = markedCountMap[dStr] > 0;

							// // 예측 기간 넘어가면 disabled
							// if (predictionRange && d > predictionRange.end) {
							// 	const classes = ['disabled-after'];
							// 	const dayOfWeek = date.getDay();

							// 	const prevDate = new Date(date);
							// 	prevDate.setDate(prevDate.getDate() - 1);
							// 	const nextDate = new Date(date);
							// 	nextDate.setDate(nextDate.getDate() + 1);

							// 	const isPrevDisabled = stripTime(prevDate) > predictionRange.end;
							// 	const isNextDisabled = stripTime(nextDate) > predictionRange.end;

							// 	if (dayOfWeek === 0 || !isPrevDisabled) {
							// 		classes.push('disabled-after-week-start');
							// 	}
							// 	if (dayOfWeek === 6 || !isNextDisabled) {
							// 		classes.push('disabled-after-week-end');
							// 	}

							// 	return classes.join(' ');
							// }

							// 기존 타일 클래스 조건들 유지
							const isFocused = selectedDate && isSameDate(d, selectedDate);
							const isToday = isSameDate(d, today);

							let baseClass = '';
							if (isFocused && isToday) baseClass = 'focused-today-tile';
							else if (isFocused) baseClass = 'focused-tile';
							else if (isToday) baseClass = 'not-focused-today-tile';
							else if (d < today) baseClass = 'past-tile pointer-events-none';
							else baseClass = 'future-tile';

							return `${baseClass} ${hasDot ? 'has-dot' : ''}`.trim();
						}}
						tileContent={({ date }) => {
							const d = stripTime(date);
							// 로컬 시간대 기준으로 문자열 생성
							const year = d.getFullYear();
							const month = String(d.getMonth() + 1).padStart(2, '0');
							const day = String(d.getDate()).padStart(2, '0');
							const dStr = `${year}-${month}-${day}`;
							const isFocused = selectedDate && isSameDate(d, selectedDate);

							// if (predictionRange && d > predictionRange.end) {
							// 	return null;
							// }

							const isToday = isSameDate(d, today);
							const count = markedCountMap[dStr];

							return (
								<div className="flex flex-col items-center gap-1 mt-1">
									{isToday && <span className={isFocused ? 'today-text' : 'text-primary-300'}>오늘</span>}

									{count > 0 && (
										<div className="flex flex-row items-center gap-2">
											<div className="calendar-dot" />
											<span className="calendar-count">{count}</span>
										</div>
									)}
								</div>
							);
						}}
					/>
				</div>
				<button className="calendar-toggle w-full flex justify-center" onClick={() => setIsCollapsed((prev) => !prev)}>
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
