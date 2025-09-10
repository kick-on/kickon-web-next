'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import { compressImage } from '@/lib/utils';
import AlertModal from '../detail/alert-modal';

interface ThumbnailUploaderProps {
	selectedImage: string | null;
	onChange: (url: string | null) => void;
	onUploadingChange?: (uploading: boolean) => void;
}

export default function ThumbnailUploader({ selectedImage, onChange, onUploadingChange }: ThumbnailUploaderProps) {
	const [isPortrait, setIsPortrait] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// 미리보기 먼저 보여주기
		const previewUrl = URL.createObjectURL(file);
		onChange(previewUrl);

		// orientation 체크
		const img = document.createElement('img');
		img.src = previewUrl;
		img.onload = () => {
			setIsPortrait(img.height > img.width);
		};

		if (file.size > 2 * 1024 * 1024) {
			// 5MB 이상 -> 모달 열고 confirm 대기
			setPendingFile(file);
			setShowModal(true);
		} else {
			// 5MB 미만 -> s3 업로드
			handleFileUpload(file);
		}
	};

	const handleFileUpload = async (file: File) => {
		try {
			onUploadingChange?.(true); // 업로드 시작 알림

			const presignedResponse = await getPresignedUrl({
				type: 'news-files',
				fileName: file.name,
			});

			const { presignedUrl, s3Url } = presignedResponse.data;
			await uploadToS3(presignedUrl, file);

			onChange(s3Url);
		} catch (error) {
			console.error('파일 업로드 실패:', error);
		} finally {
			onUploadingChange?.(false); // 업로드 종료 알림
		}
	};

	const handleRemoveImage = () => {
		onChange(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<>
			{selectedImage ? (
				<div className="relative w-full h-80.5 @mobile:h-47.5 mb-4 bg-black-200 rounded-[10px] overflow-hidden flex items-center justify-center">
					<Image
						src={selectedImage}
						alt="업로드된 대표 이미지"
						layout="fill"
						objectFit={isPortrait ? 'contain' : 'cover'}
						className="rounded-[10px]"
					/>
					<button
						onClick={handleRemoveImage}
						className={clsx('absolute top-2 right-2 p-1 rounded-full', isPortrait ? 'bg-black-300' : 'bg-black-200')}
					>
						<Image src="/x/white.svg" alt="삭제 버튼" width={18} height={18} />
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

			{showModal && pendingFile && (
				<AlertModal
					type="confirm"
					description={'파일의 용량이 커 압축이 진행될 예정입니다.\n계속하시겠습니까?'}
					onConfirm={async () => {
						setShowModal(false);
						if (pendingFile) {
							const compressedFile = await compressImage(pendingFile);
							await handleFileUpload(compressedFile);
							setPendingFile(null);
						}
					}}
					onCancel={() => {
						setShowModal(false);
						setPendingFile(null);
					}}
				/>
			)}
		</>
	);
}

// 사용자가 파일 선택 -> 미리보기 url 삽입 -> 파일의 용량 확인 -> 5mb 이상? -> 압축될 거라고 alert -> 압축 -> s3 업로드 -> 미리보기 url을 s3 url로 교체
// 사용자가 파일 선택 -> 미리보기 url 삽입 -> 파일의 용량 확인 -> 5mb 이하? -> 압축 ㄴㄴ -> s3 업로드 -> 교체

// 걍 두 경우 모두 s3 업로드 되기 전까지 작성 완료 버튼 비활성화 시키고 5mb 이상은 파일의 크기가 커서 압축 진행된다. 계속하겠냐 alert 띄우기
// 5mb으로 한 이유는? 쿠팡 페이지를 보면 로딩되는 이미지는 1mb 이하임 -> 우리는 next.js의 image 컴포넌트로 최적화 진행할 거고
// lambda로 리사이징 할 거임 -> 즉 로딩되는 건 업로드될 때의 이미지가 아니라 이미 축소된 것임.
// 그런데도 압축하는 이유는? s3 업로드 시간을 단축하고자. 그리고 너무 큰 이미지를 서버에 저장시키지 않으려고...
