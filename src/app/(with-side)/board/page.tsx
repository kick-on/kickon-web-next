import CategoryTab from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';

export default function Page() {
	return (
		<ComponentFrame isMain={true}>
			<CategoryTab />
		</ComponentFrame>
	);
}
