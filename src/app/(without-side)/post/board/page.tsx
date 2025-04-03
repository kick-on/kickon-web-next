'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import PostEditor from '@/components/features/post/post-editor.tsx';
import { PostNewsContentsRequest } from '@/services/apis/post/dto';
import { postNewContents } from '@/services/apis/post';
import { useRouter } from 'next/navigation';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import LoginModal from '@/components/common/login-modal/login-modal';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';

export default function Page() {
	const navigate = useRouter();
	const { currentUserInfo } = useCurrentUserInfoStore();
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const userTeams = currentUserInfo?.teamPk
		? [
				{
					label: currentUserInfo.teamName ?? '내 팀',
					value: String(currentUserInfo.teamPk),
					logo: currentUserInfo.teamLogoUrl,
				},
			]
		: [];

	const [teams] = useState<{ label: string; value: string; logo?: string }[]>([
		{ label: '전체', value: '' },
		...userTeams,
	]);

	const [selectedOption, setSelectedOption] = useState<{ label: string; value: string; logo?: string }>(teams[0]);

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
			alert('로그인이 필요합니다.');
			setIsLoginModalOpen(true);
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
			console.log(response);
			navigate.back();
		} catch (error) {
			console.error('게시글 작성 실패:', error);
		}
	};

	return (
		<div className="flex flex-col mx-auto">
			<div ref={dropdownRef} className="relative w-fit button4-medium">
				<button
					onClick={handleDropdownToggle}
					className={clsx(
						'flex items-center gap-2 px-4 py-[0.5625rem] border border-black-300 rounded-lg',
						isVisibleDropdown ? 'mb-[5.75rem]' : 'mb-4',
					)}
				>
					{selectedOption.logo && <Image src={selectedOption.logo} alt={selectedOption.label} width={16} height={16} />}
					<div className={clsx('button4-medium', selectedOption.value !== '' ? 'text-black-900' : 'text-black-900')}>
						{selectedOption.label}
					</div>
					<Image width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
				</button>

				{isVisibleDropdown && (
					<div className="z-50 absolute top-10 w-[9.125rem] bg-black-000 border border-black-300 button4-medium rounded-lg shadow-lg overflow-hidden">
						{teams.map((option, index) => (
							<div
								key={option.value}
								className={clsx('px-4 py-2.5 cursor-pointer hover:bg-black-300 transition-colors', {
									'rounded-b-sm': index === teams.length - 1,
								})}
								onClick={() => handleOptionClick(option)}
							>
								<div className="flex items-center gap-2">
									{option.logo && <Image src={option.logo} alt={option.label} width={16} height={16} />}
									<span>{option.label}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<PostEditor setTitle={setTitle} setBody={setBody} isNews={false} />

			<div className="flex justify-center gap-4 mt-4 mx-auto">
				<button
					onClick={() => console.log('취소')}
					className="w-[164px] button2-semibold px-4 py-2 rounded-lg transition-all text-black-700 bg-black-200"
				>
					취소
				</button>
				<button
					onClick={isFormValid ? postCommunityContents : undefined}
					disabled={!isFormValid}
					className={clsx(
						'w-[164px] button2-semibold px-4 py-2 rounded-lg transition-all',
						isFormValid ? 'text-black-100 bg-primary-900' : 'bg-black-600 text-black-000 cursor-not-allowed',
					)}
				>
					작성 완료
				</button>
				{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
			</div>
		</div>
	);
}
