import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import VoteIcon from '@/assets/editor/vote.svg';

const InteractionButtons = () => {
	const { editor } = useEditorContext();

	const handlePollButtonClick = () => {
		if (!editor) return;

		let hasPoll = false;
		editor.state.doc.descendants((node) => {
			if (node.type.name === 'pollComponent') {
				hasPoll = true;
				return false; // 순회 종료
			}
		});

		if (hasPoll) {
			alert('투표는 게시글당 하나만 생성할 수 있습니다.');
			return;
		}
		editor.chain().focus().setPoll().run();
	};

	const interfactionButtons = [
		{
			key: 'poll',
			Icon: VoteIcon,
			onClick: handlePollButtonClick,
		},
	];

	return (
		<div className="flex items-center justify-center gap-2">
			{interfactionButtons.map(({ key, Icon, onClick }) => (
				<button
					key={key}
					className={clsx('flex items-center justify-center rounded-sm border border-black-300 bg-white h-8.5 w-8.5')}
					onClick={onClick}
				>
					<Icon className="w-5 aspect-square text-black-600" />
				</button>
			))}
		</div>
	);
};

export default InteractionButtons;
