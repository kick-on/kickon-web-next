'use client';

import Checkbox from '@/components/features/signup/checkbox';
import Image from 'next/image';
import { useState } from 'react';

export default function Page() {
	const [agreements, setAgreements] = useState({
		all: false,
		age: false,
		term: false,
		privacy: false,
		marketing: false,
	});

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

	const buttonDisabled = !(agreements.age && agreements.term && agreements.privacy);

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

	return (
		<div className="w-[21.5rem] m-auto flex flex-col items-center">
			<div className="mb-8 title1-bold">회원가입</div>
			<div className="flex gap-2">
				<Image width={24} height={24} src="/sns/naver-small.svg" alt="네이버" />
				<div className="body3-regular">계정으로 가입을 진행하고 있어요.</div>
			</div>

			<div className="mt-[4.75rem] mb-[4.5rem] w-full flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<div className="subtitle1-medium">닉네임</div>
					<input
						type="text"
						maxLength={8}
						placeholder="닉네임은 최대 8글자"
						className={`px-4 py-3 border border-black-300 rounded-lg body3-regular`}
					/>
					<div className="text-negative caption1-regular">닉네임을 입력해 주세요.</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="subtitle1-medium">리그</div>
					<button className="px-4 py-3 flex items-center border border-black-300 rounded-lg body3-regular">
						<Image width={18} height={18} src="/league-logo/premier-league.svg" alt="프리미어 리그" />
						<div className="ml-2.5 mr-auto">프리미어 리그</div>
						<Image width={18} height={18} src="/chevron/down.svg" alt="리그 선택" />
					</button>
				</div>
				<div className="flex flex-col gap-2">
					<div className="subtitle1-medium">응원팀</div>
					<button className="px-4 py-3 flex items-center border border-black-300 rounded-lg body3-regular">
						<Image width={18} height={18} src="/team-logo/liverpool.svg" alt="리버풀" />
						<div className="ml-2.5 mr-auto">리버풀</div>
						<Image width={18} height={18} src="/chevron/down.svg" alt="응원팀 선택" />
					</button>
				</div>
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
					disabled={buttonDisabled}
					className="w-full py-2.5 mt-14 rounded-lg button2-semibold text-black-000
										enabled:[background-color:var(--color-primary-900)] disabled:[background-color:var(--color-black-300)]"
				>
					회원가입
				</button>
			</div>
		</div>
	);
}
