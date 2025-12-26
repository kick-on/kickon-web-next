import KickIcon from '@/assets/common/kick/fill-white.svg';

export default function CommunityDivisionBar() {
	return (
		<div
			className="@mobile:hidden flex py-[0.9375rem] px-4 justify-between
				subtitle2-medium text-center border-b border-black-200"
		>
			<div className="mr-4 w-full text-center">제목</div>
			<div className="flex gap-4">
				<div className="w-[8.125rem]">글쓴이</div>
				<div className="w-[4.0625rem]">날짜</div>
				<div className="w-[2.625rem]">조회</div>
				<div className="w-[2.6875rem] flex gap-1">
					<KickIcon className="text-black" width={16} height={16} />킥
				</div>
			</div>
		</div>
	);
}
