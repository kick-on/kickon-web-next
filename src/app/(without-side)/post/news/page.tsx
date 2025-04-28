'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import PostEditor from '@/components/features/post/post-editor.tsx';
import { categories } from '@/lib/constants/options';
import { PostNewsContentsRequest } from '@/services/apis/post/dto';
import { postNewContents } from '@/services/apis/post';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import { useRouter } from 'next/navigation';
import { getTeam } from '@/services/apis/team';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';

export default function Page() {
	const navigate = useRouter();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string; logo: string } | null>(null);
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '탭 선택하기',
		value: '',
	});
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [isVisibleSearchResults, setIsVisibleSearchResults] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef(null);
	const hasShownAlert = useRef(false);

	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const isFormValid = !!(selectedOption.value && title.trim() && body.trim());
	const [teams, setTeams] = useState<{ id: number; name: string; logo: string }[]>([]);
	const [filteredResults, setFilteredResults] = useState(teams);

	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore(); // 페이지 새로고침 시 유저 정보 초기화, persist 필요

	useEffect(() => {
		if (hasShownAlert.current) return;
		hasShownAlert.current = true;

		const isLoggedIn = getAccessToken() && getRefreshToken();
		if (!isLoggedIn) {
			alert('로그인 후 작성 가능합니다.');
			const previousPage = sessionStorage.getItem('previousPage');
			navigate.replace(previousPage);
		}
		const fetchUserInfo = async () => {
			const user = await getUserInfo();
			if (typeof user !== 'string' && user?.data) {
				setCurrentUserInfo(user.data);
			}
		};

		if (!currentUserInfo) {
			fetchUserInfo();
		}
	}, [currentUserInfo, setCurrentUserInfo, navigate]);

	useEffect(() => {
		const handler = setTimeout(async () => {
			try {
				const response = await getTeam(undefined, searchTerm);

				const teamData = response.data.map((team) => ({
					id: team.pk,
					name: team.nameKr ?? team.nameEn,
					logo: team.logoUrl,
				}));

				setTeams(teamData);
				setFilteredResults(teamData.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase())));
			} catch (error) {
				console.error('팀 리스트 가져오기 실패:', error);
			}
		}, 300); // 300ms 디바운스

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim();
		setSearchTerm(value);
		setSelectedTeam(null);

		const filtered = teams.filter((team) => team?.name.toLowerCase().includes(value.toLowerCase()));

		setFilteredResults(filtered);
		setIsVisibleSearchResults(value.length > 0);
	};

	const handleSelectTeam = (team: { id: number; name: string; logo: string }) => {
		setSelectedTeam(team);
		setSearchTerm(team.name);
		setIsVisibleSearchResults(false);
		setIsVisibleDropdown(false);
	};

	// 검색 초기화 핸들러 (X 버튼)
	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedTeam(null);
	};

	// 홈 드롭다운 코드 참고
	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleNewsOptionClick = (option: { label: string; value: string }) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleSearchResults(false);
				setIsVisibleDropdown(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			// 1. Presigned URL 요청
			const presignedResponse = await getPresignedUrl(file.name, true);
			const { presignedUrl, s3Url } = presignedResponse.data;

			// 2. Presigned URL을 사용해 S3에 업로드
			await uploadToS3(presignedUrl, file);

			// 3. 업로드된 S3 URL을 상태에 저장 (서버에 보낼 URL)
			setSelectedImage(s3Url);
		} catch (error) {
			console.error('파일 업로드 실패:', error);
		}
	};
	const handleRemoveImage = () => {
		setSelectedImage(null);
	};

	// 대표 이미지 클릭 시 파일 업로드 창 열기
	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	console.log(body);

	const postNewsContents = async () => {
		if (!getAccessToken() || !getRefreshToken()) {
			return;
		}
		const requestBody: PostNewsContentsRequest = {
			team: selectedTeam?.id || null,
			title: title.trim(),
			contents: body.trim(),
			thumbnailUrl: selectedImage || '',
			category: selectedOption.value,
		};

		try {
			const response = await postNewContents(requestBody, true);

			navigate.push(`/news/${response.data.pk}`);
		} catch (error) {
			console.error('게시글 작성 실패:', error);
		}
	};

	return (
		<div className="flex flex-col mx-auto">
			{selectedImage ? (
				<div className="relative w-[636px] h-[322px] mb-4">
					<Image
						src={selectedImage}
						alt="업로드된 대표 이미지"
						layout="fill"
						objectFit="cover"
						className="rounded-[10px]"
					/>
					<button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black-200 p-1 rounded-full">
						<Image src="/x.svg" alt="삭제 버튼" width={18} height={18} />
					</button>
				</div>
			) : (
				<div
					className="flex items-center gap-2 cursor-pointer button4-medium text-black-600 mb-7.5"
					onClick={handleImageClick}
				>
					<Image src="/image.svg" width={20} height={20} alt="앨범 아이콘" />
					대표 이미지 추가
				</div>
			)}

			<input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />

			<div className="flex gap-4 mb-4">
				<div ref={searchRef} className="relative w-[17.75rem]">
					<div className="relative button4-medium flex items-center border border-black-300 rounded-lg h-9 px-4 py-[0.5625rem]">
						{selectedTeam && (
							<Image
								src={selectedTeam.logo}
								alt={selectedTeam.name}
								width={16}
								height={16}
								className="mr-2 w-4 h-4 object-contain"
							/>
						)}

						<input
							type="text"
							placeholder="팀명"
							value={searchTerm}
							onChange={handleSearchChange}
							className="w-full focus:outline-none"
						/>

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

					{isVisibleSearchResults && (
						<div className="z-50 absolute top-10 w-[17.75rem] bg-black-000 border border-black-200 button4-medium rounded-lg shadow-lg overflow-hidden">
							{filteredResults.length > 0 ? (
								filteredResults.map((team, index) => (
									<div
										key={team.id}
										className={clsx(
											'flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-black-200 transition-colors',
											{
												'rounded-b-sm': index === filteredResults.length - 1,
											},
										)}
										onClick={() => {
											handleSelectTeam(team);
										}}
									>
										<Image className="w-4 h-4 object-contain" src={team.logo} alt={team.name} width={16} height={16} />
										{team.name}
									</div>
								))
							) : (
								<div className="px-4 py-2.5 text-black-300">검색 결과 없음</div>
							)}
						</div>
					)}
				</div>

				<div ref={dropdownRef} className="relative w-fit button4-medium">
					<button
						onClick={handleDropdownToggle}
						className="flex items-center gap-8 px-4 py-[0.5625rem] border border-[#D9D9D9] rounded-lg"
					>
						<div
							className={`button4-medium ${
								selectedOption.label === '탭 선택하기' ? 'text-black-600' : 'text-black-900'
							}`}
						>
							{selectedOption.label}
						</div>
						<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
					</button>

					{isVisibleDropdown && (
						<div className="z-50 absolute top-10 w-[9.125rem] bg-white border border-gray-300 button4-medium rounded-lg shadow-lg overflow-hidden">
							{categories.map((option, index) => (
								<div
									key={option.value}
									className={clsx('px-4 py-2.5 body5-regular cursor-pointer hover:bg-black-200 transition-colors', {
										'rounded-b-sm': index === categories.length - 1,
									})}
									onClick={() => handleNewsOptionClick(option)}
								>
									{option.label}
								</div>
							))}
						</div>
					)}
				</div>
				<button
					onClick={() => {
						if (window) {
							window.open('https://www.notion.so/devbob/1c4e7fdb8ed1804780f4d7b6702c5316', '_blank');
						}
					}}
				>
					<Image src="/help-circle.svg" alt="게시글 작성 가이드라인" width={20} height={20} />
				</button>
			</div>
			<PostEditor setTitle={setTitle} setBody={setBody} isNews={true} />

			<div className="flex justify-center gap-4 mt-4 mx-auto">
				<button
					onClick={() => console.log('취소')}
					className="w-[164px] button2-semibold px-4 py-2 rounded-lg transition-all text-black-700 bg-black-200"
				>
					취소
				</button>
				<button
					onClick={selectedImage ? postNewsContents : () => alert('대표 이미지를 등록해 주세요.')}
					disabled={!isFormValid}
					className={clsx(
						'w-[164px] button2-semibold px-4 py-2 rounded-lg transition-all',
						isFormValid ? 'text-black-100 bg-primary-900' : 'bg-black-600 text-black-000',
					)}
				>
					작성 완료
				</button>
			</div>
		</div>
	);
}
