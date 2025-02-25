import WhiteBox from '@/components/layouts/without-side/white-box';

export default function WithoutSideLayout({ children }: { children: React.ReactNode }) {
	return <WhiteBox>{children}</WhiteBox>;
}
