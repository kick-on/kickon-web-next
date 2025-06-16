'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import PostEditor from '@/components/features/post/post-editor.tsx';
import { PostContentsRequest } from '@/services/apis/post/dto';
import { postNewContents } from '@/services/apis/post';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import { trimTextWithoutSpaces } from '@/lib/utils/trimTextWithoutSpaces';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { extractImageFilenamesFromContent } from '@/lib/utils/filenameUtils';
import { patchDetailContent } from '@/services/apis/detail/actions';
import { PostPinToggle } from '@/components/features/post/post-pin-toggle';

export default function Page() {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	// currentUserInfo.인플루언서? 일 때만 핀 토글 컴포넌트 렌더링 하고 취소/저장 버튼 mt 조정 pc일 때는 30, 모바일은 38
	const searchParams = useSearchParams();
	const isEditMode = searchParams.get('edit') === 'true';

	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string; logo?: string }>({
		label: '탭 선택하기',
		value: '',
	});
	const teams = useMemo(() => {
		const sortedTeams = currentUserInfo?.favoriteTeams
			? [...currentUserInfo.favoriteTeams].sort((a, b) => (a.priorityNum ?? 999) - (b.priorityNum ?? 999))
			: [];

		return [
			{ label: '전체', value: '전체' },
			...sortedTeams.map((team) => ({
				label: team.nameKr || team.nameEn || '내 팀',
				value: String(team.pk),
				logo: team.logoUrl,
			})),
		];
	}, [currentUserInfo]);

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const isFormValid = !!(selectedOption.value !== undefined && title.trim() && body.trim());
	const [isPinned, setIsPinned] = useState(false);

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
		if (!isEditMode || teams.length === 0) return;

		const storedData = sessionStorage.getItem('detailContent');
		if (!storedData) return;

		try {
			const parsedData = JSON.parse(storedData);
			setTitle(parsedData.data.title || '');
			setBody(parsedData.data.content || '');

			const teamValue = String(parsedData.data.team?.pk);
			const matchedOption = teams.find((option) => option.value === teamValue);

			setSelectedOption(matchedOption ?? { label: '탭 선택하기', value: '' });
			//setIsPinned(!!parsedData.data.pinned); // 게시글 상세정보의 pinned가 true면 true, 아니면 false -> 실제 dto 바탕으로 수정 필요!!!!
		} catch (error) {
			console.error('잘못된 데이터 형식:', error);
		}
	}, [isEditMode, teams]);

	useEffect(() => {
		if (hasShownAlert.current) return;
		hasShownAlert.current = true;

		if (!currentUserInfo) {
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
		if (!currentUserInfo) {
			return;
		}
		if (!isFormValid) return;

		const usedImageKeys = extractImageFilenamesFromContent(body.trim());

		console.log('게시글 생성, 삭제 시 보내는 이미지 키 배열', usedImageKeys);

		if (isEditMode) {
			const parsedData = JSON.parse(sessionStorage.getItem('detailContent'));
			const contentPk = parsedData.data.pk;
			const teamValue =
				selectedOption.value === '' || selectedOption.value === '전체' ? null : Number(selectedOption.value);

			const finalTeam = isNaN(teamValue) ? null : teamValue;

			const patchBody: Partial<PostContentsRequest> = {
				title: title.trim(),
				contents: body.trim(),
				hasImage,
				usedImageKeys,
				team: finalTeam,
			};
			console.log(patchBody);
			const response = await patchDetailContent(contentPk, false, patchBody);
			console.log('수정 성공', response);
			router.replace(`/board/${contentPk}`);
		} else {
			const postBody: PostContentsRequest = {
				title: title.trim(),
				contents: body.trim(),
				hasImage,
				usedImageKeys,
				team: selectedOption.value ? Number(selectedOption.value) : null,
				//pinned: isPinned, // 수정 필요!!
			};

			console.log(postBody);
			const response = await postNewContents(postBody);
			router.push(`/board/${response.data.pk}`);
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
									{'logo' in option && (
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

			<PostEditor setTitle={setTitle} setBody={setBody} isNews={false} editedTitle={title} editedBody={body} />

			<PostPinToggle onPinChange={setIsPinned} />

			<div
				className={clsx(
					'flex w-full justify-center gap-4 mx-auto mt-[30px] mb-[100px] @mobile:mt-[38px] @mobile:mb-[50px]',
					currentUserInfo.type === 'influence' && 'mb-[60px] @mobile:mb-[50px]',
				)} // 이런 식으로... 유저 정보에 인플루언서 정보가 오면!!
			>
				<button
					onClick={() => {
						const confirmCancel = window.confirm('게시글 작성을 취소하겠습니까?');
						if (confirmCancel) {
							const previousPage = sessionStorage.getItem('previousPage');
							router.replace(previousPage);
						}
					}}
					className="w-41 @mobile:w-37 button2-semibold px-4 py-2 rounded-lg transition-all text-black-700 bg-black-200"
				>
					취소
				</button>
				<button
					onClick={isFormValid ? postCommunityContents : undefined}
					disabled={!isFormValid}
					className={clsx(
						'w-41 @mobile:w-37 button2-semibold px-4 py-2 rounded-lg transition-all',
						isFormValid ? 'text-black-100 bg-primary-900' : 'bg-black-600 text-black-000',
					)}
				>
					작성 완료
				</button>
			</div>
		</div>
	);
}
