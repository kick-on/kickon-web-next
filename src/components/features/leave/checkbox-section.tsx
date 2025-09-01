export default function CheckboxSection({ setIsValidCheck }) {
	return (
		<label className="flex items-center gap-2 body5-medium mt-[1.875rem] mb-20">
			<input
				onChange={() => setIsValidCheck((prev) => !prev)}
				type="checkbox"
				className="relative w-[0.875rem] h-[0.875rem] border border-black-300 rounded-xs appearance-none cursor-pointer
          checked:bg-primary-900 checked:border-primary-900
          before:content-[''] before:absolute before:w-full before:h-full
          before:bg-[url('/check.svg')] before:bg-center before:bg-no-repeat
          before:hidden checked:before:block"
			/>
			<span className="cursor-pointer body6-regular">안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
		</label>
	);
}
