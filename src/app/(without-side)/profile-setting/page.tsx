'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nickname from '@/components/features/signup/nickname';
import { useEffect, useRef, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import { UpdateUserInfoRequest } from '@/services/auth/dto';
import { getUserInfo, updateUserInfo } from '@/services/auth';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { setCookie } from '@/lib/utils/cookie';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import FavoriteTeamSection from '@/components/common/account/favorite-team-section';

export default function Page() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();

	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [isDuplicated, setIsDuplicated] = useState(false);
	const [nickname, setNickname] = useState<string | null>(null);
	const [teams, setTeams] = useState<(TeamDto | null)[] | null>(null);

	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const isEditable = false;
	const socialLogoUrl = currentUserInfo?.providerType === 'KAKAO' ? '/sns/kakao-small.svg' : '/sns/naver-small.svg';

	// 이미지 업로드
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

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
		if (isDuplicated) {
			setIsDuplicated(false);
		}
	};

	const handleCancelButtonClick = () => {
		const previousPage = sessionStorage.getItem('previousPage');
		router.push(previousPage);
	};

	const handleCompleteButtonClick = () => {
		const body: UpdateUserInfoRequest = {
			profileImageUrl,
			nickname,
			teams: !teams || teams[0].pk === -1 ? undefined : teams.map((team) => team?.pk), // 응원하는 팀이 없는 경우 team을 undefined로
			// league: league.pk, 현재 서버에서 league를 처리하지 않음
		};

		editUserInfo(body);
	};

	const editUserInfo = async (body: UpdateUserInfoRequest) => {
		const response = await updateUserInfo(body);

		if (response === 'DUPLICATED_NICKNAME') {
			setIsDuplicated(true);
		} else if (typeof response === 'string') {
			alert(response);
			setIsDuplicated(false);
		} else {
			setCurrentUserInfo({ ...currentUserInfo, nickname, profileImageUrl });

			const previousPage = sessionStorage.getItem('previousPage');
			router.push(previousPage);
		}
	};

	useEffect(() => {
		// 새로고침해도 유저 정보 유지 -> persist로 대체 가능
		const getCurrentUserInfo = async () => {
			const response = await getUserInfo();

			if (typeof response !== 'string') {
				setCurrentUserInfo(response.data);

				setProfileImageUrl(response.data.profileImageUrl);
				setNickname(response.data.nickname);
				if (response.data.favoriteTeams) {
					setTeams(
						response.data.favoriteTeams ?? [
							{ nameEn: 'no cheering team', nameKr: '응원팀이 없어요.', pk: -1, logoUrl: '/ban.svg' },
						],
					);
				}
			}
		};
		getCurrentUserInfo();
	}, [setCurrentUserInfo]);

	return (
		<div className="m-auto w-[21.5rem] flex flex-col">
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

			<div className="w-full flex flex-col gap-10">
				<Nickname nickname={nickname} isDuplicated={isDuplicated} onChange={handleNicknameChange} />
				<FavoriteTeamSection isEditable={isEditable} initialTeams={teams} />
			</div>

			<hr className="w-full my-10 h-[1px] border-black-200 @mobile:border-black-300" />

			<div className="relative flex flex-col gap-2">
				<div className="flex gap-1.5 items-center subtitle1-semibold">계정 관리</div>
				<div
					className="flex gap-2.5 items-center px-4 py-3 w-full @mobile:text-14
						border border-black-300 rounded-lg bg-black-100 body3-regular"
				>
					<Image width={18} height={18} src={socialLogoUrl} alt={`${currentUserInfo?.providerType} 로고`} />
					{currentUserInfo?.email}
				</div>

				<button
					onClick={() => {
						router.push('/withdrawal');
						setCookie('fromProfile', 'true', 60);
					}}
					className="absolute -bottom-8 right-0 text-black-500 button5-regular underline"
				>
					회원 탈퇴
				</button>
			</div>

			<div className="mt-[6.25rem] flex gap-4">
				<button
					onClick={handleCancelButtonClick}
					className="w-full h-11 flex justify-center items-center @mobile:text-15
            rounded-lg bg-black-200 button2-semibold text-black-700"
				>
					취소
				</button>
				<button
					disabled={!nickname || isDuplicated}
					onClick={handleCompleteButtonClick}
					className="w-full h-11 flex justify-center items-center @mobile:text-15
            rounded-lg button2-semibold text-black-000 enabled:bg-primary-900 disabled:bg-black-600"
				>
					수정 완료
				</button>
			</div>
		</div>
	);
}
