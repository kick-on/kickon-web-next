import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import VoteIcon from '@/assets/editor/vote.svg';

const InteractionButtons = () => {
	const { editor, handleTextFormatToggle } = useEditorContext();

	const textFormatButtons = [{ key: 'vote', Icon: VoteIcon }];

	return (
		<div className="flex items-center justify-center gap-2">
			{textFormatButtons.map(({ key, Icon }) => (
				<button
					key={key}
					className={clsx('flex items-center justify-center rounded-sm border border-black-300 bg-white h-8.5 w-8.5')}
					onClick={() => handleTextFormatToggle(key)}
				>
					<Icon className="w-5 aspect-square text-black-600" />
				</button>
			))}
		</div>
	);
};

export default InteractionButtons;
