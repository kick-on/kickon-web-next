'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { categories } from '@/lib/constants/options';

type CategoryOption = {
	label: string;
	value: string;
};

interface CategoryDropdownProps {
	selectedOption: CategoryOption;
	setSelectedOption: (option: CategoryOption) => void;
}

export default function CategoryDropdown({ selectedOption, setSelectedOption }: CategoryDropdownProps) {
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleOptionClick = (option: CategoryOption) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
	};

	return (
		<div
			ref={dropdownRef}
			className="relative w-[148px] @mobile:w-[132px] button4-medium tablet:text-14 @mobile:text-13"
		>
			<button
				onClick={handleDropdownToggle}
				className="flex items-center justify-between w-full h-auto border border-black-300 rounded-lg px-4 py-[9px] @mobile:pr-[10px]"
			>
				<div
					className={clsx(
						'@mobile:max-w-[132px] @mobile:truncate',
						selectedOption.label === '탭 선택하기' || selectedOption.label === '탭 선택'
							? 'text-black-600'
							: 'text-black-900',
					)}
				>
					{selectedOption.label}
				</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
			</button>

			{isVisibleDropdown && (
				<div className="z-50 absolute top-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
					{categories.map((option, index) => (
						<div
							key={option.value}
							className={clsx('px-4 py-2.5 cursor-pointer hover:bg-black-200 transition-colors', {
								'rounded-b-sm': index === categories.length - 1,
							})}
							onClick={() => handleOptionClick(option)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
