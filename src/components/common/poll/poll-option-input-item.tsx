import React from 'react';

interface PollOptionInputItemProps {
	index: number;
	option: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PollOptionInputItem({ index, option, onChange }: PollOptionInputItemProps) {
	return (
		<div className="flex items-center gap-2.5 text-body-05">
			<div className="h-4 border-r border-black-300 w-8 text-center font-medium">{index}</div>
			<input
				type="text"
				className="flex-1 p-2 rounded bg-black-100 outline-0"
				placeholder="내용을 입력하세요."
				value={option}
				onChange={onChange}
			/>
		</div>
	);
}
