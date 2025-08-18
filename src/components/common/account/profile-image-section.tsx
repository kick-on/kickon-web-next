'use client';

import Image from 'next/image';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import { useRef } from 'react';

export default function ProfileImageSection({
	profileImageUrl,
	setProfileImageUrl,
}: {
	profileImageUrl: string;
	setProfileImageUrl: (url: string) => void;
}) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleCameraButtonClick = async () => {
		if (fileInputRef && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			alert('파일 형식이 올바르지 않습니다.');
			return;
		}

		const presignedResponse = await getPresignedUrl({
			type: 'profile-images',
			fileName: file.name,
		});

		if (presignedResponse) {
			const { presignedUrl, s3Url } = presignedResponse.data;
			await uploadToS3(presignedUrl, file);
			setProfileImageUrl(s3Url);
		}
	};
	return (
		<div className="relative mb-7 w-[68px] h-[68px]">
			<Image
				className="w-full h-full rounded-full object-cover"
				width={68}
				height={68}
				src={profileImageUrl || '/default-profile.svg'}
				alt="프로필 이미지"
			/>
			<button
				onClick={handleCameraButtonClick}
				className="absolute z-10 left-11 top-11
      bg-black-000 border border-black-200 rounded-full p-[0.3125rem]"
			>
				<Image width={18} height={18} src="/camera.svg" alt="프로필 사진 변경" />
			</button>
			<input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
		</div>
	);
}
