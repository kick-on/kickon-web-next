import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';

export const metadata: Metadata = {
	title: '킥온',
	description: '',
};

const pretendard = localFont({
	src: '../fonts/PretendardVariable.woff2',
	display: 'swap',
	weight: '400',
	style: 'normal',
	variable: '--font-pretendard', // CSS 변수 설정
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko" className={pretendard.className}>
			<body>{children}</body>
		</html>
	);
}
