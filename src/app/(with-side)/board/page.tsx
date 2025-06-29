import CategoryTab from '@/components/common/category-tab/category-tab';
import EmptyState from '@/components/common/category-tab/empty-state';
import ComponentFrame from '@/components/common/component-frame';
import { Suspense } from 'react';

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q: string; type: string; id: string; page?: string }>;
}) {
	const params = await searchParams;
	const q = params.q;
	const type = params.type;
	const id = params.id;
	const page = params.page;

	return (
		<ComponentFrame className="mb-5" isMain={true}>
			<Suspense fallback={<EmptyState isNews={false} />}>
				<CategoryTab mode="board" q={q} type={type} id={id} page={page} />
			</Suspense>
		</ComponentFrame>
	);
}
