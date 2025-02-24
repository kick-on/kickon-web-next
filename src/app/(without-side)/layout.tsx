import WhiteBox from '@/components/layouts/box-layout';

export default function WithoutSideLayout({ children }: { children: React.ReactNode }) {
	return <WhiteBox>{children}</WhiteBox>;
}
