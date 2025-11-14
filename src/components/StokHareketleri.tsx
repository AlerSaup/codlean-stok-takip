import React, { useState, useMemo } from 'react';
import { useStockStore } from '../store/stockStore';
import { useWarehouseStore } from '../store/warehouseStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent } from './ui/card';

const StokHareketleri: React.FC = () => {

  const movements = useStockStore((state) => state.movements);
  const warehouses = useWarehouseStore((state) => state.warehouses);

  const [searchText, setSearchText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? warehouse.depoAdi : 'Bilinmiyor';
  };

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {

      if (selectedWarehouse && movement.warehouseId !== selectedWarehouse) {
        return false;
      }

      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const hasMatch = movement.items.some(
          (item) =>
            item.malzemeAdi.toLowerCase().includes(searchLower) ||
            item.marka.toLowerCase().includes(searchLower) ||
            item.model.toLowerCase().includes(searchLower)
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [movements, searchText, selectedWarehouse]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedWarehouse('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fi fi-rr-time-past text-blue-600"></i>
          Stok Hareketleri (Log)
        </h3>
        
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Malzeme, marka veya model ara..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
          />
          
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tüm Depolar</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.depoAdi}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Temizle
          </button>
        </div>
      </div>
      
      {movements.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <i className="fi fi-rr-time-past text-5xl text-slate-300"></i>
            <p>Henüz stok hareketi bulunmuyor</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">

          {filteredMovements.length === 0 ? (
            <div className="text-center py-8 border rounded-xl bg-slate-50">
              <p className="text-slate-500">Filtreye uygun hareket bulunamadı</p>
            </div>
          ) : (

            filteredMovements
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((movement) => (
              <Card
                key={movement.id}
                className="hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${
                          movement.type === 'Giriş'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        }`}
                      >
                        <i className={`fi ${movement.type === 'Giriş' ? 'fi-rr-arrow-down-to-bracket' : 'fi-rr-arrow-up-from-bracket'}`}></i>
                        {movement.type}
                      </span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <i className="fi fi-rr-calendar text-sm"></i>
                        <span className="text-sm font-medium">
                          {new Date(movement.date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 flex items-center gap-2 justify-end">
                        <i className="fi fi-rr-warehouse text-blue-600"></i>
                        {getWarehouseName(movement.warehouseId)}
                      </div>
                      <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 justify-end">
                        <i className="fi fi-rr-user text-xs"></i>
                        {movement.tedarikci || movement.musteri}
                      </div>
                    </div>
                  </div>

                  {movement.aciklama && (
                    <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <i className="fi fi-rr-comment-alt"></i>
                        Açıklama:
                      </span>
                      <p className="text-sm text-slate-600 mt-1">{movement.aciklama}</p>
                    </div>
                  )}

                  <div className="border rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Malzeme</TableHead>
                          <TableHead>Marka</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Miktar</TableHead>
                          <TableHead>Birim</TableHead>
                          {movement.type === 'Giriş' && (
                            <>
                              <TableHead>Birim Fiyat</TableHead>
                              <TableHead>Toplam</TableHead>
                            </>
                          )}
                          <TableHead>Seri No</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movement.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.malzemeAdi}</TableCell>
                            <TableCell>{item.marka}</TableCell>
                            <TableCell>{item.model}</TableCell>
                            <TableCell>
                              <span className="font-semibold text-blue-600">{item.miktar}</span>
                            </TableCell>
                            <TableCell>{item.birim}</TableCell>
                            {movement.type === 'Giriş' && (
                              <>
                                <TableCell>
                                  <span className="text-emerald-600 font-semibold">
                                    {item.alisBirimFiyati?.toFixed(2)} ₺
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-emerald-600 font-bold">
                                    {item.toplamTutar?.toFixed(2)} ₺
                                  </span>
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              {item.seriNolari && item.seriNolari.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {item.seriNolari.map((seri, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                      <i className="fi fi-rr-barcode-read text-xs"></i>
                                      {seri}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StokHareketleri;
