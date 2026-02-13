import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import { useNextMatchDateQuery } from '@/lib/hooks/queries/useNextMatchDateQuery';
import { useEffect, useRef, useState } from 'react';

export default function CalendarPopover({ onClose }: { onClose: () => void }) {
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
			if (!popoverRef.current?.contains(e.target as Node)) {
				onClose();
			}
		};

		document.addEventListener('pointerdown', handleOutsideClick);
		return () => {
			document.removeEventListener('pointerdown', handleOutsideClick);
		};
	}, [onClose]);

	return (
		<div ref={popoverRef} className="fixed bottom-33 right-3 w-[22rem] z-50">
			<MatchPredictionCalendar
				type="match"
				isPopover={true}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
			<div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-black-200" />
		</div>
	);
}
