'use client';

import LoginContent from '@/components/common/login-modal/login-content';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();
	const previousPage = sessionStorage.getItem('previousPage');

	return <LoginContent onClose={() => router.replace(previousPage)} />;
}
