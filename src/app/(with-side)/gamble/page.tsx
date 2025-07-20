import ComponentFrame from '@/components/common/component-frame';
import CategoryTab from '@/components/features/gamble/category-tab/category-tab';
import { Suspense } from 'react';

export default function Page() {
	return (
		<ComponentFrame isMain={true} className="pb-[1.875rem]">
			<Suspense>
				<CategoryTab />
			</Suspense>
		</ComponentFrame>
	);
}
