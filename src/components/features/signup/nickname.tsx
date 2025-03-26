export default function Nickname({ nickname, onChange }) {
	const isInvalidNickname = !nickname || nickname.length > 8;
	const invalidNicknameAlert = !nickname ? '닉네임을 입력해 주세요.' : '닉네임은 최대 8글자입니다.';

	return (
		<div className="flex flex-col gap-2">
			<div className="subtitle1-medium">닉네임</div>
			<input
				type="text"
				value={nickname}
				placeholder="닉네임은 최대 8글자"
				onChange={onChange}
				className={`px-4 py-3 border rounded-lg body3-regular
              ${isInvalidNickname ? 'border-negative' : 'border-black-300'}
              placeholder:[color:var(--color-black-600)]
              placeholder:[font-size:var(--fs-16)]
              placeholder:[font-weight:var(--fw-regular)]
              placeholder:[line-height:var(--lh-24)]`}
			/>
			{isInvalidNickname && <div className="text-negative caption1-regular">{invalidNicknameAlert}</div>}
		</div>
	);
}
