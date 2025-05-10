export default function CompleteButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			onClick={onClick}
			className="w-full h-9 border border-black-200 rounded-md
      flex justify-center items-center button5-medium shadow-predict-button transition-colors
      hover:bg-primary-700 hover:border-0 hover:shadow-kick-button-active active:bg-primary-900 active:text-white"
		>
			선택 완료
		</button>
	);
}
