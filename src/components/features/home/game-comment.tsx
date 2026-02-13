import KickIcon from '@/assets/common/kick/fill-none.svg';

export default function GameComment({ pk }: { pk: number }) {
	return (
		<div className="flex flex-col gap-3 text-caption-01 mx-4">
			<div className="space-y-2">
				<div className="flex flex-col gap-1.5 min-h-0 max-h-26 game-comment-scrollbar -mr-3 pr-1">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((kickCount) => (
						<div key={kickCount} className="flex justify-between items-center">
							<div className="flex gap-1 items-center">
								<div className="w-4 h-4 rounded-full bg-black-200" />
								<span className="font-medium">닉네임</span>
								<span className="ml-1">와 손흥민 미쳣음</span>
							</div>

							<div className="flex gap-1 items-center text-black-600">
								{kickCount}
								<button>
									<KickIcon className={`w-4 h-4 ${kickCount % 3 === 0 ? 'text-primary-900' : 'text-[#8F8F8F]'}`} />
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-between items-center sticky bottom-0">
					<div className="flex gap-1 items-center">
						<div className="w-4 h-4 rounded-full bg-black-200" />
						<span className="font-medium">닉네임</span>
						<div className="font-semibold text-caption-02 text-primary-900 border border-primary-900 bg-primary-50 rounded-full px-1.5 py-px">
							BEST
						</div>
						<span className="ml-1 ">와 손흥민 미쳣음</span>
					</div>

					<div className="flex gap-1 items-center text-black-600">
						33
						<button>
							<KickIcon className={`w-4 h-4 text-[#8F8F8F]`} />
						</button>
					</div>
				</div>
			</div>

			<div className="bg-black-200 rounded-full grid grid-cols-[1fr_auto]">
				<input type="text" className="px-4 py-1.5 outline-0" placeholder="댓글을 입력하세요..." />
				<button className="px-3 text-black-700">등록</button>
			</div>
		</div>
	);
}
