'use client';

import clsx from 'clsx';
import { useState } from 'react';
import NewsItem from './news-item';
import PagenationBar from '../pagenation-bar.tsx/pagenation-bar';

const allNews = [
	{
		id: 1,
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

export default function BoardTab({ mode }: { mode: 'news' | 'community' }) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const tabs = ['전체', '인기', 'FC서울'];
	const isNews = mode === 'news';

	const handleTabClick = (index = tabs.length) => {
		setSelectedIndex(index);
	};

	return (
		<div className="flex flex-col w-fit">
			<div className="flex flex-col w-full">
				<div className="flex pt-[1.875rem] pl-4 header-medium border-b border-black-300">
					{tabs.map((tab, index) => (
						<button
							onClick={() => handleTabClick(index)}
							key={tab}
							className={clsx('px-[0.5625rem] pb-[0.9375rem] border-b-2 border-transparent', {
								'border-primary-900 text-primary-900 header-semibold': selectedIndex === index,
							})}
						>
							{tab}
						</button>
					))}
					{isNews && (
						<button
							onClick={() => handleTabClick()}
							className={clsx('px-[0.5625rem] pb-[0.9375rem] border-b-2 border-transparent', {
								'border-primary-900 text-primary-900 header-semibold': selectedIndex === tabs.length,
							})}
						>
							리그 선택
						</button>
					)}
				</div>
			</div>
			<div className="flex flex-col px-4">
				{allNews.map((news, index) => (
					<>
						<NewsItem key={news.id} {...news} />
						{index !== allNews.length - 1 && <hr className="border-black-300" />}
					</>
				))}
			</div>
			<div className="flex mt-[3.75rem] mb-10 mx-auto">
				<PagenationBar />
			</div>
		</div>
	);
}
