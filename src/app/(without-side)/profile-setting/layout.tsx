import RedirectWrapper from '@/components/common/redirect-wrapper';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: React.ReactNode }) {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refreshToken');

	const shouldRedirect = !refreshToken;

	return <RedirectWrapper shouldRedirect={shouldRedirect}>{children}</RedirectWrapper>;
}
