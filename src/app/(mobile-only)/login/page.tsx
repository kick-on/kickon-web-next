'use client';

import LoginModal from '@/components/common/login-modal/login-modal';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();
	const previousPage = sessionStorage.getItem('previousPage');

	return <LoginModal onClose={() => router.replace(previousPage)} />;
}
