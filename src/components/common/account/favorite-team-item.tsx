'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export default function FavoriteTeamItem({ orderNum }: { orderNum: number }) {
	const [isActive, setIsActive] = useState(true);

	return (
		<div className="grow space-y-1">
			<div
				className="w-full h-7 @mobile:h-6 flex justify-center items-center
          bg-black-900 rounded-lg text-black-000 caption1-medium"
			>
				{orderNum}
			</div>
			<div
				className={clsx(
					`relative w-full h-auto aspect-[5/4]
          flex flex-col gap-1 justify-center items-center rounded-lg bg-black-000`,
					isActive ? 'p-[4px] pb-[2px] border-2 border-primary-900' : 'p-[5px] pb-[3px] border border-black-300',
				)}
			>
				<button
					onClick={() => setIsActive(!isActive)}
					className={clsx(
						'absolute w-4 h-4 rounded-full bg-black-200',
						isActive ? 'top-[3px] right-[3px]' : 'top-1 right-1',
					)}
				>
					<Image className="m-auto" src="/small-x.svg" alt="삭제" width={12} height={12} />
				</button>
				<div className="relative w-auto grow aspect-square">
					<Image className="w-auto h-auto object-cover" src="/logo/icon-red.svg" alt="로고" fill />
				</div>
				<div className="flex gap-0.5">
					<Image src="/draggable.svg" alt="왼쪽 화살표" width={18} height={18} />
				</div>
			</div>
		</div>
	);
}
