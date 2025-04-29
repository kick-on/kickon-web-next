import Image from 'next/image';

export default function LoginButton({ social, onClick }) {
	const src = social === '카카오' ? '/sns/kakao-small.svg' : '/sns/naver-small.svg';
	const backgroundColor = social === '카카오' ? 'bg-[#FDE500]' : 'bg-[#00C73C]';
	const textColor = social === '카카오' ? 'text-black-800' : 'text-black-000';

	return (
		<button
			onClick={onClick}
			className={`flex gap-3 pl-[5.5rem] pr-[5.8125rem] py-[0.6875rem] rounded-lg ${backgroundColor}`}
		>
			<Image width={26} height={26} src={src} alt={social} />
			<div className={`button2-semibold @mobile:text-15 ${textColor}`}>{social}로 로그인</div>
		</button>
	);
}
