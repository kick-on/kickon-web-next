import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import VoteIcon from '@/assets/editor/vote.svg';

const InteractionButtons = () => {
	const { editor } = useEditorContext();

	const interfactionButtons = [
		{
			key: 'vote',
			Icon: VoteIcon,
			onClick: () => editor.chain().focus().setPoll().run(),
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
