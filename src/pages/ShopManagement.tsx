import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Plus, DollarSign } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  contact: string;
  created_at: string;
}

interface ShopWithStats extends Shop {
  totalDebt: number;
  totalPaid: number;
}

export default function ShopManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Fetch shops with debt calculations
  const { data: shops, isLoading } = useQuery({
    queryKey: ['shops-with-stats'],
    queryFn: async () => {
      // First get all shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .order('name');
      
      if (shopsError) throw shopsError;

      // Then get debt calculations for each shop
      const shopsWithStats = await Promise.all(
        (shopsData || []).map(async (shop) => {
          // Get total repair costs for repaired devices
          const { data: devices } = await supabase
            .from('devices')
            .select('repair_cost')
            .eq('shop_id', shop.id)
            .eq('status', 'repaired');

          // Get total payments received
          const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('shop_id', shop.id);

          const totalRevenue = (devices || []).reduce((sum, device) => 
            sum + (Number(device.repair_cost) || 0), 0);
          
          const totalPaid = (payments || []).reduce((sum, payment) => 
            sum + (Number(payment.amount) || 0), 0);

          return {
            ...shop,
            totalDebt: totalRevenue - totalPaid,
            totalPaid
          };
        })
      );

      return shopsWithStats as ShopWithStats[];
    }
  });

  // Record payment mutation
  const recordPaymentMutation = useMutation({
    mutationFn: async ({ shopId, amount, notes }: { shopId: string; amount: number; notes: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          shop_id: shopId,
          amount,
          notes,
          payment_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops-with-stats'] });
      setPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentNotes('');
      setSelectedShop(null);
      
      toast({
        title: t('success'),
        description: t('paymentRecorded'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedShop || !paymentAmount) {
      toast({
        title: t('error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    recordPaymentMutation.mutate({
      shopId: selectedShop.id,
      amount: parseFloat(paymentAmount),
      notes: paymentNotes
    });
  };

  const openPaymentDialog = (shop: Shop) => {
    setSelectedShop(shop);
    setPaymentDialogOpen(true);
  };

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
            <h1 className="text-3xl font-bold">{t('shopManagement')}</h1>
            <p className="text-muted-foreground">Manage shop accounts and payments</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shops?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pendingDebts')}</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${shops?.reduce((sum, shop) => sum + Math.max(0, shop.totalDebt), 0).toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${shops?.reduce((sum, shop) => sum + shop.totalPaid, 0).toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shops Table */}
        <Card>
          <CardHeader>
            <CardTitle>Shop Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('shopName')}</TableHead>
                  <TableHead>{t('shopContact')}</TableHead>
                  <TableHead className="text-right">{t('totalDebt')}</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops?.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">{shop.name}</TableCell>
                    <TableCell>{shop.contact || '-'}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      shop.totalDebt > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${shop.totalDebt.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      ${shop.totalPaid.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openPaymentDialog(shop)}
                      >
                        {t('recordPayment')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!shops || shops.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {t('noDataFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('recordPayment')} - {selectedShop?.name}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('amount')} *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t('notes')}</Label>
                <Input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Payment notes..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={recordPaymentMutation.isPending}>
                  {recordPaymentMutation.isPending ? t('loading') : t('recordPayment')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}