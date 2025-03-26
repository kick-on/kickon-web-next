'use client';

import Image from 'next/image';
import CommunityDivisionBar from './category-tab/community-division-bar';
import CommunityItem from './category-tab/community-item';
import NewsItem from './category-tab/news-item';
import ComponentFrame from './componentFrame';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const RecommendedContent = ({ mode, data, teamName = '' }) => {
	const pathname = usePathname();

	const isMyTeam = Boolean(teamName);
	const isNews = mode === '뉴스';

	const itemsToRender = isNews ? data.slice(0, 3) : data.slice(0, 10);
	const Component = isNews ? NewsItem : CommunityItem;
	const displayTitle =
		pathname === '/' && mode === '게시글' ? (
			'클럽 커뮤니티'
		) : (
			<>
				함께 볼 만한 {isMyTeam && <span className="text-primary-900">{teamName} </span>}
				{mode}
			</>
		);

	return (
		<ComponentFrame isMain={true}>
			<header
				className={clsx('flex mx-4 justify-between pt-7.5 pb-1.5', {
					'border-b border-black-300 pb-7.5': !isNews,
				})}
			>
				<h3 className="title4-semibold">{displayTitle}</h3>

				<a href="#" aria-label="더 보기" className="flex gap-2 items-center text-black-700 body5-regular">
					<span>더 보기</span>
					<Image src="/chevron/right-gray.svg" width={18} height={18} alt="오른쪽 화살표" />
				</a>
			</header>

			{!isNews && <CommunityDivisionBar />}

			<div className="flex flex-col">
				{itemsToRender.map((item, index) => (
					<div key={item.id}>
						<Component {...item} isMyTeam={isMyTeam} />
						{index !== itemsToRender.length - 1 && <hr className="border-black-300 mx-4" />}
					</div>
				))}
			</div>
		</ComponentFrame>
	);
};

export default RecommendedContent;
