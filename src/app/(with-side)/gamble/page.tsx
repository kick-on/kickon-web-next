import ComponentFrame from '@/components/common/component-frame';
import CategoryTab from '@/components/features/gamble/category-tab/category-tab';

export default function Page() {
	return (
		<ComponentFrame isMain={true} className="pb-[1.875rem]">
			<CategoryTab />
		</ComponentFrame>
	);
}
