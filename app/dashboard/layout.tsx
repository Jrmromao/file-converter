import SessionProviderWrapper from '../components/SessionProviderWrapper';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <DashboardSidebar>{children}</DashboardSidebar>
    </SessionProviderWrapper>
  );
} 