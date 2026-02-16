'use client';
import { useState } from 'react';
import { ArrowButton } from './arrow-button';
import Image from 'next/image';
import clsx from 'clsx';
import { getEndOfWeek, getStartOfWeek, stripTime } from '@/lib/utils';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useCalendarStore } from '@/lib/store/useCalendarStore';

interface NavigationLabelProps {
	isMatch: boolean;
	isWeekCalendar: boolean;
	updateUrlWithDate: (date: Date) => void;
}

export function NavigationLabel({ isMatch, isWeekCalendar, updateUrlWithDate }: NavigationLabelProps) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const { selectedDate, setSelectedDate } = useCalendarStore();
	const calendarMode = isWeekCalendar ? 'week' : 'month';

	const year = selectedDate.getFullYear();
	const month = selectedDate.toLocaleString('ko-KR', { month: 'long' });
	const today = stripTime(new Date());

	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [selectedYear, setSelectedYear] = useState(year);

	// privacyAgreedAt -> 서비스 이용 시작년도 추출
	const joinedYear = currentUserInfo?.privacyAgreedAt ? new Date(currentUserInfo.privacyAgreedAt).getFullYear() : year; // fallback: 현재 연도
	const currentYear = new Date().getFullYear();

	// 옵션 동적 생성 (최신 연도가 위로 오도록 reverse)
	const options = Array.from({ length: currentYear - joinedYear + 1 }, (_, i) => {
		const yearOption = joinedYear + i;
		return { label: `${yearOption}년`, value: yearOption };
	}).reverse();

	const handleYearChange = (newYear: number) => {
		const newDate = new Date(newYear, selectedDate.getMonth(), 1);
		updateUrlWithDate(newDate);
	};

	const currentWeekStart = getStartOfWeek(selectedDate);
	const currentWeekEnd = getEndOfWeek(currentWeekStart);

	const handleNavigation = (mode: 'month' | 'week', direction: 'prev' | 'next') => {
		const baseDate = mode === 'month' ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : currentWeekStart;
		const offset = mode === 'month' ? (direction === 'next' ? 1 : -1) : direction === 'next' ? 7 : -1;

		const newDate =
			mode === 'month'
				? new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)
				: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + offset);

		setSelectedDate(stripTime(newDate));

		// 월 이동 시에는 항상, 주 이동 시에는 선택한 날짜의 월과 현재 월의 비교 결과에 따라
		const shouldUpdateUrl = mode === 'month' || newDate.getMonth() !== selectedDate.getMonth();

		if (shouldUpdateUrl) updateUrlWithDate(newDate);
	};

	const isPrevArrowVisible = () => {
		if (isMatch) return true;

		const minYear = Math.min(...options.map((o) => o.value));
		const firstDayOfMinYear = new Date(minYear, 0, 1);

		if (isWeekCalendar) {
			return currentWeekStart.getTime() > firstDayOfMinYear.getTime();
		}

		const firstDayOfCurrentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		return firstDayOfCurrentMonth.getTime() > firstDayOfMinYear.getTime();
	};

	const isNextArrowVisible = () => {
		if (isMatch) return true;

		const maxYear = Math.max(...options.map((o) => o.value));

		if (isWeekCalendar) {
			const lastDayOfMaxYear = new Date(maxYear, 11, 31);
			return currentWeekEnd.getTime() < lastDayOfMaxYear.getTime();
		}

		const firstDayOfCurrentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		const firstDayOfMaxYear = new Date(maxYear, 11, 1);
		return firstDayOfCurrentMonth.getTime() < firstDayOfMaxYear.getTime();
	};

	return (
		<div className="flex w-full flex-1 items-center justify-center">
			<div className="absolute left-0 @mobile:ml-5 ml-9">
				{isMatch ? (
					<span className="button1-medium @mobile:text-12">{year}년</span>
				) : (
					<div className="relative w-fit">
						<div
							role="button"
							tabIndex={0}
							onClick={() => setIsVisibleDropdown((prev) => !prev)}
							className="flex gap-[4px] items-center justify-between cursor-pointer"
						>
							<div className="button1-medium @mobile:text-12">{selectedYear}년</div>
							<Image width={16} height={16} src="/chevron/up-and-down.svg" alt="" />
						</div>
						{isVisibleDropdown && (
							<div className="px-[30px] py-[10px] @mobile:py-4 z-50 absolute top-8 bg-black-000 border border-gray-200 rounded-[10px] shadow-[0_4px_16px_0_rgba(0,0,0,0.20)]">
								<div className="flex flex-col space-y-[20px] @mobile:space-y-[30px]">
									{options.map((option, index) => (
										<div
											key={option.value}
											className={clsx('w-12 flex items-center justify-center cursor-pointer transition-colors', {
												'text-primary-900 body5-medium': selectedYear === option.value,
												'body5-regular': selectedYear !== option.value,
											})}
											onClick={() => {
												setSelectedYear(option.value);
												setIsVisibleDropdown(false);
												handleYearChange(option.value);
											}}
										>
											{option.label}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="relative w-full flex-1 flex items-center justify-center">
				<ArrowButton
					direction="prev"
					onClick={() => handleNavigation(calendarMode, 'prev')}
					isVisible={isPrevArrowVisible()}
				/>

				{month && (
					<span className="flex justify-center items-center">
						<span className="month-number">{month.slice(0, -1)}</span>
						<span className="month-text">{month.slice(-1)}</span>
					</span>
				)}

				<ArrowButton
					direction="next"
					onClick={() => handleNavigation(calendarMode, 'next')}
					isVisible={isNextArrowVisible()}
				/>
			</div>
		</div>
	);
}
