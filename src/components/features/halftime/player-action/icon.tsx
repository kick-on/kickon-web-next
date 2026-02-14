import KickRed from '@/assets/halftime/kick-red.svg';
import Kick from '@/assets/halftime/kick-fill-none.svg';
import Comment from '@/assets/halftime/comment.svg';
import Share from '@/assets/halftime/share.svg';
import Paper from '@/assets/halftime/paper.svg';

export function KickIcon({ isKicked }: { isKicked: boolean }) {
	return isKicked ? <KickRed className="w-6 h-6" /> : <Kick className="text-black-600" />;
}

export function CommentIcon() {
	return <Comment />;
}

export function ShareIcon() {
	return <Share />;
}

export function PaperIcon() {
	return <Paper />;
}
