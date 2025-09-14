import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  contact: string;
}

interface Brand {
  id: string;
  name: string;
  device_type: 'mobile' | 'laptop';
}

export default function DeviceReception() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deviceType, setDeviceType] = useState<'mobile' | 'laptop'>('mobile');
  const [shopId, setShopId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [model, setModel] = useState('');
  const [repairDate, setRepairDate] = useState(new Date().toISOString().split('T')[0]);
  const [issueDescription, setIssueDescription] = useState('');
  const [repairCost, setRepairCost] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [status, setStatus] = useState<'under_repair' | 'repaired' | 'not_repaired'>('under_repair');
  
  const [newShopOpen, setNewShopOpen] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopContact, setNewShopContact] = useState('');

  // Fetch shops
  const { data: shops } = useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data, error } = await supabase.from('shops').select('*').order('name');
      if (error) throw error;
      return data as Shop[];
    }
  });

  // Fetch brands filtered by device type
  const { data: brands } = useQuery({
    queryKey: ['brands', deviceType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('device_type', deviceType)
        .order('name');
      if (error) throw error;
      return data as Brand[];
    }
  });

  // Add new shop mutation
  const addShopMutation = useMutation({
    mutationFn: async ({ name, contact }: { name: string; contact: string }) => {
      const { data, error } = await supabase
        .from('shops')
        .insert([{ name, contact }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      setShopId(data.id);
      setNewShopName('');
      setNewShopContact('');
      setNewShopOpen(false);
      toast({
        title: t('success'),
        description: t('shopAdded'),
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

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: any) => {
      const { data, error } = await supabase
        .from('devices')
        .insert([deviceData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Reset form
      setShopId('');
      setBrandId('');
      setModel('');
      setRepairDate(new Date().toISOString().split('T')[0]);
      setIssueDescription('');
      setRepairCost('');
      setTechnicianNotes('');
      setStatus('under_repair');
      
      toast({
        title: t('success'),
        description: t('deviceAdded'),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopId || !brandId || !model) {
      toast({
        title: t('error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    addDeviceMutation.mutate({
      shop_id: shopId,
      brand_id: brandId,
      model,
      repair_date: repairDate,
      issue_description: issueDescription,
      repair_cost: repairCost ? parseFloat(repairCost) : 0,
      technician_notes: technicianNotes,
      status,
    });
  };

  const handleAddShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName) return;
    
    addShopMutation.mutate({
      name: newShopName,
      contact: newShopContact
    });
  };

  // Reset brand selection when device type changes
  useEffect(() => {
    setBrandId('');
  }, [deviceType]);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('deviceReception')}</h1>
            <p className="text-muted-foreground">Add new device for repair</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t('deviceReception')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Device Type */}
              <div className="space-y-2">
                <Label>{t('deviceType')}</Label>
                <Select value={deviceType} onValueChange={(value: 'mobile' | 'laptop') => setDeviceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">{t('mobile')}</SelectItem>
                    <SelectItem value="laptop">{t('laptop')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shop Name */}
              <div className="space-y-2">
                <Label>{t('shopName')} *</Label>
                <div className="flex gap-2">
                  <Select value={shopId} onValueChange={setShopId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t('shopName')} />
                    </SelectTrigger>
                    <SelectContent>
                      {shops?.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={newShopOpen} onOpenChange={setNewShopOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('addNewShop')}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddShop} className="space-y-4">
                        <div className="space-y-2">
                          <Label>{t('shopName')}</Label>
                          <Input
                            value={newShopName}
                            onChange={(e) => setNewShopName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('shopContact')}</Label>
                          <Input
                            value={newShopContact}
                            onChange={(e) => setNewShopContact(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={addShopMutation.isPending}>
                          {addShopMutation.isPending ? t('loading') : t('addShop')}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Device Brand */}
              <div className="space-y-2">
                <Label>{t('deviceBrand')} *</Label>
                <Select value={brandId} onValueChange={setBrandId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('deviceBrand')} />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Name */}
              <div className="space-y-2">
                <Label>{t('modelName')} *</Label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              {/* Repair Date */}
              <div className="space-y-2">
                <Label>{t('repairDate')}</Label>
                <Input
                  type="date"
                  value={repairDate}
                  onChange={(e) => setRepairDate(e.target.value)}
                />
              </div>

              {/* Issue Description */}
              <div className="space-y-2">
                <Label>{t('issueDescription')}</Label>
                <Textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Repair Cost */}
              <div className="space-y-2">
                <Label>{t('repairCost')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={repairCost}
                  onChange={(e) => setRepairCost(e.target.value)}
                />
              </div>

              {/* Technician Notes */}
              <div className="space-y-2">
                <Label>{t('technicianNotes')}</Label>
                <Textarea
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Repair Status */}
              <div className="space-y-2">
                <Label>{t('repairStatus')}</Label>
                <Select value={status} onValueChange={(value: 'under_repair' | 'repaired' | 'not_repaired') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_repair">{t('underRepair')}</SelectItem>
                    <SelectItem value="repaired">{t('repaired')}</SelectItem>
                    <SelectItem value="not_repaired">{t('notRepaired')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={addDeviceMutation.isPending}>
                {addDeviceMutation.isPending ? t('loading') : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}