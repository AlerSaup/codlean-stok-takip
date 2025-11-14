import React, { useState } from 'react';
import { useStockStore } from '../store/stockStore';
import { useWarehouseStore } from '../store/warehouseStore';
import StokHareketleri from '../components/StokHareketleri';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card } from '../components/ui/card';

const StokListesi: React.FC = () => {
  const stocks = useStockStore((state) => state.stocks);
  const warehouses = useWarehouseStore((state) => state.warehouses);

  const [activeTab, setActiveTab] = useState<'stoklar' | 'hareketler'>('stoklar');

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? warehouse.depoAdi : 'Bilinmiyor';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <i className="fi fi-rr-boxes text-blue-600"></i>
          Stok Yönetimi
        </h1>
        <p className="text-slate-500 mt-1">Tüm stoklarınızı ve hareketleri görüntüleyin</p>
      </div>

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
              Stok Listesi
            </button>
            <button
              onClick={() => setActiveTab('hareketler')}
              className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'hareketler'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fi fi-rr-time-past"></i>
              Stok Hareketleri
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          {activeTab === 'stoklar' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Depo</TableHead>
                  <TableHead>Malzeme Adı</TableHead>
                  <TableHead>Marka</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Birim</TableHead>
                  <TableHead>Seri No</TableHead>
                  <TableHead>Takip Türü</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <i className="fi fi-rr-box-open text-5xl text-slate-300"></i>
                        <p>Sistemde henüz stok bulunmuyor</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <i className="fi fi-rr-warehouse text-slate-400"></i>
                          <span className="font-medium">{getWarehouseName(stock.warehouseId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{stock.malzemeAdi}</TableCell>
                      <TableCell>{stock.marka}</TableCell>
                      <TableCell>{stock.model}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{stock.miktar}</span>
                      </TableCell>
                      <TableCell>{stock.birim}</TableCell>
                      <TableCell>
                        <span className="text-slate-500">{stock.seriNo || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            stock.takipTuru === 'Seri Takip'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <i className={`fi ${
                            stock.takipTuru === 'Seri Takip' ? 'fi-rr-barcode-read' : 'fi-rr-list'
                          } text-xs`}></i>
                          {stock.takipTuru}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === 'hareketler' && <StokHareketleri />}
        </div>
      </Card>
    </div>
  );
};

export default StokListesi;
