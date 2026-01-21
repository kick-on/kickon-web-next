import { Metadata } from 'next';

export const metadata: Metadata = {
	title: '뉴스 작성',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
