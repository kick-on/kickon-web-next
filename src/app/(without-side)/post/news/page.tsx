'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

import PostEditor from '@/components/features/post/post-editor.tsx';
import { PostNewsContentsRequest } from '@/services/apis/post/dto';
import { postNewContents } from '@/services/apis/post';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import useIsMobile from '@/lib/hooks/useIsMobile';
import ThumbnailUploader from '@/components/features/post/thumbnail-uploader';
import TeamSearchInput from '@/components/features/post/team-search-input';
import CategoryDropdown from '@/components/features/post/category-dropdown';
import { extractImageFilenamesFromContent } from '@/lib/utils/filenameUtils';

export default function Page() {
	const router = useRouter();
	const isMobile = useIsMobile();
	const hasShownAlert = useRef(false);
	const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string; logo: string } | null>(null);
	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({
		label: '',
		value: '',
	});
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const isFormValid = !!(selectedImage?.trim() && selectedOption.value && title.trim() && body.trim());
	const searchParams = useSearchParams();
	const isEditMode = searchParams.get('edit') === 'true';

	useEffect(() => {
		if (!isEditMode) return;

		const storedData = sessionStorage.getItem('detailContent');
		if (!storedData) return;

		try {
			const parsedData = JSON.parse(storedData);
			setTitle(parsedData.data.title || '');
			setSelectedImage(parsedData.data.thumbnailUrl || '');
			setBody(parsedData.data.content || '');
		} catch (error) {
			console.error('잘못된 데이터 형식:', error);
		}
	}, [isEditMode]);

	// isMobile이 null이 아니게 되면 label 설정
	useEffect(() => {
		if (isMobile !== null) {
			setSelectedOption({
				label: isMobile ? '탭 선택' : '탭 선택하기',
				value: '',
			});
		}
	}, [isMobile]);

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

	const postNewsContents = async () => {
		if (!currentUserInfo) {
			return;
		}
		const usedImageKeysFromBody = extractImageFilenamesFromContent(body.trim()); // editor로부터 받아온 body에서 파일명 추출

		console.log(selectedImage); // s3 url -> 여기에서 파일명 추출 필요
		let thumbnailFilename = '';
		if (selectedImage) {
			thumbnailFilename = decodeURIComponent(selectedImage.split('/').pop() || '');
		}

		const usedImageKeys = [...usedImageKeysFromBody, ...(thumbnailFilename ? [thumbnailFilename] : [])];
		console.log('usedImageKeys:', usedImageKeys); // 이미지 키 추출 확인

		const requestBody: PostNewsContentsRequest = {
			team: selectedTeam?.id || null,
			title: title.trim(),
			contents: body.trim(),
			thumbnailUrl: selectedImage || '',
			category: selectedOption.value,
			usedImageKeys,
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

			<PostEditor setTitle={setTitle} setBody={setBody} isNews={false} editedTitle={title} editedBody={body} />

			<div className="flex justify-center gap-4 mt-4">
				<button
					onClick={() => {
						const confirmCancel = window.confirm('게시글 작성을 취소하겠습니까?');
						if (confirmCancel) {
							const previousPage = sessionStorage.getItem('previousPage');
							router.push(previousPage);
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
					작성 완료
				</button>
			</div>
		</div>
	);
}
