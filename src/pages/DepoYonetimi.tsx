import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouseStore } from '../store/warehouseStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card } from '../components/ui/card';

const DepoYonetimi: React.FC = () => {
  const navigate = useNavigate();
  const warehouses = useWarehouseStore((state) => state.warehouses);

  const [showNewWarehouseForm, setShowNewWarehouseForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <i className="fi fi-rr-warehouse-alt text-blue-600"></i>
            Depo Yönetimi
          </h1>
          <p className="text-slate-500 mt-1">Tüm depolarınızı görüntüleyin ve yönetin</p>
        </div>
        <Button onClick={() => setShowNewWarehouseForm(true)} size="lg">
          <i className="fi fi-rr-plus"></i>
          Yeni Depo Ekle
        </Button>
      </div>

      <Dialog open={showNewWarehouseForm} onOpenChange={setShowNewWarehouseForm}>
        <NewWarehouseModal onClose={() => setShowNewWarehouseForm(false)} />
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Depo Adı</TableHead>
              <TableHead>Depo Türü</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <i className="fi fi-rr-box-open text-5xl text-slate-300"></i>
                    <p>Henüz depo eklenmemiş</p>
                    <p className="text-sm">Yeni depo eklemek için yukarıdaki butona tıklayın</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <TableRow
                  key={warehouse.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/depo-detay/${warehouse.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <i className="fi fi-rr-warehouse text-blue-600"></i>
                      {warehouse.depoAdi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      <i className="fi fi-rr-tag text-xs"></i>
                      {warehouse.depoTuru}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        warehouse.durum === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <i className={`fi ${ warehouse.durum === 'Aktif' ? 'fi-rr-check-circle' : 'fi-rr-cross-circle'} text-xs`}></i>
                      {warehouse.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <i className="fi fi-rr-arrow-right"></i>
                      Detay
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const NewWarehouseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const addWarehouse = useWarehouseStore((state) => state.addWarehouse);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    depoAdi: '',
    depoTuru: 'Üretim' as 'Üretim' | 'Yükleme',
    durum: 'Aktif' as 'Aktif' | 'Pasif',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWarehouse = {
      id: Date.now().toString(),
      ...formData,
    };
    
    addWarehouse(newWarehouse);
    navigate(`/depo-detay/${newWarehouse.id}`);
    
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <i className="fi fi-rr-warehouse-alt text-blue-600"></i>
          Yeni Depo Ekle
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="depoAdi">Depo Adı *</Label>
            <Input
              id="depoAdi"
              required
              value={formData.depoAdi}
              onChange={(e) => setFormData({ ...formData, depoAdi: e.target.value })}
              placeholder="Depo adını girin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depoTuru">Depo Türü *</Label>
            <select
              id="depoTuru"
              required
              value={formData.depoTuru}
              onChange={(e) =>
                setFormData({ ...formData, depoTuru: e.target.value as 'Üretim' | 'Yükleme' })
              }
              className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="Üretim">Üretim</option>
              <option value="Yükleme">Yükleme</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="durum">Durum *</Label>
            <select
              id="durum"
              required
              value={formData.durum}
              onChange={(e) =>
                setFormData({ ...formData, durum: e.target.value as 'Aktif' | 'Pasif' })
              }
              className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="success">
            <i className="fi fi-rr-check"></i>
            Ekle
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default DepoYonetimi;
