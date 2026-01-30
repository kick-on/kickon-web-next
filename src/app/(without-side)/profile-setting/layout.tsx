import { Metadata } from 'next';

export const metadata: Metadata = {
	title: '프로필 설정',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}