'use client';

export default function Page() {
	// const isMobile = useIsMobile();
	// const router = useRouter();

	// useEffect(() => {
	// 	if (!isMobile) {
	// 		alert('모바일에서만 접근 가능합니다.');
	// 		router.replace('/'); // 모바일이 아닐 경우 리디렉트
	// 	}
	// }, [isMobile, router]);

	// if (!isMobile) return null; // 모바일 외에서는 접근 불가, 모바일이 아닐 때 아무것도 렌더링하지 않음

	return (
		<div>
			<header className="flex justify-center header-medium py-5">
				<span>알림</span>
			</header>
		</div>
	);
}
