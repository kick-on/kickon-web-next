'use client';

import LoginModal from '@/components/common/login-modal/login-modal';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';
import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function LoginPortal() {
	const previousPage = typeof window !== 'undefined' ? sessionStorage.getItem('previousPage') : null;
	const router = useRouter();
	// const isLoginInQuery = useSearchParams().get('login') === 'true';

	const { isLoginModalOpen, closeLoginModal } = useIsLoginModalOpenStore();

	const handleLoginModalClose = () => {
		closeLoginModal();
		if (previousPage === '/') {
			router.replace(previousPage);
		}
	};

	// useEffect(() => {
	// 	if (isLoginInQuery) {
	// 		openLoginModal();
	// 	}
	// }, [isLoginInQuery, openLoginModal]);

	return isLoginModalOpen ? <LoginModal onClose={handleLoginModalClose} /> : null;
}
