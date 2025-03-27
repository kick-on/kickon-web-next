import ComponentFrame from '@/components/common/componentFrame';
import CategoryTab from '@/components/common/category-tab/category-tab';

export default function Page({ searchParams }: { searchParams: { q: string } }) {
	return (
		<ComponentFrame isMain={true}>
			<CategoryTab mode="news" q={searchParams.q} />
		</ComponentFrame>
	);
}
