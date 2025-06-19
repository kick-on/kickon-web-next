'use client';

import Checkbox from '@/components/features/signup/checkbox';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Nickname from '@/components/features/signup/nickname';
import { UpdatePrivacyRequest, UpdateUserInfoRequest } from '@/services/auth/dto';
import { updatePrivacy, updateUserInfo } from '@/services/auth';
import { agreementDatas } from '@/lib/constants/agreementDatas';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie, setCookie } from '@/lib/utils/cookie';
import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';
import FavoriteTeamSection from '@/components/common/account/favorite-team-section';
export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const provider = searchParams.get('provider');
	const socialLogoUrl = provider === 'naver' ? '/sns/naver-small.svg' : '/sns/kakao-small.svg';
	const socialLogoAlt = provider === 'naver' ? '네이버 로고 이미지' : '카카오 로고 이미지';

	const [isValidAccess, setIsValidAccess] = useState(false);

	const [isDuplicated, setIsDuplicated] = useState(false);
	const [nickname, setNickname] = useState<string | null>(null);
	const [teams, setTeams] = useState<number[] | null>(null);
	const [agreements, setAgreements] = useState({
		all: false,
		age: false,
		term: false,
		privacy: false,
		marketing: false,
	});

	const isValidNickname = nickname && !isDuplicated;
	const isAllRequiredChecked = agreements.age && agreements.term && agreements.privacy;
	const isButtonDisabled = !(isValidNickname && isAllRequiredChecked && teams);

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
		if (isDuplicated) {
			setIsDuplicated(false);
		}
	};

	const handleCheckboxChange = (key) => {
		const prev = agreements[key];

		if (key === 'all') {
			setAgreements({
				all: !prev,
				age: !prev,
				term: !prev,
				privacy: !prev,
				marketing: !prev,
			});
		} else {
			const updated = { ...agreements, [key]: !prev };
			updated.all = updated.age && updated.term && updated.privacy && updated.marketing;
			setAgreements(updated);
		}
	};

	const handleSignupButtonClick = async () => {
		// 회원가입(정보 수정)
		const updateUserInfoRequest: UpdateUserInfoRequest = {
			nickname: nickname,
			teams: !teams || teams[0] === -1 ? undefined : teams,
		};
		const updateUserInfoResponse = await updateUserInfo(updateUserInfoRequest);

		if (updateUserInfoResponse === 'DUPLICATED_NICKNAME') {
			if (isDuplicated === false) setIsDuplicated(true); // 닉네임 중복
		} else if (typeof updateUserInfoResponse === 'string') {
			if (isDuplicated === true) setIsDuplicated(false); // 기타 오류
			console.log(updateUserInfoResponse);
		} else {
			// 성공 시 약관 동의 api 호출
			const privacyRequest: UpdatePrivacyRequest = {
				privacyAgreedAt: agreements.privacy && new Date().toISOString().split('.')[0] + 'Z',
				marketingAgreedAt: agreements.marketing ? new Date().toISOString().split('.')[0] + 'Z' : undefined,
			};
			const privacyResponse = await updatePrivacy(privacyRequest);

			if (typeof privacyResponse === 'string') {
				console.log(privacyResponse);
			} else {
				// 성공 시 재로그인
				const redirectUrl = `${DOMAIN_URL || 'http://localhost:3000'}/api/auth/${provider}/callback`;
				router.push(`${SERVER_URL}/oauth2/authorization/${provider}?state=${redirectUrl}`);
			}
		}
	};

	// 소셜 로그인을 통한 접근이 아닌 경우 홈으로 리디렉션
	useEffect(() => {
		const fromLogin = getCookie('fromLogin');

		if (fromLogin === 'true') {
			setIsValidAccess(true);
		} else {
			alert('잘못된 접근입니다.');
			router.replace('/');
		}
	}, [router]);

	useEffect(() => {
		return () => {
			if (isValidAccess) {
				setCookie('fromLogin', '', 0);
			}
		};
	}, [isValidAccess]);

	return (
		<div className="w-[21.5rem] m-auto flex flex-col items-center">
			<div className="mb-8 @mobile:mb-4 title1-bold @mobile:text-24 @mobile:font-semibold @mobile:leading-8">
				회원가입
			</div>
			<div className="flex gap-2">
				<Image width={24} height={24} src={socialLogoUrl} alt={socialLogoAlt} />
				<div className="body3-regular @mobile:text-14">계정으로 가입을 진행하고 있어요.</div>
			</div>

			<div className="mt-[4.75rem] @mobile:mt-[3.125rem] mb-[4.5rem] w-full flex flex-col gap-[3.125rem] @mobile:gap-10">
				<Nickname nickname={nickname} isDuplicated={isDuplicated} onChange={handleNicknameChange} />
				<FavoriteTeamSection setTeams={setTeams} />
			</div>

			<div className="p-2.5 w-full flex flex-col gap-4">
				{agreementDatas.map(({ key, content, hasTerm, documentUrl }) => (
					<Checkbox
						key={key}
						content={content}
						hasTerm={hasTerm}
						documentUrl={documentUrl}
						checked={agreements[key]}
						onChange={() => handleCheckboxChange(key)}
					/>
				))}
				<button
					onClick={handleSignupButtonClick}
					disabled={isButtonDisabled}
					className="w-full py-2.5 mt-14 rounded-lg button2-semibold text-black-000 @mobile:text-15
										enabled:bg-primary-900 disabled:bg-black-300"
				>
					회원가입
				</button>
			</div>
		</div>
	);
}
