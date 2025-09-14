import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import {
  Smartphone,
  TrendingUp,
  Clock,
  XCircle,
  DollarSign,
  Users,
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Statistics() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

  // Fetch statistics data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics', selectedYear, selectedMonth],
    queryFn: async () => {
      // Get devices for selected period
      const startDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).toISOString().split('T')[0];

      const [devicesResult, paymentsResult, shopsResult, brandsResult] = await Promise.all([
        supabase
          .from('devices')
          .select('*, shops(name), brands(name)')
          .gte('repair_date', startDate)
          .lte('repair_date', endDate),
        supabase
          .from('payments')
          .select('*')
          .gte('payment_date', startDate)
          .lte('payment_date', endDate),
        supabase.from('shops').select('id, name'),
        supabase.from('brands').select('name, device_type')
      ]);

      const devices = devicesResult.data || [];
      const payments = paymentsResult.data || [];
      const shops = shopsResult.data || [];
      const brands = brandsResult.data || [];

      // Calculate basic stats
      const totalDevices = devices.length;
      const repairedDevices = devices.filter(d => d.status === 'repaired').length;
      const underRepairDevices = devices.filter(d => d.status === 'under_repair').length;
      const notRepairedDevices = devices.filter(d => d.status === 'not_repaired').length;
      
      const totalRevenue = devices
        .filter(d => d.status === 'repaired')
        .reduce((sum, d) => sum + (Number(d.repair_cost) || 0), 0);
      
      const totalPayments = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const pendingDebts = totalRevenue - totalPayments;

      // Status distribution for pie chart
      const statusData = [
        { name: t('repaired'), value: repairedDevices, color: '#00C49F' },
        { name: t('underRepair'), value: underRepairDevices, color: '#FFBB28' },
        { name: t('notRepaired'), value: notRepairedDevices, color: '#FF8042' },
      ].filter(item => item.value > 0);

      // Brand distribution
      const brandCounts: { [key: string]: number } = {};
      devices.forEach(device => {
        const brandName = device.brands?.name || 'Unknown';
        brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
      });

      const brandData = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily revenue for the selected month
      const dailyRevenue: { [key: string]: number } = {};
      devices
        .filter(d => d.status === 'repaired')
        .forEach(device => {
          const date = device.repair_date;
          dailyRevenue[date] = (dailyRevenue[date] || 0) + (Number(device.repair_cost) || 0);
        });

      const revenueData = Object.entries(dailyRevenue)
        .map(([date, revenue]) => ({
          date: new Date(date).getDate(),
          revenue
        }))
        .sort((a, b) => a.date - b.date);

      return {
        totalDevices,
        repairedDevices,
        underRepairDevices,
        notRepairedDevices,
        totalRevenue,
        totalPayments,
        pendingDebts,
        totalShops: shops.length,
        statusData,
        brandData,
        revenueData,
      };
    }
  });

  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const statCards = [
    {
      title: 'totalDevicesReceived',
      value: stats?.totalDevices || 0,
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'repairedDevices',
      value: stats?.repairedDevices || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'devicesUnderRepair',
      value: stats?.underRepairDevices || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'unrepairedDevices',
      value: stats?.notRepairedDevices || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'monthlyRevenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'pendingDebts',
      value: `$${stats?.pendingDebts?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">{t('loading')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('statistics')}</h1>
            <p className="text-muted-foreground">Comprehensive business analytics</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(2025, parseInt(month) - 1).toLocaleDateString('en', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t(stat.title)}</CardTitle>
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Device Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats?.statusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Brands */}
          <Card>
            <CardHeader>
              <CardTitle>Top Device Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.brandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue for {new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}