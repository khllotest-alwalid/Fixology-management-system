import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Store,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

export default function Dashboard() {
  const { t } = useTranslation();

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [devicesResult, paymentsResult, shopsResult] = await Promise.all([
        supabase.from('devices').select('id, status, repair_cost'),
        supabase.from('payments').select('amount'),
        supabase.from('shops').select('id')
      ]);

      const devices = devicesResult.data || [];
      const payments = paymentsResult.data || [];
      const shops = shopsResult.data || [];

      const totalDevices = devices.length;
      const repairedDevices = devices.filter(d => d.status === 'repaired').length;
      const underRepairDevices = devices.filter(d => d.status === 'under_repair').length;
      const totalRevenue = devices
        .filter(d => d.status === 'repaired')
        .reduce((sum, d) => sum + (Number(d.repair_cost) || 0), 0);
      const totalPayments = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const pendingDebts = totalRevenue - totalPayments;

      return {
        totalDevices,
        repairedDevices,
        underRepairDevices,
        totalRevenue,
        pendingDebts,
        totalShops: shops.length,
      };
    }
  });

  const quickActions = [
    {
      title: 'deviceReception',
      description: 'Add new device for repair',
      icon: Smartphone,
      href: '/devices',
      color: 'bg-blue-500'
    },
    {
      title: 'shopAccounts', 
      description: 'Manage shop accounts',
      icon: Store,
      href: '/shops',
      color: 'bg-green-500'
    },
    {
      title: 'statistics',
      description: 'View detailed statistics', 
      icon: BarChart3,
      href: '/statistics',
      color: 'bg-purple-500'
    },
    {
      title: 'reports',
      description: 'Generate reports',
      icon: FileText,
      href: '/reports', 
      color: 'bg-orange-500'
    }
  ];

  const statCards = [
    {
      title: 'totalDevicesReceived',
      value: stats?.totalDevices || 0,
      icon: Smartphone,
      color: 'text-blue-600'
    },
    {
      title: 'repairedDevices',
      value: stats?.repairedDevices || 0,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'devicesUnderRepair',
      value: stats?.underRepairDevices || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'pendingDebts',
      value: `$${stats?.pendingDebts?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-red-600'
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
            <p className="text-muted-foreground">Welcome to Fixology management system</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t(stat.title)}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <Link to={action.href}>
                    <CardHeader>
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{t(action.title)}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest devices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-4">
              Recent activity will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}