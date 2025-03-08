'use client';

import clsx from 'clsx';
import NewsItem from './news-item';
import PagenationBar from '../pagenation-bar.tsx/pagenation-bar';
import CommunityItem from './community-item';
import SelectBox from './select-box';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CommunityDivisionBar from './community-division-bar';

const allNews = [
	{
		id: 1,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’ 제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: true,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 2,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: true,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 3,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: true,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 4,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: true,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 5,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 6,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 7,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 8,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 9,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
	{
		id: 10,
		teamLogo: '/team-logo/ulsan.svg',
		team: '울산',
		tag: '부상',
		title: '제주SK, FC서울 상대로 다음 달 ‘홈 개막전’',
		content:
			'프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다. 한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경',
		image: '',
		nickname: '닉네임',
		isCertified: false,
		timeAgo: '1시간 전',
		views: '1,098',
		kick: 55,
		comment: 23,
	},
];

const allCommunities = [
	{
		id: 1,
		title: '(속보) 손흥민 다리 부상 ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 2,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 3,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 4,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 5,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 6,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 7,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 8,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 9,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
	{
		id: 10,
		title: '(속보) 손흥민 다리 부상 ㄷㄷ',
		hasImage: true,
		comment: 20,
		nickname: '닉네임최대여덟자',
		createdAt: '2025.02.26',
		views: '1,023',
		kick: 22,
	},
];

const renderItems = (items, ItemComponent) => (
	<div>
		{items.map((item, index) => (
			<div key={item.id}>
				<ItemComponent {...item} />
				{index !== items.length - 1 && <hr className="border-black-300 mx-4" />}
			</div>
		))}
	</div>
);

export default function CategoryTab() {
	const pathname = usePathname();
	const q = useSearchParams().get('q');

	const tabs = ['전체', '인기', 'FC서울'];
	const isNews = pathname === '/news';

	return (
		<div className="flex flex-col w-full">
			<div className="flex gap-4 pt-[0.9375rem] pl-4 header-medium border-b border-black-300">
				{tabs.map((tab) => (
					<Link
						href={`${pathname}?q=${tab}`}
						key={tab}
						className={clsx('px-[0.5rem] py-[0.9375rem] border-b-2 border-transparent', {
							'border-primary-900 text-primary-900 header-semibold': q === tab,
						})}
					>
						{tab}
					</Link>
				))}
				{isNews && (
					<div
						className={clsx('border-b-2 border-transparent', {
							'border-primary-900 text-primary-900 header-semibold': !tabs.includes(q),
						})}
					>
						<SelectBox isClickedOtherTab={tabs.includes(q)} />
					</div>
				)}
			</div>
			{isNews ? (
				renderItems(allNews, NewsItem)
			) : (
				<>
					<CommunityDivisionBar />
					{renderItems(allCommunities, CommunityItem)}
				</>
			)}
			<div className="flex mt-[3.75rem] mb-10 mx-auto">
				<PagenationBar />
			</div>
		</div>
	);
}
