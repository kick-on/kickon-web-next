import ComponentFrame from '@/components/common/componentFrame';
import CategoryTab from '@/components/common/category-tab/category-tab';

export default function Page({ searchParams }: { searchParams: { q: string; type: string; id: string } }) {
	const q = searchParams.q;
	const type = searchParams.type;
	const id = searchParams.id;

	return (
		<ComponentFrame isMain={true}>
			<CategoryTab mode="news" q={q} type={type} id={id} />
		</ComponentFrame>
	);
}
