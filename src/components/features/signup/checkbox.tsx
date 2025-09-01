'use client';

export default function Checkbox({ content, hasTerm, documentUrl, checked, onChange }) {
	return (
		<div className="flex">
			<label className="flex items-center gap-2 text-body-05 font-medium">
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className="relative w-[0.875rem] h-[0.875rem] border border-black-300 rounded-xs appearance-none cursor-pointer
                  checked:[background-color:var(--color-primary-900)] checked:[border:var(--color-primary-900)]
                  after:content-[''] after:absolute after:w-full after:h-full
                  after:bg-[url('/check.svg')] after:bg-center after:bg-no-repeat
                  after:opacity-0 checked:after:opacity-100"
				/>
				<span className="cursor-pointer">{content}</span>
			</label>
			{hasTerm && (
				<span
					onClick={() => {
						if (window) {
							window.open(documentUrl, '_blank');
						}
					}}
					className="text-button-05 text-black-700 underline ml-auto cursor-pointer"
				>
					약관보기
				</span>
			)}
		</div>
	);
}
