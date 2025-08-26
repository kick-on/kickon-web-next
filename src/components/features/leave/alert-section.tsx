import { leaveAlerts } from '@/lib/constants/leave';
import Image from 'next/image';

export default function AlertSection() {
	return (
		<div className="w-full p-4 flex flex-col gap-2.5 bg-black-800 rounded-lg">
			{leaveAlerts.map((alert) => (
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
	);
}
