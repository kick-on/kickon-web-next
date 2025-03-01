'use client';

import Image from 'next/image';

const NewsItem = () => {
	return (
		<article className="flex flex-col items-start rounded-lg px-4 py-6">
			{/* 기사 헤더: 팀 로고 + 뉴스 주제 */}
			<header className="flex items-center gap-2">
				<Image src="/team-logo/ulsan.svg" alt="팀 로고" width={24} height={24} className="rounded-full" />
				<span className="caption1-medium bg-black-200 rounded-[20px] px-2.5 py-0.5 text-black-800">부상</span>
			</header>

			{/* 기사 본문: 제목 + 내용 + 사진 */}
			<section className="flex items-start gap-6 mt-2.5">
				{/* 제목과 내용 */}
				<div className="flex flex-col flex-1 gap-2">
					<h2 className="title3-semibold text-black-900">제주SK, FC서울 상대로 다음 달 ‘홈 개막전’</h2>
					<p className="w-[448px] font-normal leading-6 text-[13px] text-black-900">
						프로축구 K리그1 제주SK가 다음 달 15일 FC서울과의 홈 개막전을 시작으로 2025시즌에 돌입합니다.
						한국프로축구연맹이 발표한 2025시즌 일정표를 보면 제주는 다음 달 15일 오후 3시 30분 제주월드컵경기장...
					</p>
				</div>

				{/* 기사 이미지 */}
				<figure className="self-end overflow-hidden rounded-[10px]">
					<Image src="/cow.png" alt="기사 이미지" width={160} height={104} className="object-contain" />
				</figure>
			</section>

			{/* 작성자 정보 & 좋아요/댓글 */}
			<footer className="flex flex-col w-full text-[#8C8C8C] body6-regular">
				{/* 닉네임 & 조회수 */}
				<div className="flex items-center mt-4.5 gap-2">
					<Image src="/default-profile.svg" alt="작성자 프로필" width={24} height={24} className="rounded-full" />
					<span className="text-black-900">닉네임</span>
					<span className="ml-2">1시간 전</span>
					<div>|</div>
					<span>읽음 1,204</span>
				</div>

				{/* 좋아요 & 댓글 */}
				<div className="flex justify-end items-center gap-3">
					<span className="flex items-center gap-1.5">
						❤️ <span>120</span>
					</span>
					<span className="flex items-center gap-1.5">
						💬 <span>34</span>
					</span>
				</div>
			</footer>
		</article>
	);
};

export default NewsItem;
