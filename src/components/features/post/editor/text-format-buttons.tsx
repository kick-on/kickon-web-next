'use client';

import clsx from 'clsx';
import BoldIcon from '@/assets/editor/bold.svg';
import UnderlineIcon from '@/assets/editor/underline.svg';
import ItalicIcon from '@/assets/editor/italic.svg';
import EllipsisIcon from '@/assets/editor/ellipsis.svg';
import SortNumericIcon from '@/assets/editor/sort-numeric.svg';
import { useEditorContext } from '@/lib/contexts/editor/context';

const TextFormatButtons = () => {
	const { editor, handleTextFormatToggle } = useEditorContext();

	const textFormatButtons = [
		{ key: 'bold', Icon: BoldIcon },
		{ key: 'underline', Icon: UnderlineIcon },
		{ key: 'italic', Icon: ItalicIcon },
		{ key: 'bulletList', Icon: EllipsisIcon },
		{ key: 'orderedList', Icon: SortNumericIcon },
	];

	return (
		<div className="flex items-center justify-center h-8.5 gap-2 border border-black-300 text-[#8C8C8C] rounded-sm px-2 @mobile:border-0 @mobile:px-0 @mobile:gap-5">
			{textFormatButtons.map(({ key, Icon }) => {
				const isActive = editor?.isActive(key);

				return (
					<button
						key={key}
						className={clsx(
							'flex items-center justify-center w-6 h-6 rounded-sm @mobile:w-4.5 @mobile:h-4.5 @mobile:rounded-sm',
							isActive && 'bg-primary-50 @mobile:bg-transparent',
						)}
						onClick={() => handleTextFormatToggle(key)}
					>
						<Icon className={isActive ? 'stroke-primary-900' : 'stroke-black-600 active:stroke-primary-900'} />
					</button>
				);
			})}
		</div>
	);
};

export default TextFormatButtons;
