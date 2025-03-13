'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Page() {
	const route = useRouter();

	const handleCancelButtonClick = () => {
		route.push('/');
	};

	const handleCompleteButtonClick = () => {
		// api 호출 후
		route.push('/');
	};

	return (
		<div className="m-auto w-[21.5rem] flex flex-col">
			<div className="relative">
				<Image width={68} height={68} src="/default-profile.svg" alt="프로필 이미지" />
				<button
					className="absolute z-10 left-11 top-11
            bg-black-000 border border-black-200 rounded-full p-[0.3125rem]"
				>
					<Image width={18} height={18} src="/camera.svg" alt="프로필 사진 변경" />
				</button>
			</div>

			<div className="flex flex-col gap-2 mt-[4.25rem]">
				<div className="flex gap-1.5 items-center subtitle1-medium">계정 관리</div>
				<button
					className="flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg bg-black-100 body3-regular"
				>
					<Image width={18} height={18} src="/sns/naver-small.svg" alt="네이버 로고" />
					email.naver.com
				</button>
			</div>

			<div className="mt-[6.25rem] flex gap-4">
				<button
					onClick={handleCancelButtonClick}
					className="w-full h-11 flex justify-center items-center
            rounded-lg bg-black-200 button2-semibold text-black-700"
				>
					취소
				</button>
				<button
					onClick={handleCompleteButtonClick}
					className="w-full h-11 flex justify-center items-center
            rounded-lg bg-primary-900 button2-semibold text-black-000"
				>
					수정 완료
				</button>
			</div>
		</div>
	);
}
