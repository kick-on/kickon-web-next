import CategoryTab from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q: string; type: string; id: string }>;
}) {
	const params = await searchParams;
	const q = params.q;
	const type = params.type;
	const id = params.id;

	return (
		<ComponentFrame isMain={true}>
			<CategoryTab mode="news" q={q} type={type} id={id} />
		</ComponentFrame>
	);
}
