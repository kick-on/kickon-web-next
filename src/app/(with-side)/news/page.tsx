import ComponentFrame from '@/components/common/componentFrame';
import FloatingWritingButton from '@/components/common/FloatingWritingButton';

export default function Page() {
	return (
		<ComponentFrame isMain={true}>
			뉴스 페이지
			<FloatingWritingButton />
		</ComponentFrame>
	);
}
