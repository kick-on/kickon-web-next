'use client';

import Image from 'next/image';
import Profile from './profile';
import { Suspense, useEffect, useRef } from 'react';

export default function ProfileModal({ onClickButton }: { onClickButton: () => void }) {
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!modalRef.current) return;

		const handleOutsideClick = (e: MouseEvent) => {
			if (!modalRef.current.contains(e.target as Node)) {
				onClickButton();
			}
		};

		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [modalRef, onClickButton]);

	return (
		<div
			ref={modalRef}
			className="absolute top-[3.375rem] -right-[0.2188rem] w-[20.25rem] h-[39.375rem] 
							bg-black-000 border border-black-100 rounded-[0.625rem] pt-4 px-4
							flex flex-col gap-5 shadow-profile-modal"
		>
			<Image
				className="absolute -top-2.5 right-[1.125rem]"
				style={{
					filter: 'drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.05))',
				}}
				width={20}
				height={10}
				src={'/profile-modal-arrow.svg'}
				alt="화살표"
			/>
			<button className="ml-auto w-6 h-6">
				<Image onClick={onClickButton} className="brightness-0" src={'/x.svg'} alt="닫기" width={24} height={24} />
			</button>
			<Suspense>
				<Profile onClickButton={onClickButton} />
			</Suspense>
		</div>
	);
}
