export default function PaginationBar() {
	return (
		<div className="flex gap-5 items-start">
			<button>이전</button>
			<button className="flex gap-[1.125rem]"></button>
			<button>다음</button>
		</div>
	);
}
