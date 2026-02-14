import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import { useNextMatchDateQuery } from '@/lib/hooks/queries/useNextMatchDateQuery';
import { useEffect, useRef, useState } from 'react';

interface CalendarPopoverProps {
	isCalendarOpen: boolean;
	onClose: () => void;
}
export default function CalendarPopover({ isCalendarOpen, onClose }: CalendarPopoverProps) {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const { data: nextDate } = useNextMatchDateQuery();

	useEffect(() => {
		if (!nextDate) return;

		const [year, month, date] = nextDate.split('-').map(Number);
		setSelectedDate(new Date(year, month - 1, date));
	}, [nextDate]);

	const popoverRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!popoverRef.current) return;

		const handleOutsideClick = (e: PointerEvent) => {
			const target = e.target as HTMLElement;
			const isDateTile = target.closest('.react-calendar__tile');
			const isInsidePopover = popoverRef.current.contains(target);

			// 날짜 타일 클릭, 팝오버 외부 클릭 시 close, 그 외 클릭은 무시
			if (isDateTile || !isInsidePopover) {
				onClose();
			}
		};

		document.addEventListener('pointerdown', handleOutsideClick);
		return () => {
			document.removeEventListener('pointerdown', handleOutsideClick);
		};
	}, [onClose]);

	return (
		<div
			ref={popoverRef}
			aria-hidden={!isCalendarOpen}
			className={`
                absolute bottom-full right-0 mb-3 w-[22rem]
                transition-all duration-200 ease-out
                ${isCalendarOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'}
            `}
		>
			<MatchPredictionCalendar
				type="match"
				isPopover={true}
				selectedDate={selectedDate}
				setSelectedDate={(date) => {
					setSelectedDate(date);
				}}
			/>
			<div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-black-200" />
		</div>
	);
}
