'use client';
import { useState } from 'react';
import { ArrowButton } from '../arrow-button';
import Image from 'next/image';
import clsx from 'clsx';

export function NavigationLabel({
	year,
	month,
	canGoPrev,
	canGoNext,
	onMonthChange,
	isMatch,
	onYearChange,
}: {
	year: number;
	month: string;
	canGoPrev: boolean;
	canGoNext: boolean;
	onMonthChange: (direction: 'prev' | 'next') => void;
	isMatch: boolean;
	onYearChange?: (year: number) => void;
}) {
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [selectedYear, setSelectedYear] = useState(year);

	const options = [
		{ label: '2025년', value: 2025 },
		{ label: '2026년', value: 2026 },
	]; // 흠...

	return (
		<div className="flex w-full flex-1 items-center justify-center">
			<div className="absolute left-0 @mobile:ml-5 ml-9 year z-50">
				{isMatch ? (
					<span>{year}년</span>
				) : (
					<div className="relative w-fit">
						<div
							role="button"
							tabIndex={0}
							onClick={() => setIsVisibleDropdown((prev) => !prev)}
							className="flex gap-[4px] items-center justify-between cursor-pointer"
						>
							<div className="body1-medium @mobile:text-13">{selectedYear}년</div>
							<Image width={16} height={16} src="/chevron/up-and-down.svg" alt="옵션 선택" />
						</div>
						{isVisibleDropdown && (
							<div className="px-[30px] py-[10px] z-50 absolute top-8 bg-black-000 border border-gray-200 rounded-[10px] shadow-[0_4px_16px_0_rgba(0,0,0,0.20)]">
								<div className="flex flex-col space-y-[20px]">
									{options.map((option, index) => (
										<div
											key={option.value}
											className={clsx(
												'w-12 flex items-center justify-center @mobile:text-13 cursor-pointer transition-colors',
												{
													'text-primary-900 body5-medium': selectedYear === option.value,
													'body5-regular': selectedYear !== option.value,
												},
											)}
											onClick={() => {
												setSelectedYear(option.value);
												setIsVisibleDropdown(false);
												onYearChange?.(option.value);
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
				<ArrowButton direction="prev" onClick={onMonthChange} show={canGoPrev} />
				{month && (
					<span className="flex justify-center items-center">
						<span className="month-number">{month.slice(0, -1)}</span>
						<span className="month-text">{month.slice(-1)}</span>
					</span>
				)}
				<ArrowButton direction="next" onClick={onMonthChange} show={canGoNext} />
			</div>
		</div>
	);
}
