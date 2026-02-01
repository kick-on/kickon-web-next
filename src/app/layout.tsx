import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import Footer from '@/components/layouts/root/footer';
import MinWidth from '@/components/layouts/root/min-width';
import LoginPortal from '@/components/layouts/root/navbar/login-portal';
import MarginWrapper from '@/components/layouts/root/margin-wrapper';
import Navbar from '@/components/layouts/root/navbar';
import NotificationInitializer from '@/components/layouts/root/navbar/notification-initializer';
import ReactQueryProvider from '@/lib/provider/react-query-provider';
import { DOMAIN_URL } from '@/services/config/constants';

export const metadata: Metadata = {
	metadataBase: new URL(DOMAIN_URL),
	title: {
		template: '%s | 킥온',
		default: '킥온 - 내 손안의 스타디움',
	},
	description:
		'K리그 및 유럽 5대 리그의 경기 일정과 최신 뉴스를 제공하는 통합 축구 커뮤니티. 승부 예측 게임과 함께 쾌적한 커뮤니티 환경을 즐겨보세요.',
	openGraph: {
		title: '킥온',
		description: '내 손안의 스타디움',
		url: DOMAIN_URL,
		siteName: '킥온',
		images: [
			{
				url: '/logo/opengraph.png',
				width: 1200,
				height: 630,
				alt: '',
			},
		],
		locale: 'ko_KR',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: '킥온',
		description: '내 손안의 스타디움',
		images: ['/logo/opengraph.png'],
	},
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
				<NotificationInitializer />
				<div className="@container relative">
					<ReactQueryProvider>
						<Navbar />
						<LoginPortal />
						<MarginWrapper>
							{/*<Banner />*/}
							{/*<PaddingWrapper>{children}</PaddingWrapper>*/}
							{children}
							<Footer />
							<MinWidth />
						</MarginWrapper>
					</ReactQueryProvider>
				</div>
			</body>
		</html>
	);
}
