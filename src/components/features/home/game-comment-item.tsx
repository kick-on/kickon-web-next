import KickIcon from '@/assets/common/kick/fill-none.svg';
import { GameCommentDto } from '@/services/apis/game/game-reply.type';
import Image from 'next/image';
import clsx from 'clsx';
import { useToggleGameCommentKickMutation } from '@/lib/hooks/queries/useGameReplyQuery';

export interface GameCommentItemProps extends GameCommentDto {
	gamePk: number;
	isBest?: boolean;
}

export default function GameCommentItem({
	pk,
	user,
	contents,
	kickCount,
	kicked,
	gamePk,
	isBest = false,
}: GameCommentItemProps) {
	const toggleKickMutation = useToggleGameCommentKickMutation(gamePk);

	const handleKick = () => {
		toggleKickMutation.mutate(pk);
	};

	return (
		<div className="flex gap-3 justify-between items-center hover:bg-black-100 p-1 rounded-lg">
			<div className="grid grid-cols-[auto_auto_1fr] gap-1 items-start">
				<Image
					src={user.profileImageUrl || '/default-profile.svg'}
					alt=""
					width={16}
					height={16}
					className="w-4 h-4 rounded-full bg-black-200 object-cover shrink-0"
				/>
				<div className="flex gap-1 shrink-0">
					<span className="font-medium">{user.nickname}</span>
					{isBest && (
						<div className="font-semibold text-caption-02 text-primary-900 border border-primary-900 bg-primary-50 rounded-full px-1.5 py-px">
							BEST
						</div>
					)}
				</div>
				<div className={clsx('ml-1 break-words min-w-0', isBest && 'truncate')}>{contents}</div>
			</div>

			<div className="flex gap-1 items-center text-black-600 shrink-0">
				{kickCount}
				<button onClick={handleKick} disabled={toggleKickMutation.isPending}>
					<KickIcon className={clsx('w-4 h-4', kicked ? 'text-primary-900' : 'text-black-600')} />
				</button>
			</div>
		</div>
	);
}
