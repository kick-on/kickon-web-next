export interface Button {
	text: string;
	onClick: () => void;
	disabled?: boolean;
}

export default function BottomButton({ buttons }: { buttons: Button[] }) {
	return (
		<div className="w-full flex gap-4">
			{buttons.map((b) =>
				'disabled' in b ? (
					<InteractiveButton key={b.text} disabled={b.disabled} onClick={b.onClick}>
						{b.text}
					</InteractiveButton>
				) : (
					<DefaultButton key={b.text} onClick={b.onClick}>
						{b.text}
					</DefaultButton>
				),
			)}
		</div>
	);
}

const DefaultButton = ({ children, onClick }) => (
	<button
		onClick={onClick}
		className="w-full h-11 flex justify-center items-center
      rounded-lg bg-black-200 text-button-02 font-semibold text-black-700
      @mobile:text-button-03 @mobile:font-semibold"
	>
		{children}
	</button>
);

const InteractiveButton = ({ children, onClick, disabled }) => (
	<button
		disabled={disabled}
		onClick={onClick}
		className="w-full h-11 flex justify-center items-center
      rounded-lg text-button-02 font-semibold @mobile:text-button-03 @mobile:font-semibold
      text-black-000 enabled:bg-primary-900 disabled:bg-black-600"
	>
		{children}
	</button>
);
