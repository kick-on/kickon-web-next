import Image from 'next/image';

export default function CommunityDivisionBar() {
	return (
		<div className="flex py-[0.9375rem] mx-4 justify-between subtitle2-medium text-center border-b border-black-300">
			<div className="ml-[5.625rem]">제목</div>
			<div className="flex gap-4">
				<div className="w-[7.25rem]">글쓴이</div>
				<div className="w-[4.0625rem]">날짜</div>
				<div className="w-[2.625rem]">조회</div>
				<div className="w-[2.6875rem] flex gap-1">
					<Image width={16} height={16} src="/kick/black.svg" alt="킥" />킥
				</div>
			</div>
		</div>
	);
}
