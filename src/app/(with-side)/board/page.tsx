import CategoryTab from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';

export default function Page({ searchParams }: { searchParams: { q: string } }) {
	return (
		<ComponentFrame isMain={true}>
			<CategoryTab mode="community" q={searchParams.q} />
		</ComponentFrame>
	);
}
