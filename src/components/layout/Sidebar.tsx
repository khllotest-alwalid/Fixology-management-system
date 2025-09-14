import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Smartphone,
  Store,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  MessageSquare,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'deviceReception', href: '/devices', icon: Smartphone },
  { name: 'shopAccounts', href: '/shops', icon: Store },
  { name: 'statistics', href: '/statistics', icon: BarChart3 },
  { name: 'reports', href: '/reports', icon: FileText },
  { name: 'periodReview', href: '/period-review', icon: Calendar },
  { name: 'notesAnalyzer', href: '/notes', icon: MessageSquare },
  { name: 'settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { signOut } = useAuth();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r bg-card", isRTL && "border-l border-r-0")}>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">Fixology</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t(item.name)}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t p-4">
        <Button
          onClick={signOut}
          variant="ghost"
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive",
            isRTL && "flex-row-reverse"
          )}
        >
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}