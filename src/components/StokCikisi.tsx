import React, { useState } from 'react';
import { useStockStore } from '../store/stockStore';
import { MUSTERILER } from '../data/staticData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { showSuccessToast, showErrorToast } from '../lib/toast-helpers';

interface StokCikisiProps {
  warehouseId: string;
}

const StokCikisi: React.FC<StokCikisiProps> = ({ warehouseId }) => {

  const allStocks = useStockStore((state) => state.stocks);
  const stocks = allStocks.filter((s) => s.warehouseId === warehouseId && s.miktar > 0);
  const removeStock = useStockStore((state) => state.removeStock);
  const addMovement = useStockStore((state) => state.addMovement);

  const [musteri, setMusteri] = useState('');
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);
  const [aciklama, setAciklama] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<{ id: string; miktar: number }[]>([]);
  
  const [showMiktarModal, setShowMiktarModal] = useState(false);
  const [currentStock, setCurrentStock] = useState<any>(null);

  const handleStockSelect = (stock: any) => {
    if (stock.miktar > 1) {
      setCurrentStock(stock);
      setShowMiktarModal(true);
    } else {
      const existing = selectedStocks.find((s) => s.id === stock.id);
      if (existing) {
        setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id));
      } else {
        setSelectedStocks([...selectedStocks, { id: stock.id, miktar: 1 }]);
      }
    }
  };

  const handleMiktarConfirm = (miktar: number) => {
    if (currentStock) {
      const existing = selectedStocks.find((s) => s.id === currentStock.id);
      if (existing) {
        setSelectedStocks(
          selectedStocks.map((s) => (s.id === currentStock.id ? { ...s, miktar } : s))
        );
      } else {
        setSelectedStocks([...selectedStocks, { id: currentStock.id, miktar }]);
      }
    }
    setShowMiktarModal(false);
    setCurrentStock(null);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!musteri || selectedStocks.length === 0) {
      showErrorToast('Eksik Bilgi', 'Lütfen müşteri seçin ve en az bir stok seçin!');
      return;
    }
    selectedStocks.forEach((selected) => {
      const stock = stocks.find((s) => s.id === selected.id);
      if (stock) {
        removeStock(selected.id, selected.miktar);
      }
    });
    const movementItems = selectedStocks.map((selected) => {
      const stock = stocks.find((s) => s.id === selected.id);
      return {
        malzemeAdi: stock!.malzemeAdi,
        marka: stock!.marka,
        model: stock!.model,
        miktar: selected.miktar,
        birim: stock!.birim,
        seriNolari: stock!.seriNo ? [stock!.seriNo] : undefined,
      };
    });

    addMovement({
      id: Date.now().toString(),
      warehouseId,
      type: 'Çıkış',
      date: tarih,
      musteri,
      aciklama,
      items: movementItems,
    });

    setMusteri('');
    setTarih(new Date().toISOString().split('T')[0]);
    setAciklama('');
    setSelectedStocks([]);
    showSuccessToast('Başarılı!', 'Stok çıkışı başarıyla kaydedildi!');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <i className="fi fi-rr-arrow-up-from-bracket text-red-600"></i>
        Stok Çıkışı
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="musteri">Müşteri *</Label>
            <select
              id="musteri"
              required
              value={musteri}
              onChange={(e) => setMusteri(e.target.value)}
              className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">Seçiniz</option>
              {MUSTERILER.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tarih">Stok Çıkış Tarihi *</Label>
            <Input
              id="tarih"
              type="date"
              required
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aciklama">Açıklama</Label>
            <Input
              id="aciklama"
              type="text"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Açıklama"
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fi fi-rr-list-check"></i>
            Çıkışı Yapılacak Stok Listesi
          </h4>
          {stocks.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-slate-50">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <i className="fi fi-rr-box-open text-5xl text-slate-300"></i>
                <p>Bu depoda çıkış yapılabilecek stok bulunmuyor</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Seç</TableHead>
                    <TableHead>Malzeme Adı</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Birim</TableHead>
                    <TableHead>Seri No</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => {
                    const selected = selectedStocks.find((s) => s.id === stock.id);
                    return (
                      <TableRow
                        key={stock.id}
                        className={`cursor-pointer ${
                          selected ? 'bg-blue-50 hover:bg-blue-100' : ''
                        }`}
                        onClick={() => handleStockSelect(stock)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => {}}
                            className="cursor-pointer w-4 h-4 accent-blue-600"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{stock.malzemeAdi}</TableCell>
                        <TableCell>{stock.marka}</TableCell>
                        <TableCell>{stock.model}</TableCell>
                        <TableCell>
                          {selected ? (
                            <span className="font-semibold text-blue-600">
                              {selected.miktar} / {stock.miktar}
                            </span>
                          ) : (
                            <span className="font-semibold">{stock.miktar}</span>
                          )}
                        </TableCell>
                        <TableCell>{stock.birim}</TableCell>
                        <TableCell>
                          <span className="text-slate-500">{stock.seriNo || '-'}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {selectedStocks.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <i className="fi fi-rr-checkbox text-blue-600"></i>
              Seçilen Stoklar ({selectedStocks.length})
            </h4>
            <div className="space-y-2">
              {selectedStocks.map((selected) => {
                const stock = stocks.find((s) => s.id === selected.id);
                return (
                  <div key={selected.id} className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-blue-100">
                    <span className="text-sm">
                      <span className="font-medium">{stock?.malzemeAdi}</span>
                      <span className="text-slate-500"> - {stock?.marka} {stock?.model}</span>
                      <span className="ml-2 text-blue-600 font-semibold">
                        ({selected.miktar} {stock?.birim})
                      </span>
                    </span>
                    <Button
                      type="button"
                      onClick={() =>
                        setSelectedStocks(selectedStocks.filter((s) => s.id !== selected.id))
                      }
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <i className="fi fi-rr-trash"></i>
                      Kaldır
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button type="submit" size="lg" variant="destructive">
          <i className="fi fi-rr-check"></i>
          Stok Çıkışı Yap
        </Button>
      </form>

      <Dialog open={showMiktarModal} onOpenChange={setShowMiktarModal}>
        {currentStock && (
          <MiktarModal
            stock={currentStock}
            onConfirm={handleMiktarConfirm}
            onClose={() => setShowMiktarModal(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

const MiktarModal: React.FC<{
  stock: any;
  onConfirm: (miktar: number) => void;
  onClose: () => void;
}> = ({ stock, onConfirm, onClose }) => {
  const [miktar, setMiktar] = useState(1);

  const handleSubmit = () => {
    if (miktar > stock.miktar) {
      showErrorToast('Geçersiz Miktar', 'Çıkış miktarı mevcut miktardan fazla olamaz!');
      return;
    }
    if (miktar < 1) {
      showErrorToast('Geçersiz Miktar', 'Miktar en az 1 olmalıdır!');
      return;
    }
    onConfirm(miktar);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <i className="fi fi-rr-edit text-blue-600"></i>
          Çıkış Miktarı
        </DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-sm font-medium text-slate-900 mb-1">
            {stock.malzemeAdi}
          </p>
          <p className="text-sm text-slate-600">
            {stock.marka} {stock.model}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <i className="fi fi-rr-box text-slate-400"></i>
          <span className="text-slate-600">Mevcut Miktar:</span>
          <span className="font-semibold text-blue-600">{stock.miktar} {stock.birim}</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="miktar">Çıkış Miktarı</Label>
          <Input
            id="miktar"
            type="number"
            min="1"
            max={stock.miktar}
            value={miktar}
            onChange={(e) => setMiktar(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="button" onClick={handleSubmit}>
          <i className="fi fi-rr-check"></i>
          Onayla
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default StokCikisi;