'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import PostEditor from '@/components/common/postEditor';
import Image from 'next/image';

const teamOptions = [
	{ label: '부상', value: 'paragraph' },
	{ label: '이적', value: '1' },
	{ label: '감독 교체', value: '2' },
	{ label: '재계약', value: '3' },
	{ label: '불화설', value: '4' },
	{ label: '은퇴', value: '5' },
	{ label: '인터뷰', value: '6' },
	{ label: '현지 팬 반응', value: '7' },
	{ label: '기타', value: '8' },
];

// Mock Data (API가 완성되면 여기를 서버 데이터로 변경)
const mockSearchResults = [
	{ id: 1, name: '리버풀', logo: '/team-logo/liverpool.svg' },
	{ id: 2, name: '맨시티', logo: '/team-logo/man-city.svg' },
	{ id: 3, name: '첼시', logo: '/team-logo/chelsea.svg' },
	{ id: 4, name: '아스널', logo: '/team-logo/arsenal.svg' },
];

export default function Page() {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string; logo: string } | null>(null);
	const [filteredResults, setFilteredResults] = useState(mockSearchResults);
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '탭 선택하기',
		value: '',
	});
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [isVisibleSearchResults, setIsVisibleSearchResults] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);

	// 검색어 입력 핸들러
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setSelectedTeam(null); // 입력하면 기존 선택한 팀 초기화

		// 검색 결과 필터링
		const filtered = mockSearchResults.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
		setFilteredResults(filtered);
		setIsVisibleSearchResults(value.length > 0); // 검색어 입력 시만 검색 결과 표시
	};

	// 팀 선택 핸들러
	const handleSelectTeam = (team: { id: number; name: string; logo: string }) => {
		setSelectedTeam(team);
		console.log('선택한 팀:', team); // 디버깅용 콘솔 출력
		setSearchTerm(team.name);
		setIsVisibleSearchResults(false);
	};

	// 검색 초기화 핸들러 (X 버튼)
	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedTeam(null);
	};

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
				setIsVisibleSearchResults(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="flex flex-col mx-auto">
			<div className="flex gap-4 mb-4">
				<div ref={searchRef} className="relative w-[284px]">
					<div className="relative flex items-center border border-gray-300 rounded-lg h-9 px-4 py-[9px]">
						{/* 선택된 팀 로고 */}
						{selectedTeam && (
							<Image src={selectedTeam.logo} alt={selectedTeam.name} width={20} height={20} className="mr-2" />
						)}

						{/* 검색 입력창 */}
						<input
							type="text"
							placeholder="팀명"
							value={searchTerm}
							onChange={handleSearchChange}
							className="w-full focus:outline-none"
						/>

						{/* 돋보기 아이콘 or X 버튼 */}
						{searchTerm ? (
							<Image
								width={16}
								height={16}
								src="/x.svg"
								alt="초기화"
								onClick={handleClearSearch}
								className="cursor-pointer"
							/>
						) : (
							<Image width={16} height={16} src="/search.svg" alt="검색" />
						)}
					</div>

					{/* 검색 결과 */}
					{isVisibleSearchResults && (
						<div className="z-50 absolute top-10 w-[284px] bg-white border border-gray-300 button4-medium rounded-lg shadow-lg overflow-hidden">
							{filteredResults.length > 0 ? (
								filteredResults.map((team, index) => (
									<div
										key={team.id}
										className={clsx(
											'flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-gray-200 transition-colors',
											{
												'rounded-b-sm': index === filteredResults.length - 1,
											},
										)}
										onClick={() => handleSelectTeam(team)}
									>
										<Image src={team.logo} alt={team.name} width={20} height={20} />
										{team.name}
									</div>
								))
							) : (
								<div className="px-4 py-2.5 text-gray-500">검색 결과 없음</div>
							)}
						</div>
					)}
				</div>

				<div ref={dropdownRef} className="relative w-fit button4-medium">
					<button
						onClick={handleDropdownToggle}
						className="flex items-center gap-8 px-4 py-[9px] border border-[#D9D9D9] rounded-lg"
					>
						<div className="text-[#8C8C8C] body5-regular">{selectedOption.label}</div>
						<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
					</button>
					{isVisibleDropdown && (
						<div className="z-50 absolute top-10 w-[146px] bg-white border border-gray-300 button4-medium rounded-lg shadow-lg overflow-hidden">
							{teamOptions.map((option, index) => (
								<div
									key={option.value}
									className={clsx('px-4 py-2.5 cursor-pointer hover:bg-gray-200 transition-colors', {
										'rounded-b-sm': index === teamOptions.length - 1,
									})}
									onClick={() => handleOptionClick(option)}
								>
									{option.label}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<PostEditor />
		</div>
	);
}
