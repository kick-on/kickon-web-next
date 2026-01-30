import { Metadata } from 'next';

export const metadata: Metadata = {
	title: '게시글 작성',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
