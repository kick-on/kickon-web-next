import QuoteIcon from '@/assets/editor/quote.svg';
import lineIcon from '@/assets/editor/line.svg';
import { useEditorContext } from '@/lib/contexts/editor/context';

const BlockFormatButtons = () => {
	const { editor, handleTextFormatToggle } = useEditorContext();

	const blockFormatButtons = [
		{
			key: 'blockquote',
			Icon: QuoteIcon,
			onClick: () => handleTextFormatToggle('blockquote'),
		},
		{
			key: 'horizontalRule',
			Icon: lineIcon,
			onClick: () => {
				handleTextFormatToggle('horizontalRule');
			},
		},
	];

	return (
		<div className="flex items-center justify-center gap-2 h-8.5 @mobile:border-0 @mobile:px-0 @mobile:gap-5">
			{blockFormatButtons.map(({ key, Icon, onClick }) => {
				const isActive = key !== 'horizontalRule' && editor?.isActive(key);

				return (
					<button
						key={key}
						onClick={onClick}
						className="p-[4px] border border-black-300 rounded-sm @mobile:px-0 @mobile:border-0"
					>
						<div
							className={`flex items-center justify-center w-6 h-6 rounded-xs @mobile:w-4.5 @mobile:h-4.5 @mobile:rounded-sm ${isActive ? 'bg-primary-50 @mobile:bg-transparent' : 'active:bg-primary-50 @mobile:active:bg-transparent'}`}
						>
							<Icon className={isActive ? 'stroke-primary-900' : 'stroke-black-600 active:stroke-primary-900'} />
						</div>
					</button>
				);
			})}
		</div>
	);
};

export default BlockFormatButtons;
