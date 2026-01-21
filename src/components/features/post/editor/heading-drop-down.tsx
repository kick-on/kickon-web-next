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
				className={
					'flex items-center justify-between pl-2 pr-1 py-[9px] border border-black-300 rounded-sm w-[67px] h-8.5'
				}
			>
				<div className="text-black-600 body5-medium @mobile:text-13">{selectedOption.label}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="" />
			</button>
			{isVisibleDropdown && (
				<div className={'w-[67px] z-50 absolute top-10 bg-black-000 border border-gray-300 rounded-sm shadow-sm'}>
					{headingOptions.map((option, index) => (
						<div
							key={option.value}
							className={clsx(
								'flex items-center justify-center h-[36px] body5-regular @mobile:text-13 cursor-pointer hover:bg-primary-50 transition-colors',
								{
									'rounded-t-sm': index === 0,
									'rounded-b-sm': index === headingOptions.length - 1,
								},
							)}
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
