import Image from 'next/image';

export default function Page() {
	const reasons = ['서비스 품질 및 정보 불만족', '다른 계정으로 재가입', '사용성 불만족', '기타'];
	const alerts = [
		`계정을 삭제하면 모든 활동 정보 및 포인트가 삭제되며,\n삭제 후 7일간 동일한 계정으로 다시 가입할 수 없어요.`,
		`추후에 동일한 계정으로 재가입하셔도\n포인트 내역은 복구되지 않아요.`,
		`다른 사용자 게시글의 댓글은 삭제되지 않으니\n미리 확인하세요.`,
	];

	return (
		<div className="w-[21.5rem] m-auto flex flex-col items-center body3-regular @mobile:text-14 @mobile:leading-4">
			<div
				className="mb-[3.125rem] title1-bold 
          @mobile:mb-[2.375rem] @mobile:text-24 @mobile:font-semibold @mobile:leading-8"
			>
				회원 탈퇴
			</div>
			<span className="mb-10 @mobile:mb-8">
				<span className="font-semibold">가나다라마바사아</span>님이 탈퇴하시려는 이유가 궁금해요.
			</span>

			<div className="w-full flex flex-col gap-4">
				{reasons.map((reason) => (
					<div key={reason} id="reason" className="relative w-full">
						<input
							id={reason}
							name="reason"
							type="radio"
							className="peer absolute left-4 top-1/2 -translate-y-1/2 appearance-none
                w-[1.125rem] h-[1.125rem] rounded-full border border-black-300 checked:before:content-['']
                checked:before:absolute checked:before:left-[0.1875rem] checked:before:top-[0.1875rem]
                checked:before:w-2.5 checked:before:h-2.5 checked:before:bg-primary-900 checked:before:rounded-full"
						/>
						<label
							htmlFor={reason}
							className="w-full py-[0.9375rem] pl-[3.125rem] flex gap-4 items-center bg-black-000
                rounded-lg border border-black-300 peer-checked:border-primary-900 cursor-pointer"
						>
							{reason}
						</label>
					</div>
				))}
			</div>

			<hr className="w-full border-black-300 my-15" />

			<div className="w-full p-4 flex flex-col gap-2.5 bg-black-800 rounded-lg">
				{alerts.map((alert) => (
					<div
						key={alert}
						className="flex gap-1.5 items-center text-black-000 body7-regular @mobile:font-12
              @max-[374px]:whitespace-normal @max-[374px]:break-words whitespace-break-spaces break-keep"
					>
						<Image src={'/alert-circle.svg'} alt="주의 아이콘" width={18} height={18} />
						{alert}
					</div>
				))}
			</div>

			<label className="flex items-center gap-2 body5-medium mt-[1.875rem] mb-20">
				<input
					type="checkbox"
					className="relative w-[0.875rem] h-[0.875rem] border border-black-300 rounded-xs appearance-none cursor-pointer
            checked:[background-color:var(--color-primary-900)] checked:[border:var(--color-primary-900)]
            after:content-[''] after:absolute after:w-full after:h-full
            after:bg-[url('/check.svg')] after:bg-center after:bg-no-repeat
            after:opacity-0 checked:after:opacity-100"
				/>
				<span className="cursor-pointer body6-regular">안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
			</label>

			<div className="w-full flex gap-[0.9375rem]">
				<button className="flex-1 py-2.5 rounded-lg bg-black-200 button2-semibold text-black-700 @mobile:text-15">
					취소
				</button>
				<button
					className="flex-1 py-2.5 rounded-lg button2-semibold text-black-000 @mobile:text-15
            enabled:bg-primary-900 disabled:bg-black-300"
				>
					회원 탈퇴
				</button>
			</div>
		</div>
	);
}
