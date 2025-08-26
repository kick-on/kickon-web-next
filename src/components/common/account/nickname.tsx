import Image from 'next/image';

export default function Nickname({
	nickname,
	isDuplicated,
	onChange,
}: {
	nickname: null | string;
	isDuplicated: boolean;
	onChange: (e) => void;
}) {
	const isInvalidNickname = nickname === '' || isDuplicated;
	const invalidNicknameAlert =
		nickname === '' ? '닉네임을 입력해 주세요.' : '이미 존재하는 닉네임입니다. 다른 닉네임을 입력해 주세요.';

	const handleXbuttonClick = () => {
		onChange({ target: { value: '' } });
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="subtitle1-semibold">닉네임</div>
			<div className="relative bg-black-000">
				<input
					type="text"
					value={nickname || ''}
					maxLength={8}
					placeholder="닉네임은 최대 8글자"
					onChange={onChange}
					className={`w-full px-4 py-3 border rounded-lg body3-regular outline-none
              ${isInvalidNickname ? 'border-negative' : 'border-black-300'}
              placeholder:[color:var(--color-black-600)]
              placeholder:[font-size:var(--text-16)]
              placeholder:[font-weight:var(--font-weight-regular)]
              placeholder:[line-height:var(--lh-24)]
							@mobile:text-14 @mobile:placeholder:[font-size:var(--text-14)]`}
				/>
				{nickname && (
					<button className="absolute top-1/2 -translate-y-1/2 right-4" onClick={handleXbuttonClick}>
						<Image width={18} height={18} src={'/x/white.svg'} alt="닉네임 전체 삭제" />
					</button>
				)}
			</div>
			{isInvalidNickname && <div className="text-negative caption1-regular">{invalidNicknameAlert}</div>}
		</div>
	);
}
