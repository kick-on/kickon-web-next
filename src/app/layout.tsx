import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
	title: '킥온',
	description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<head>
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard/dist/web/static/pretendard.css" />
			</head>
			<body>{children}</body>
		</html>
	);
}
