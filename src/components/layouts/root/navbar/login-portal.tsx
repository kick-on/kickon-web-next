'use client';

import LoginModal from '@/components/common/login-modal/login-modal';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';
import { useRouter } from 'next/navigation';

export default function LoginPortal() {
	const previousPage = typeof window !== 'undefined' ? sessionStorage.getItem('previousPage') : null;
	const router = useRouter();

	const { isLoginModalOpen, closeLoginModal } = useIsLoginModalOpenStore();

	const handleLoginModalClose = () => {
		closeLoginModal();
		if (previousPage === '/') {
			router.replace(previousPage);
		}
	};

	return isLoginModalOpen ? <LoginModal onClose={handleLoginModalClose} /> : null;
}
