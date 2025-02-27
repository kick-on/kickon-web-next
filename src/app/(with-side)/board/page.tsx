import BoardTab from '@/components/common/board-tab/board-tab';
import ComponentFrame from '@/components/common/componentFrame';

export default function Page() {
	return (
		<ComponentFrame isMain={true}>
			<BoardTab mode="community" />
		</ComponentFrame>
	);
}
