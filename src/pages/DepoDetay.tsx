import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWarehouseStore } from '../store/warehouseStore';
import { useStockStore } from '../store/stockStore';
import StokGirisi from '../components/StokGirisi';
import StokCikisi from '../components/StokCikisi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const DepoDetay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const warehouses = useWarehouseStore((state) => state.warehouses);
  const warehouse = warehouses.find((w) => w.id === id);
  const updateWarehouse = useWarehouseStore((state) => state.updateWarehouse);
  
  const allStocks = useStockStore((state) => state.stocks);
  const stocks = allStocks.filter((s) => s.warehouseId === id);

  const [activeTab, setActiveTab] = useState<'stoklar' | 'giris' | 'cikis'>('stoklar');

  if (!warehouse) {
    return (
      <div className="p-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <i className="fi fi-rr-exclamation text-5xl text-red-500"></i>
              <div>
                <h3 className="font-semibold text-lg mb-2">Depo bulunamadı!</h3>
                <p className="text-slate-500 text-sm">Aradığınız depo mevcut değil.</p>
              </div>
              <Button onClick={() => navigate('/depo-yonetimi')} variant="outline">
                <i className="fi fi-rr-arrow-left"></i>
                Depo Listesine Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleInputChange = (field: keyof typeof warehouse, value: string) => {
    updateWarehouse(id!, { [field]: value });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/depo-yonetimi')}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all"
        >
          <i className="fi fi-rr-arrow-left text-xl"></i>
        </button>
        

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <i className="fi fi-rr-warehouse-alt text-blue-600"></i>
            Depo Detayı
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Depo bilgilerini görüntüleyin ve düzenleyin</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fi fi-rr-settings"></i>
            Depo Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="depoAdi">Depo Adı</Label>
              <Input
                id="depoAdi"
                value={warehouse.depoAdi}
                onChange={(e) => handleInputChange('depoAdi', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depoTuru">Depo Türü</Label>
              <select
                id="depoTuru"
                value={warehouse.depoTuru}
                onChange={(e) => handleInputChange('depoTuru', e.target.value)}
                className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="Üretim">Üretim</option>
                <option value="Yükleme">Yükleme</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="durum">Durum</Label>
              <select
                id="durum"
                value={warehouse.durum}
                onChange={(e) => handleInputChange('durum', e.target.value)}
                className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('stoklar')}
              className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'stoklar'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fi fi-rr-box"></i>
              Stoklar
            </button>
            <button
              onClick={() => setActiveTab('giris')}
              className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'giris'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fi fi-rr-arrow-down-to-bracket"></i>
              Stok Girişi
            </button>
            <button
              onClick={() => setActiveTab('cikis')}
              className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'cikis'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fi fi-rr-arrow-up-from-bracket"></i>
              Stok Çıkışı
            </button>
          </div>
        </div>

        <div className="p-6">

          {activeTab === 'stoklar' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fi fi-rr-boxes"></i>
                Depo Stokları
              </h3>

              {stocks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <i className="fi fi-rr-box-open text-5xl text-slate-300"></i>
                    <p>Bu depoda henüz stok bulunmuyor</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Malzeme Adı</TableHead>
                      <TableHead>Marka</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Miktar</TableHead>
                      <TableHead>Birim</TableHead>
                      <TableHead>Seri No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{stock.malzemeAdi}</TableCell>
                        <TableCell>{stock.marka}</TableCell>
                        <TableCell>{stock.model}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-blue-600">{stock.miktar}</span>
                        </TableCell>
                        <TableCell>{stock.birim}</TableCell>
                        <TableCell>
                          <span className="text-slate-500">{stock.seriNo || '-'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
          {activeTab === 'giris' && <StokGirisi warehouseId={id!} />}
          
          {activeTab === 'cikis' && <StokCikisi warehouseId={id!} />}
        </div>
      </Card>
    </div>
  );
};

export default DepoDetay;