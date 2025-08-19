import MobileGate from '../../components/layouts/mobile-only/mobile-gate';

export default function MobileOnlyLayout({ children }: { children: React.ReactNode }) {
	return <MobileGate>{children}</MobileGate>;
}
