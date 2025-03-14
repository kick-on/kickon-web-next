'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import PostEditor from '@/components/common/postEditor';
import Image from 'next/image';

const teamOptions = [{ label: '리버풀', logo: '/team-logo/liverpool.svg', value: 'paragraph' }];

export default function Page() {
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '탭 선택하기',
		value: '',
	});
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleOptionClick = (option: { label: string; value: string }) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="flex flex-col mx-auto">
			<div ref={dropdownRef} className="relative w-fit button4-medium">
				<button
					onClick={handleDropdownToggle}
					className="flex mb-[92px] items-center gap-8 px-4 py-[9px] border border-[#D9D9D9] rounded-lg"
				>
					<div className="text-[#8C8C8C] body5-regular">{selectedOption.label}</div>
					<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
				</button>
				{isVisibleDropdown && (
					<div className="z-50 absolute top-10 w-[146px] bg-white border border-gray-300 button4-medium rounded-lg shadow-lg overflow-hidden">
						<div className="px-4 py-2.5">전체</div>
						{teamOptions.map((option, index) => (
							<div
								key={option.value}
								className={clsx('px-4 py-2.5 cursor-pointer hover:bg-gray-200 transition-colors', {
									'rounded-b-sm': index === teamOptions.length - 1,
								})}
								onClick={() => handleOptionClick(option)}
							>
								<div className="flex items-center gap-2">
									{option.logo && <Image src={option.logo} alt={option.label} width={16} height={16} />}
									<span>{option.label}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<PostEditor />
		</div>
	);
}
