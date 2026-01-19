'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import PostEditor from '@/components/features/post/post-editor.tsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { extractEmbeddedLinks, extractMediaFilenamesFromContent } from '@/lib/utils';
import { PostPinToggle } from '@/components/features/post/post-pin-toggle';
import { CreateBoardRequest, PatchBoardDetailRequest } from '@/services/apis/board/board.type';
import { createBoard, patchBoardDetail } from '@/services/apis/board/board.api';
import { EditorProvider } from '@/lib/contexts/editor/provider';
import { CreatePollRequest } from '@/services/apis/poll/poll.type';
import { createPoll } from '@/services/apis/poll/poll.api';
import { usePollStore } from '@/lib/store/usePollStore';

export default function Page() {
	const router = useRouter();
	const { currentUserInfo, _hasHydrated } = useCurrentUserInfoStore();
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
	const [isPinned, setIsPinned] = useState(false);

	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const isFormValid = !!(selectedOption.value !== undefined && title.trim() && body.trim());

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
			setIsPinned(parsedData.data.isPinned); // 인플루언서의 고정 여부 불러오기
		} catch (error) {
			console.error('잘못된 데이터 형식:', error);
		}
	}, [isEditMode, teams]);

	useEffect(() => {
		if (hasShownAlert.current || !_hasHydrated) return;
		hasShownAlert.current = true;

		if (!currentUserInfo) {
			alert('로그인 후 작성 가능합니다.');
			const previousPage = sessionStorage.getItem('previousPage');
			router.replace(previousPage);
		}
	}, [currentUserInfo, _hasHydrated, router]);

	const { title: pollTitle, options, endAt, isMultipleChoice, clearPollStore } = usePollStore();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleDropdown(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			clearPollStore();
		};
	}, []);

	// 중복 호출 방지
	const isLoading = useRef(false);
	const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(body);

	const postCommunityContents = async () => {
		if (!currentUserInfo || !isFormValid || isLoading.current) return;
		isLoading.current = true;

		const usedImageKeys = extractMediaFilenamesFromContent(body.trim(), 'img');
		const usedVideoKeys = extractMediaFilenamesFromContent(body.trim(), 'video');
		const embeddedLink = extractEmbeddedLinks(body.trim());

		console.log('usedImageKeys:', usedImageKeys);
		console.log('usedVideoKeys:', usedVideoKeys);
		console.log('embeddedLink:', embeddedLink);

		// 팀 값 처리
		const teamValue =
			selectedOption.value === '' || selectedOption.value === '전체' ? null : Number(selectedOption.value);
		const finalTeam = isNaN(teamValue) ? null : teamValue;

		// 공통 요청 데이터
		const requestBody = {
			title: title.trim(),
			contents: body.trim(),
			hasImage,
			team: finalTeam,
			isPinned,
			...(usedImageKeys.length > 0 && { usedImageKeys }),
			...(usedVideoKeys.length > 0 && { usedVideoKeys }),
			...(embeddedLink.length > 0 && { embeddedLink }),
		};

		try {
			if (isEditMode) {
				const parsedData = JSON.parse(sessionStorage.getItem('detailContent'));
				const contentPk = parsedData.data.pk;

				const patchBody: PatchBoardDetailRequest = { ...requestBody };
				console.log('수정 바디', patchBody);

				const response = await patchBoardDetail(contentPk, patchBody);
				console.log('수정 성공', response);
				router.replace(`/board/${contentPk}`);
			} else {
				const postBody: CreateBoardRequest = { ...requestBody };
				console.log('작성 바디', postBody);

				const response = await createBoard(postBody);
				console.log('작성 성공', response);

				// 투표가 있는 경우 투표 생성
				if (pollTitle) {
					const pollBody: CreatePollRequest = {
						endAt,
						isMultipleChoice,
						title: pollTitle,
						contents: options,
						board: response.data.pk,
					};
					await createPoll(pollBody);
				}

				router.replace(`/board/${response.data.pk}`);
			}
		} catch (error) {
			console.error(isEditMode ? '게시글 수정 실패:' : '게시글 작성 실패:', error);
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
						<div
							className={clsx(
								'truncate block',
								`${selectedOption.label === '탭 선택하기' ? 'text-black-600' : 'text-black-900'}`,
							)}
							title={selectedOption.label}
						>
							{selectedOption.label}
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
									<span className="truncate block" title={option.label}>
										{option.label}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<EditorProvider setBody={setBody} isNews={false} editedBody={body}>
				<PostEditor setTitle={setTitle} editedTitle={title} />
			</EditorProvider>

			{currentUserInfo?.isInfluencer && <PostPinToggle isPinned={isPinned} onPinChange={setIsPinned} />}

			<div
				className={clsx(
					'flex w-full justify-center gap-4 mx-auto mt-[30px] mb-[100px] @mobile:mt-[38px] @mobile:mb-[50px]',
					currentUserInfo?.isInfluencer && 'mb-[60px] @mobile:mb-[50px]',
				)}
			>
				<button
					onClick={() => {
						const confirmCancel = window.confirm(
							isEditMode ? '게시글 수정을 취소하겠습니까?' : '게시글 작성을 취소하겠습니까?',
						);
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
					{isEditMode ? '수정 완료' : '작성 완료'}
				</button>
			</div>
		</div>
	);
}
