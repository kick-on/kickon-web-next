import ComponentFrame from '@/components/common/componentFrame';
import CategoryTab from '@/components/common/category-tab/category-tab';

export default function Page() {
	return (
		<ComponentFrame isMain={true}>
			<CategoryTab />
		</ComponentFrame>
	);
}
