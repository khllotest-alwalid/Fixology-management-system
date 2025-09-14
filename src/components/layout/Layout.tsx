import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn("flex h-screen", isRTL && "dir-rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}