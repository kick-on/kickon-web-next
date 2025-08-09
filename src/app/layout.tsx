import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import Footer from '@/components/layouts/root/footer';
import Banner from '@/components/layouts/root/banner';
import MinWidth from '@/components/layouts/root/min-width';
import LoginPortal from '@/components/layouts/root/navbar/login-portal';
import MarginWrapper from '@/components/layouts/root/margin-wrapper';
import Navbar from '@/components/layouts/root/navbar';
import PaddingWrapper from '@/components/layouts/root/padding-wrapper';

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
				<div className="@container">
					<Navbar />
					<LoginPortal />
					<MarginWrapper>
						<Banner />
						<PaddingWrapper>{children}</PaddingWrapper>
						<Footer />
						<MinWidth />
					</MarginWrapper>
				</div>
			</body>
		</html>
	);
}
