import KickRed from '@/assets/halftime/kick-red.svg';
import Kick from '@/assets/halftime/kick-fill-none.svg';
import Share from '@/assets/halftime/share.svg';
import Paper from '@/assets/halftime/paper.svg';

export function KickIcon({ isKicked }: { isKicked: boolean }) {
	return isKicked ? <KickRed className="w-6 h-6 " /> : <Kick />;
}

export function ShareIcon() {
	return <Share />;
}

export function PaperIcon() {
	return <Paper />;
}
