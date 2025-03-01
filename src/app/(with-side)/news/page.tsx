import ComponentFrame from '@/components/common/componentFrame';
import FloatingWritingButton from '@/components/common/FloatingWritingButton';
import NewsItem from '@/components/common/NewsItem';

export default function Page() {
	const newsList = Array.from({ length: 10 });

	return (
		<ComponentFrame isMain={true}>
			<div className="flex px-4 flex-col">
				{newsList.map((_, index) => (
					<div key={index} className={`${index !== newsList.length - 1 ? 'border-b border-black-300' : ''}`}>
						<NewsItem />
					</div>
				))}
			</div>

			<FloatingWritingButton />
		</ComponentFrame>
	);
}
