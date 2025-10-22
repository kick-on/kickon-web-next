'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

import PostEditor from '@/components/features/post/post-editor.tsx';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import useIsMobile from '@/lib/hooks/useIsMobile';
import ThumbnailUploader from '@/components/features/post/thumbnail-uploader';
import TeamSearchInput from '@/components/features/post/team-search-input';
import CategoryDropdown from '@/components/features/post/category-dropdown';
import { extractEmbeddedLinks, extractMediaFilenamesFromContent } from '@/lib/utils';
import { categories } from '@/lib/constants/options';
import { createNews, patchNewsDetail } from '@/services/apis/news/news.api';
import { CreateNewsRequest, PatchNewsDetailRequest } from '@/services/apis/news/news.type';
import { EditorProvider } from '@/lib/contexts/editor/provider';
//import { useEditorContext } from '@/lib/contexts/editor/context';

export default function Page() {
	const router = useRouter();
	const isMobile = useIsMobile();
	const hasShownAlert = useRef(false);
	const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string; logo: string } | null>(null);
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '',
		value: '',
	});
	const { currentUserInfo, _hasHydrated } = useCurrentUserInfoStore();
	const searchParams = useSearchParams();
	const isEditMode = searchParams.get('edit') === 'true';

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const isFormValid = !!(selectedImage?.trim() && selectedOption.value && title.trim() && body.trim());

	useEffect(() => {
		if (!isEditMode) return;

		const storedData = sessionStorage.getItem('detailContent');
		if (!storedData) return;

		try {
			const parsedData = JSON.parse(storedData);
			console.log('꺼내온 데이터', parsedData);
			setTitle(parsedData.data.title || '');
			setSelectedImage(parsedData.data.thumbnailUrl || '');
			setBody(parsedData.data.content || '');

			if (parsedData.data.team) {
				setSelectedTeam({
					id: parsedData.data.team.pk,
					name: parsedData.data.team.nameKr || parsedData.data.team.nameEn || '팀명 없음',
					logo: parsedData.data.team.logoUrl || '',
				});
			}
			const matchedOption = categories.find((opt) => opt.label === parsedData.data.category);
			if (matchedOption) {
				setSelectedOption(matchedOption);
			} else {
				setSelectedOption({
					label: parsedData.data.category,
					value: parsedData.data.category,
				});
			}
		} catch (error) {
			console.error('잘못된 데이터 형식:', error);
		}
	}, [isEditMode]);

	// isMobile이 null이 아니게 되면 label 설정
	useEffect(() => {
		if (isEditMode) return;

		if (isMobile !== null) {
			setSelectedOption({
				label: isMobile ? '탭 선택' : '탭 선택하기',
				value: '',
			});
		}
	}, [isMobile, isEditMode]);

	useEffect(() => {
		if (hasShownAlert.current || !_hasHydrated) return;
		hasShownAlert.current = true;

		if (!currentUserInfo) {
			alert('로그인 후 작성 가능합니다.');
			const previousPage = sessionStorage.getItem('previousPage');
			router.replace(previousPage);
		}
	}, [currentUserInfo, _hasHydrated, router]);

	const isLoading = useRef(false); // 더블 클릭 -> 중복 호출 방지

	const postNewsContents = async () => {
		console.log('isLoading', isLoading.current);
		if (!currentUserInfo || isLoading.current) {
			return;
		}
		isLoading.current = true;

		const usedImageKeysFromBody = extractMediaFilenamesFromContent(body.trim(), 'img');
		const usedVideoKeys = extractMediaFilenamesFromContent(body.trim(), 'video');
		const embeddedLink = extractEmbeddedLinks(body.trim());

		let thumbnailFilename = '';
		if (selectedImage) {
			thumbnailFilename = decodeURIComponent(selectedImage.split('/').pop() || '');
		}
		const usedImageKeys = [...usedImageKeysFromBody, ...(thumbnailFilename ? [thumbnailFilename] : [])];

		console.log('usedImageKeys:', usedImageKeys);
		console.log('usedVideoKeys:', usedVideoKeys);
		console.log('embeddedLink:', embeddedLink);

		// 공통 요청 데이터
		const requestBody: CreateNewsRequest = {
			title: title.trim(),
			contents: body.trim(),
			thumbnailUrl: selectedImage || '',
			category: selectedOption.value,
			team: selectedTeam?.id || null,
			...(usedImageKeys.length > 0 && { usedImageKeys }),
			...(usedVideoKeys.length > 0 && { usedVideoKeys }),
			...(embeddedLink.length > 0 && { embeddedLink }),
		};

		try {
			if (isEditMode) {
				const parsedData = JSON.parse(sessionStorage.getItem('detailContent'));
				const contentPk = parsedData.data.pk;

				const patchBody: PatchNewsDetailRequest = {
					...requestBody,
				};

				console.log('수정 바디', patchBody);
				const response = await patchNewsDetail(contentPk, patchBody);
				console.log('수정 성공', response);
				router.replace(`/news/${contentPk}`);
			} else {
				console.log('생성 바디', requestBody);
				const response = await createNews(requestBody);
				console.log('작성 성공', response);
				router.replace(`/news/${response.data.pk}`);
			}
		} catch (error) {
			console.error(isEditMode ? '게시글 수정 실패:' : '게시글 작성 실패:', error);
		}
	};

	return (
		<div className="flex flex-col w-full">
			<ThumbnailUploader selectedImage={selectedImage} onChange={setSelectedImage} />

			<div className="flex gap-4 mb-4">
				<TeamSearchInput selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />

				<CategoryDropdown selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

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
			<EditorProvider setBody={setBody} isNews={true} editedBody={body}>
				<PostEditor setTitle={setTitle} editedTitle={title} />
			</EditorProvider>

			<div className="flex w-full justify-center gap-4 mt-[30px] mb-[100px] @mobile:mt-[38px] @mobile:mb-[50px]">
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
					{isEditMode ? '수정 완료' : '작성 완료'}
				</button>
			</div>
		</div>
	);
}
