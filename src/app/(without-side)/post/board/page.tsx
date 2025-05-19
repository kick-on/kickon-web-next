'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import PostEditor from '@/components/features/post/post-editor.tsx';
import { PostNewsContentsRequest } from '@/services/apis/post/dto';
import { postNewContents } from '@/services/apis/post';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import { getUserInfo } from '@/services/auth';
import { trimTextWithoutSpaces } from '@/lib/utils/trimTextWithoutSpaces';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { getDetailContent } from '@/services/apis/detail';

export default function Page() {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const searchParams = useSearchParams();
	const editingPk = searchParams.get('editingPk');

	useEffect(() => {
		const getDetailContentData = async () => {
			if (!editingPk) return;

			try {
				const response = await getDetailContent('board', Number(editingPk));
				const data = response?.data;

				if (data) {
					const teamOption = data.team
						? {
								label: data.team.nameKr ?? '',
								value: String(data.team.pk),
								logo: data.team.logoUrl ?? '',
							}
						: {
								label: '전체',
								value: '전체',
							};

					setSelectedOption(teamOption);

					setTitle(data.title);
					setBody(data.content);
				}
			} catch (err) {
				console.error('게시글 불러오기 실패:', err);
			}
		};

		getDetailContentData();
	}, [editingPk]);

	const teams: { label: string; value: string; logo?: string }[] = [
		{ label: '전체', value: '전체' },
		...(currentUserInfo?.favoriteTeam?.pk
			? [
					{
						label: currentUserInfo.favoriteTeam.nameKr || currentUserInfo.favoriteTeam.nameEn || '내 팀',
						value: String(currentUserInfo.favoriteTeam.pk),
						logo: currentUserInfo.favoriteTeam.logoUrl,
					},
				]
			: []),
	];

	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string; logo?: string }>({
		label: '탭 선택하기',
		value: '',
	});

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const isFormValid = !!(selectedOption.value !== undefined && title.trim() && body.trim());

	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleOptionClick = (option: { label: string; value: string; logo?: string }) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
	};

	const hasShownAlert = useRef(false);

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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleDropdown(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(body);

	const postCommunityContents = async () => {
		if (!getAccessToken() || !getRefreshToken()) {
			return;
		}
		if (!isFormValid) return;

		const requestBody: PostNewsContentsRequest = {
			team: selectedOption.value ? Number(selectedOption.value) : null,
			title: title.trim(),
			contents: body.trim(),
			hasImage: hasImage,
		};

		console.log(requestBody);
		try {
			const response = await postNewContents(requestBody);

			router.push(`/board/${response.data.pk}`);
		} catch (error) {
			console.error('게시글 작성 실패:', error);
		}
	};

	return (
		<div className="flex flex-col w-full mx-auto">
			<div ref={dropdownRef} className="relative w-[9.125rem] button4-medium @mobile:text-13">
				<button
					onClick={handleDropdownToggle}
					className={clsx(
						'flex items-center justify-between w-full px-4 py-[0.5625rem] border border-black-300 rounded-lg',
						isVisibleDropdown ? 'mb-[5.75rem]' : 'mb-4',
					)}
				>
					<div className="flex items-center gap-2">
						{selectedOption.logo && (
							<Image
								className="w-4 h-4 object-contain"
								src={selectedOption.logo}
								alt={selectedOption.label}
								width={16}
								height={16}
							/>
						)}
						<div className={`${selectedOption.label === '탭 선택하기' ? 'text-black-600' : 'text-black-900'}`}>
							{isMobile ? trimTextWithoutSpaces(selectedOption.label) : selectedOption.label}
						</div>
					</div>
					<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
				</button>

				{isVisibleDropdown && (
					<div className="z-50 absolute top-10 w-full bg-black-000 border border-black-300 rounded-lg shadow-lg overflow-hidden">
						{teams.map((option, index) => (
							<div
								key={option.value}
								className={clsx('px-4 py-2.5 cursor-pointer hover:bg-black-300 transition-colors', {
									'rounded-b-sm': index === teams.length - 1,
								})}
								onClick={() => handleOptionClick(option)}
							>
								<div className="flex items-center gap-2">
									{option.logo && (
										<Image
											className="w-4 h-4 object-contain"
											src={option.logo}
											alt={option.label}
											width={16}
											height={16}
										/>
									)}
									<span>{isMobile ? trimTextWithoutSpaces(option.label) : option.label}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<PostEditor setTitle={setTitle} setBody={setBody} isNews={false} initialTitle={title} initialBody={body} />

			<div className="flex w-full justify-center gap-4 mt-4 mx-auto">
				<button
					onClick={() => {
						const confirmCancel = window.confirm('게시글 작성을 취소하겠습니까?');
						if (confirmCancel) {
							router.back();
						}
					}}
					className="w-[164px] button2-semibold px-4 py-2 rounded-lg transition-all text-black-700 bg-black-200"
				>
					취소
				</button>
				<button
					onClick={isFormValid ? postCommunityContents : undefined}
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
