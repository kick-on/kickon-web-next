'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
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
import useIsMobile from '@/lib/hooks/useIsMobile';

export default function Page() {
	const router = useRouter();
	const isMobile = useIsMobile();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string; logo: string } | null>(null);
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '',
		value: '',
	});

	// isMobile이 null이 아니게 되면 label 설정
	useEffect(() => {
		if (isMobile !== null) {
			setSelectedOption({
				label: isMobile ? '탭 선택' : '탭 선택하기',
				value: '',
			});
		}
	}, [isMobile]);

	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [isVisibleSearchResults, setIsVisibleSearchResults] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef(null);
	const hasShownAlert = useRef(false);

	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const isFormValid = !!(selectedImage?.trim() && selectedOption.value && title.trim() && body.trim());
	const [teams, setTeams] = useState<{ id: number; name: string; logo: string }[]>([]);

	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore(); // 페이지 새로고침 시 유저 정보 초기화, persist 필요

	useEffect(() => {
		if (hasShownAlert.current) return;
		hasShownAlert.current = true;

		const isLoggedIn = getAccessToken() && getRefreshToken();
		if (!isLoggedIn) {
			alert('로그인 후 작성 가능합니다.');
			const previousPage = sessionStorage.getItem('previousPage');
			router.replace(previousPage);
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
	}, [currentUserInfo, setCurrentUserInfo, router]);

	const getTeamLists = useCallback(async (term: string) => {
		// 검색어가 없으면 필터링 결과를 초기화하고 종료
		if (!term) {
			setTeams([]);
			return;
		}
		try {
			const response = await getTeam(undefined, term);
			const teamData = response.data.map((team) => ({
				id: team.pk,
				name: team.nameKr ?? team.nameEn,
				logo: team.logoUrl,
			}));

			setTeams(teamData);
		} catch (error) {
			console.error('팀 리스트 가져오기 실패:', error);
			setTeams([]);
		}
	}, []);

	// 마지막 글자가 입력된 뒤 0.5초 후 api 호출
	const debouncedFetchTeams = useRef(debounce(getTeamLists, 300)).current;

	useEffect(() => {
		debouncedFetchTeams(searchTerm); // 검색어가 변경될 때마다 디바운스된 함수 호출

		return () => {
			debouncedFetchTeams.cancel();
		};
	}, [searchTerm, debouncedFetchTeams]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim();
		setSearchTerm(value);
		setSelectedTeam(null);
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

	const [isPortrait, setIsPortrait] = useState(false);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			// 이미지 비율 체크
			if (typeof window !== 'undefined') {
				// 브라우저 환경에서만 실행
				const img = document.createElement('img');
				img.src = URL.createObjectURL(file);
				img.onload = async () => {
					if (img.height > img.width) {
						setIsPortrait(true); // 세로
					} else {
						setIsPortrait(false); // 가로
					}

					// 1. Presigned URL 요청
					const presignedResponse = await getPresignedUrl(file.name, true);
					const { presignedUrl, s3Url } = presignedResponse.data;

					// 2. Presigned URL을 사용해 S3에 업로드
					await uploadToS3(presignedUrl, file);

					// 3. 업로드된 S3 URL을 상태에 저장
					setSelectedImage(s3Url);
				};
			}
		} catch (error) {
			console.error('파일 업로드 실패:', error);
		}
	};

	const handleRemoveImage = () => {
		setSelectedImage(null);

		// file input의 값을 초기화해서 동일한 파일 다시 선택 가능하게 함
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// 대표 이미지 클릭 시 파일 업로드 창 열기
	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

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

			router.push(`/news/${response.data.pk}`);
		} catch (error) {
			console.error('게시글 작성 실패:', error);
		}
	};

	return (
		<div className="flex flex-col w-full">
			{selectedImage ? (
				<div className="relative w-full h-80.5 @mobile:h-47.5 mb-4 bg-black-200 rounded-[10px] overflow-hidden flex items-center justify-center">
					<Image
						src={selectedImage}
						alt="업로드된 대표 이미지"
						layout="fill"
						objectFit={isPortrait ? 'contain' : 'cover'} // 세로면 contain, 아니면 cover
						className="rounded-[10px]"
					/>
					<button
						onClick={handleRemoveImage}
						className={clsx('absolute top-2 right-2 p-1 rounded-full', isPortrait ? 'bg-black-300' : 'bg-black-200')}
					>
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
				<div ref={searchRef} className="relative w-71 @mobile:w-41.5">
					<div className="relative button4-medium @mobile:text-13 flex items-center border border-black-300 rounded-lg h-9 px-4 py-[0.5625rem]">
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
						<div className="z-50 absolute top-10 w-full bg-black-000 border border-black-200 button4-medium @mobile:text-13 rounded-lg shadow-lg overflow-hidden">
							{teams.length > 0 ? (
								teams.map((team, index) => (
									<div
										key={team.id}
										className={clsx(
											'flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-black-200 transition-colors',
											{
												'rounded-b-sm': index === teams.length - 1,
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

				<div ref={dropdownRef} className="relative w-fit button4-medium tablet:text-14 @mobile:text-13">
					<button
						onClick={handleDropdownToggle}
						className="flex items-center gap-8 @mobile:gap-2.5 px-4 @mobile:px-3 h-9 border border-black-300 rounded-lg"
					>
						{' '}
						{/*iphone se, 678에서는 양 옆 패딩을 3 정도여야 글자가 정렬이 됨... 모바일에서는 패딩을 3 정도로 줄이면 어떨까...*/}
						<div
							className={` ${
								selectedOption.label === '탭 선택하기' || selectedOption.label === '탭 선택'
									? 'text-black-600'
									: 'text-black-900'
							}`}
						>
							{selectedOption.label}
						</div>
						<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
					</button>

					{isVisibleDropdown && (
						<div className="z-50 absolute top-10 w-[9.125rem] @mobile:w-[97px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
							{categories.map((option, index) => (
								<div
									key={option.value}
									className={clsx('px-4 py-2.5 cursor-pointer hover:bg-black-200 transition-colors', {
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

			<div className="flex justify-center gap-4 mt-4">
				<button
					onClick={() => router.back()}
					className="w-41 @mobile:w-37 button2-semibold @mobile:text-15 px-4 py-2 rounded-lg transition-all text-black-700 bg-black-200"
				>
					취소
				</button>
				<button
					onClick={selectedImage ? postNewsContents : () => alert('대표 이미지를 등록해 주세요.')}
					disabled={!isFormValid}
					className={clsx(
						'w-41 @mobile:w-37 button2-semibold @mobile:text-15 px-4 py-2 rounded-lg transition-all',
						isFormValid ? 'text-black-100 bg-primary-900' : 'bg-black-600 text-black-000',
					)}
				>
					작성 완료
				</button>
			</div>
		</div>
	);
}
