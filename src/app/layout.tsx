import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/layouts/root-layout/navbar';
import Footer from '@/components/layouts/root-layout/footer';

export const metadata: Metadata = {
	title: '킥온',
	description: '',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={`antialiased`}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
