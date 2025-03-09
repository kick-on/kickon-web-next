'use client';

import Image from 'next/image';
import CommunityDivisionBar from './category-tab/community-division-bar';
import CommunityItem from './category-tab/community-item';
import NewsItem from './category-tab/news-item';
import ComponentFrame from './componentFrame';
import moreIcon from '../../../public/chevron/right-gray.svg';
import clsx from 'clsx';

const RecommendedContent = ({ type, data, isMyTeam = false, teamName = '' }) => {
	const itemsToRender = type === 'news' ? data.slice(0, 3) : data.slice(0, 10);
	const Component = type === 'news' ? NewsItem : CommunityItem;

	return (
		<ComponentFrame isMain={true}>
			<header
				className={clsx('flex mx-4 justify-between pt-7.5 pb-1.5', {
					'border-b border-black-300 pb-7.5': type === 'board',
				})}
			>
				<h2 className="title4-semibold">
					함께 볼 만한 {isMyTeam && teamName && <span className="text-primary-900">{teamName} </span>}
					{type === 'news' ? '뉴스' : '게시글'}
				</h2>

				<a href="#" aria-label="더 보기" className="flex gap-2 items-center">
					<button className="text-black-700 body5-regular flex items-center">
						<span>더 보기</span>
						<Image src={moreIcon} alt="오른쪽 화살표" />
					</button>
				</a>
			</header>

			{type === 'board' && <CommunityDivisionBar />}

			<ul className="flex flex-col">
				{itemsToRender.map((item, index) => (
					<li key={item.id} className="list-none">
						<Component {...item} isMyTeam={type === 'news' && isMyTeam} />
						{index !== itemsToRender.length - 1 && <hr className="border-black-300 mx-4" />}
					</li>
				))}
			</ul>
		</ComponentFrame>
	);
};

export default RecommendedContent;
