import clsx from 'clsx';

export default function FavoriteTeamHeader({
	isSignup,
	teamCount,
	onClickEditButton,
}: {
	isSignup: boolean;
	teamCount: number;
	onClickEditButton: () => void;
}) {
	return (
		<>
			<div className="subtitle1-semibold mb-2 flex items-center justify-between">
				<div>
					MY팀 {isSignup && '선택'} (<span className={clsx({ 'text-primary-900': isSignup })}>{teamCount}</span>
					/3)
				</div>
				{!isSignup && (
					<button onClick={onClickEditButton} className="ml-auto text-button-05 font-medium text-primary-900">
						편집
					</button>
				)}
			</div>
			<div className="caption1-regular mb-6">
				* {isSignup && '최대 3순위까지 선택할 수 있으며, '}프로필에는 1순위만 표기돼요.
			</div>
		</>
	);
}
