import ComponentFrame from '@/components/common/componentFrame';
import BoardTab from '@/components/common/board-tab/board-tab';

export default function Page() {
	return (
		<ComponentFrame isMain={true}>
			<BoardTab mode="news" />
		</ComponentFrame>
	);
}
