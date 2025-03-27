'use client';

import Checkbox from '@/components/features/signup/checkbox';
import AccountSelectbox from '@/components/common/account-selectbox';
import Image from 'next/image';
import { useState } from 'react';
import Nickname from '@/components/features/signup/nickname';
import { leagues } from '@/lib/constants/leagues';
import { UpdatePrivacyRequest } from '@/services/auth/dto';
import { updatePrivacy } from '@/services/auth';

const checkboxDatas = [
	{
		key: 'all',
		content: '모두 동의',
		hasTerm: false,
	},
	{
		key: 'age',
		content: '만 14세 이상 가입 동의 (필수)',
		hasTerm: false,
	},
	{
		key: 'term',
		content: '서비스 이용약관 동의 (필수)',
		hasTerm: true,
	},
	{
		key: 'privacy',
		content: '개인정보처리방침 동의 (필수)',
		hasTerm: true,
	},
	{
		key: 'marketing',
		content: '마케팅 정보 수신 동의 (선택)',
		hasTerm: true,
	},
];

export default function Page() {
	const [nickname, setNickname] = useState('');
	const [league, setLeague] = useState('');
	const [team, setTeam] = useState('');
	const [agreements, setAgreements] = useState({
		all: false,
		age: false,
		term: false,
		privacy: false,
		marketing: false,
	});

	const isValidNickname = nickname.length > 0 && nickname.length < 9;
	const isAllRequiredChecked = agreements.age && agreements.term && agreements.privacy;
	const isButtonDisabled = !(isValidNickname && isAllRequiredChecked && league && team);

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
	};

	const handleLeagueChange = (selectedLeague) => {
		if (selectedLeague === league) return;
		setLeague(selectedLeague);
	};

	const handleTeamChange = (selectedTeam) => {
		if (selectedTeam === team) return;
		setTeam(selectedTeam);
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
		const request: UpdatePrivacyRequest = {
			privacyAgreedAt: agreements.privacy && new Date().toISOString(),
			marketingAgreedAt: agreements.marketing && new Date().toISOString(),
		};

		const response = await updatePrivacy(request);
		console.log(response);
	};

	return (
		<div className="w-[21.5rem] m-auto flex flex-col items-center">
			<div className="mb-8 title1-bold">회원가입</div>
			<div className="flex gap-2">
				<Image width={24} height={24} src="/sns/naver-small.svg" alt="네이버" />
				<div className="body3-regular">계정으로 가입을 진행하고 있어요.</div>
			</div>

			<div className="mt-[4.75rem] mb-[4.5rem] w-full flex flex-col gap-6">
				<Nickname nickname={nickname} onChange={handleNicknameChange} />
				<AccountSelectbox category="리그" options={leagues} content={league} onChange={handleLeagueChange} />
				{league && <AccountSelectbox category="응원팀" options={leagues} content={team} onChange={handleTeamChange} />}
			</div>

			<div className="p-2.5 w-full flex flex-col gap-4">
				{checkboxDatas.map(({ key, content, hasTerm }) => (
					<Checkbox
						key={key}
						content={content}
						hasTerm={hasTerm}
						checked={agreements[key]}
						onChange={() => handleCheckboxChange(key)}
					/>
				))}
				<button
					onClick={handleSignupButtonClick}
					disabled={isButtonDisabled}
					className="w-full py-2.5 mt-14 rounded-lg button2-semibold text-black-000
										enabled:[background-color:var(--color-primary-900)] disabled:[background-color:var(--color-black-300)]"
				>
					회원가입
				</button>
			</div>
		</div>
	);
}
