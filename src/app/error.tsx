'use client';

export default function Error() {
	return (
		<div className="w-full py-40 flex flex-col gap-10 display-semibold text-center">
			<div>
				서버 오류가 발생했습니다.
				<br />
				관리자에게 문의해 주세요.
			</div>
			<br />
			<div className="text-lg flex flex-col">
				<span>instagram: @kickonfc</span>
				<span>e-mail: business.kickon@gmail.com</span>
			</div>
		</div>
	);
}
