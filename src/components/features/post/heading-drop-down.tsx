import { headingOptions } from '@/lib/constants/options';
import clsx from 'clsx';
import Image from 'next/image';

export default function HeadingDropdown({
	selectedOption,
	setSelectedOption,
	isVisibleDropdown,
	setIsVisibleDropdown,
	handleHeadingChange,
	dropdownRef,
}) {
	const handleDropdownToggle = () => {
		setIsVisibleDropdown(!isVisibleDropdown);
	};

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
		handleHeadingChange(option.value);
	};

	return (
		<div ref={dropdownRef} className="bg-black-000 relative w-fit">
			<button
				onClick={handleDropdownToggle}
				className="flex items-center justify-between pl-2 pr-1 py-[9px] border border-black-300 rounded-sm w-15.75 h-8.5"
			>
				<div className="text-[#8C8C8C] body5-regular @mobile:text-13">{selectedOption.label}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
			</button>
			{isVisibleDropdown && (
				<div className="z-50 absolute top-10 w-15.75 bg-white border border-gray-300 rounded-sm shadow-sm">
					{headingOptions.map((option, index) => (
						<div
							key={option.value}
							className={clsx('p-2 body5-regular cursor-pointer hover:bg-primary-50 transition-colors', {
								'rounded-t-sm': index === 0,
								'rounded-b-sm': index === headingOptions.length - 1,
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
