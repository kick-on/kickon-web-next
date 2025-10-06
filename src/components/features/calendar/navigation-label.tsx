'use client';
import { useState } from 'react';
import { ArrowButton } from './arrow-button';
import Image from 'next/image';
import clsx from 'clsx';
import { getEndOfWeek, getStartOfWeek, stripTime } from '@/lib/utils';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavigationLabelProps {
	isMatch: boolean;
	selectedDate: Date | null;
	setSelectedDate: (date: Date) => void;
	firstDayOfCurrentMonth: Date;
	predictionRange: { start: Date; end: Date } | null;
	isWeekCalendar: boolean;
}

export function NavigationLabel({
	isMatch,
	selectedDate,
	setSelectedDate,
	firstDayOfCurrentMonth,
	predictionRange,
	isWeekCalendar,
}: NavigationLabelProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { currentUserInfo } = useCurrentUserInfoStore();

	const year = firstDayOfCurrentMonth.getFullYear();
	const month = firstDayOfCurrentMonth.toLocaleString('ko-KR', { month: 'long' });
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

	// URL 파라미터 업데이트
	const updateUrlParams = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	};
	const handleYearChange = (newYear: number) => {
		const newDate = new Date(newYear, firstDayOfCurrentMonth.getMonth(), 1);
		updateUrlParams(newDate);
	};

	const handleMonthChange = (direction: 'prev' | 'next') => {
		const currentYear = firstDayOfCurrentMonth.getFullYear();
		const currentMonth = firstDayOfCurrentMonth.getMonth();

		const offset = direction === 'next' ? 1 : -1;
		const newDate = new Date(currentYear, currentMonth + offset, 1);

		updateUrlParams(newDate);
	};

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
			updateUrlParams(newDate);
		}
	};

	const isPrevArrowVisible = () => {
		if (isWeekCalendar) {
			return currentWeekStart.getTime() > getStartOfWeek(today).getTime();
		}
		return predictionRange
			? firstDayOfCurrentMonth.getTime() >
					new Date(predictionRange.start.getFullYear(), predictionRange.start.getMonth(), 1).getTime()
			: true;
	};

	const isNextArrowVisible = () => {
		if (isWeekCalendar) {
			return predictionRange ? currentWeekEnd.getTime() < stripTime(new Date(predictionRange.end)).getTime() : true;
		}
		return predictionRange
			? firstDayOfCurrentMonth.getTime() <
					new Date(predictionRange.end.getFullYear(), predictionRange.end.getMonth(), 1).getTime()
			: true;
	};

	return (
		<div className="flex w-full flex-1 items-center justify-center">
			<div className="absolute left-0 @mobile:ml-5 ml-9 z-50">
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
							<Image width={16} height={16} src="/chevron/up-and-down.svg" alt="옵션 선택" />
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
					onClick={() => (isWeekCalendar ? handleWeekChange('prev') : handleMonthChange('prev'))}
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
					onClick={() => (isWeekCalendar ? handleWeekChange('next') : handleMonthChange('next'))}
					isVisible={isNextArrowVisible()}
				/>
			</div>
		</div>
	);
}
