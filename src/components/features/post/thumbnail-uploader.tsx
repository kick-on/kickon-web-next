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
	setIsThumbnailUploaded: (uploading: boolean) => void;
}

export default function ThumbnailUploader({ selectedImage, onChange, setIsThumbnailUploaded }: ThumbnailUploaderProps) {
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

		if (file.size > 2 * 1024 * 1024) {
			// 2MB 이상 -> 모달 먼저
			setPendingFile(file);
			setShowModal(true);
		} else {
			// 2MB 미만 -> 미리보기 + 업로드
			showPreviewAndUpload(file);
		}
	};

	const showPreviewAndUpload = (file: File) => {
		const previewUrl = URL.createObjectURL(file);
		onChange(previewUrl);

		const img = document.createElement('img');
		img.src = previewUrl;
		img.onload = () => {
			setIsPortrait(img.height > img.width);
		};

		handleFileUpload(file);
	};

	const handleFileUpload = async (file: File) => {
		try {
			setIsThumbnailUploaded?.(false); // 업로드 시작 (아직 업로드 안 됨)

			const presignedResponse = await getPresignedUrl({
				type: 'news-files',
				fileName: file.name,
			});

			const { presignedUrl, s3Url } = presignedResponse.data;
			await uploadToS3(presignedUrl, file);

			onChange(s3Url);
			setIsThumbnailUploaded?.(true); // 업로드 성공
		} catch (error) {
			console.error('파일 업로드 실패:', error);
			setIsThumbnailUploaded?.(false); // 실패 시 false
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
					description={'파일의 용량이 커 압축이 진행됩니다.\n계속하시겠습니까?'}
					onConfirm={async () => {
						setShowModal(false);
						if (pendingFile) {
							const compressedFile = await compressImage(pendingFile);
							showPreviewAndUpload(compressedFile);
							setPendingFile(null);
						}
					}}
					onCancel={() => {
						setShowModal(false);
						setPendingFile(null);
						onChange(null);
						if (fileInputRef.current) fileInputRef.current.value = '';
					}}
				/>
			)}
		</>
	);
}
