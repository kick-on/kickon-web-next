import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import Navbar from '@/components/layouts/root/navbar';
import Footer from '@/components/layouts/root/footer';
import Banner from '@/components/layouts/root/banner';
import MinWidth from '@/components/layouts/root/min-width';

export const metadata: Metadata = {
	title: '킥온',
	description: '',
	icons: {
		icon: '/favicon.svg',
	},
};

const pretendard = localFont({
	src: '../fonts/PretendardVariable.woff2',
	display: 'swap',
	weight: '100 900',
	style: 'normal',
	variable: '--font-pretendard', // CSS 변수 설정
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko" className={`antialiased ${pretendard.className}`}>
			<body>
				<Navbar />
				<Banner />
				<div className="pb-[9.375rem]">{children}</div>
				<Footer />
				<MinWidth />
			</body>
		</html>
	);
}
