import MostReadNewsList from './most-read-news-list/most-read-news-list';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import Profile from './profile';

export default async function RightSide() {
	const { isMobile } = await getServerDeviceType();

	if (isMobile) return null;

	return (
		<aside className="tablet:hidden flex flex-col gap-4 relative">
			<Profile />
			<MostReadNewsList />
		</aside>
	);
}
