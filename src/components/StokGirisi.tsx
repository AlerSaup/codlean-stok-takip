import React, { useState } from 'react';
import { useStockStore } from '../store/stockStore';
import { MALZEMELER, TEDARIKCILER } from '../data/staticData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { showSuccessToast, showErrorToast } from '../lib/toast-helpers';

interface StokGirisiProps {
  warehouseId: string;
}

interface StockItem {
  malzemeId: string;
  malzemeAdi: string;
  marka: string;
  model: string;
  miktar: number;
  birim: string;
  alisBirimFiyati: number;
  takipTuru: 'Seri Takip' | 'Normal';
  seriNolari: string[];  
}

const StokGirisi: React.FC<StokGirisiProps> = ({ warehouseId }) => {
  const addStock = useStockStore((state) => state.addStock);
  const addMovement = useStockStore((state) => state.addMovement);
  const updateStock = useStockStore((state) => state.updateStock);
  const allStocks = useStockStore((state) => state.stocks);

  const [tedarikci, setTedarikci] = useState('');
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);
  const [aciklama, setAciklama] = useState('');
  const [stockItems, setStockItems] = useState<StockItem[]>([]);  
  
  const [showSeriNoModal, setShowSeriNoModal] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    setStockItems([
      ...stockItems,
      {
        malzemeId: '',
        malzemeAdi: '',
        marka: '',
        model: '',
        miktar: 1,
        birim: '',
        alisBirimFiyati: 0,
        takipTuru: 'Normal',
        seriNolari: [],
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setStockItems(stockItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof StockItem, value: any) => {
    const newItems = [...stockItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setStockItems(newItems);
  };

  const handleMalzemeSelect = (index: number, malzemeId: string) => {
    const malzeme = MALZEMELER.find((m) => m.id === malzemeId);
    if (malzeme) {
      const newItems = [...stockItems];
      newItems[index] = {
        ...newItems[index],
        malzemeId: malzemeId,
        malzemeAdi: malzeme.ad,
        marka: malzeme.marka,
        model: malzeme.model,
        birim: malzeme.birim,
        takipTuru: malzeme.takipTuru,
      };
      setStockItems(newItems);
    }
  };

  const handleOpenSeriNoModal = (index: number) => {
    setCurrentItemIndex(index);
    setShowSeriNoModal(true);
  };

  const handleSaveSeriNolar = (seriNolar: string[]) => {
    if (currentItemIndex !== null) {
      handleItemChange(currentItemIndex, 'seriNolari', seriNolar);
    }
    setShowSeriNoModal(false);
    setCurrentItemIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    if (!tedarikci || stockItems.length === 0) {
      showErrorToast('Eksik Bilgi', 'Lütfen tedarikçi seçin ve en az bir stok kalemi ekleyin!');
      return;
    }

    for (const item of stockItems) {
      if (item.takipTuru === 'Seri Takip' && item.seriNolari.length !== item.miktar) {
        showErrorToast('Seri Numarası Eksik', `${item.malzemeAdi} için ${item.miktar} adet seri numarası girmelisiniz!`);
        return;
      }
    }

    stockItems.forEach((item) => {
      if (item.takipTuru === 'Seri Takip') {

        item.seriNolari.forEach((seriNo) => {
          addStock({
            id: Date.now().toString() + Math.random().toString().substring(2, 8),
            warehouseId,
            malzemeAdi: item.malzemeAdi,
            marka: item.marka,
            model: item.model,
            miktar: 1,  
            birim: item.birim,
            seriNo,
            takipTuru: 'Seri Takip',
          });
        });
      } else {
        const existingStock = allStocks.find(
          (s) =>
            s.warehouseId === warehouseId &&
            s.malzemeAdi === item.malzemeAdi &&
            s.marka === item.marka &&
            s.model === item.model &&
            s.takipTuru === 'Normal' &&
            !s.seriNo
        );

        if (existingStock) {
          updateStock(existingStock.id, {
            miktar: existingStock.miktar + item.miktar,
          });
        } else {
          addStock({
            id: Date.now().toString() + Math.random().toString().substring(2, 8),
            warehouseId,
            malzemeAdi: item.malzemeAdi,
            marka: item.marka,
            model: item.model,
            miktar: item.miktar,
            birim: item.birim,
            takipTuru: 'Normal',
          });
        }
      }
    });

    addMovement({
      id: Date.now().toString(),
      warehouseId,
      type: 'Giriş',
      date: tarih,
      tedarikci,
      aciklama,
      items: stockItems.map((item) => ({
        malzemeAdi: item.malzemeAdi,
        marka: item.marka,
        model: item.model,
        miktar: item.takipTuru === 'Seri Takip' ? item.seriNolari.length : item.miktar,
        birim: item.birim,
        alisBirimFiyati: item.alisBirimFiyati,
        toplamTutar: item.alisBirimFiyati * (item.takipTuru === 'Seri Takip' ? item.seriNolari.length : item.miktar),
        seriNolari: item.takipTuru === 'Seri Takip' ? item.seriNolari : undefined,
      })),
    });

    setTedarikci('');
    setTarih(new Date().toISOString().split('T')[0]);
    setAciklama('');
    setStockItems([]);
    showSuccessToast('Başarılı!', 'Stok girişi başarıyla kaydedildi!');
  };

  const handleCopyItem = (index: number) => {
    const itemToCopy = { ...stockItems[index] };
    setStockItems([...stockItems, itemToCopy]);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <i className="fi fi-rr-arrow-down-to-bracket text-emerald-600"></i>
        Stok Girişi
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tedarikci">Tedarikçi *</Label>
            <select
              id="tedarikci"
              required
              value={tedarikci}
              onChange={(e) => setTedarikci(e.target.value)}
              className="flex h-11 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">Seçiniz</option>
              {TEDARIKCILER.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tarih">Stok Giriş Tarihi *</Label>
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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <i className="fi fi-rr-list"></i>
              Stok Kalemleri
            </h4>
            <Button type="button" onClick={handleAddItem} variant="success" size="sm">
              <i className="fi fi-rr-plus"></i>
              Kalem Ekle
            </Button>
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Malzeme/Hizmet Adı</TableHead>
                  <TableHead>Marka</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Birim</TableHead>
                  <TableHead>Alış Birim Fiyatı</TableHead>
                  <TableHead>Toplam Tutar</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <i className="fi fi-rr-box-open text-4xl text-slate-300"></i>
                        <p>Henüz kalem eklenmedi</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  stockItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <select
                          required
                          value={item.malzemeId}
                          onChange={(e) => handleMalzemeSelect(index, e.target.value)}
                          className="w-full px-2 py-1.5 border-2 border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                          <option value="">Seçiniz</option>
                          {MALZEMELER.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.ad}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          readOnly
                          value={item.marka}
                          className="w-full px-2 py-1.5 bg-slate-50 rounded text-sm border border-slate-200"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          readOnly
                          value={item.model}
                          className="w-full px-2 py-1.5 bg-slate-50 rounded text-sm border border-slate-200"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.miktar}
                            onChange={(e) => handleItemChange(index, 'miktar', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1.5 border-2 border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                          />
                          {item.takipTuru === 'Seri Takip' && (
                            <Button
                              type="button"
                              onClick={() => handleOpenSeriNoModal(index)}
                              variant="outline"
                              size="sm"
                            >
                              <i className="fi fi-rr-barcode-read"></i>
                              {item.seriNolari.length}/{item.miktar}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          readOnly
                          value={item.birim}
                          className="w-full px-2 py-1.5 bg-slate-50 rounded text-sm border border-slate-200"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.alisBirimFiyati}
                          onChange={(e) => handleItemChange(index, 'alisBirimFiyati', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 border-2 border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-emerald-600">
                          {(item.alisBirimFiyati * item.miktar).toFixed(2)} ₺
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            type="button"
                            onClick={() => handleCopyItem(index)}
                            variant="ghost"
                            size="sm"
                          >
                            <i className="fi fi-rr-copy"></i>
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <i className="fi fi-rr-trash"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button type="submit" size="lg">
          <i className="fi fi-rr-check"></i>
          Stok Girişi Yap
        </Button>
      </form>

      <Dialog open={showSeriNoModal} onOpenChange={setShowSeriNoModal}>
        {currentItemIndex !== null && (
          <SeriNoModal
            miktar={stockItems[currentItemIndex].miktar}
            existingSeriNolar={stockItems[currentItemIndex].seriNolari}
            onSave={handleSaveSeriNolar}
            onClose={() => setShowSeriNoModal(false)}
          />
        )}
      </Dialog>
    </div>
  );
};


const SeriNoModal: React.FC<{
  miktar: number;
  existingSeriNolar: string[];
  onSave: (seriNolar: string[]) => void;
  onClose: () => void;
}> = ({ miktar, existingSeriNolar, onSave, onClose }) => {

  const [seriNolar, setSeriNolar] = useState<string[]>(
    existingSeriNolar.length > 0 ? existingSeriNolar : Array(miktar).fill('')
  );

  const handleSubmit = () => {
    if (seriNolar.some((s) => !s.trim())) {
      showErrorToast('Eksik Bilgi', 'Lütfen tüm seri numaralarını girin!');
      return;
    }
    onSave(seriNolar);
  };

  return (
    <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <i className="fi fi-rr-barcode-read text-blue-600"></i>
          Seri Numarası Girişi
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-slate-600 mb-4">
          <i className="fi fi-rr-info mr-1"></i>
          {miktar} adet seri numarası giriniz:
        </p>
        <div className="space-y-3">
          {Array.from({ length: miktar }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Label htmlFor={`seri-${index}`}>Seri No {index + 1}</Label>
              <Input
                id={`seri-${index}`}
                placeholder={`Seri No ${index + 1}`}
                value={seriNolar[index] || ''}
                onChange={(e) => {
                  const newSeriNolar = [...seriNolar];
                  newSeriNolar[index] = e.target.value;
                  setSeriNolar(newSeriNolar);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="button" onClick={handleSubmit}>
          <i className="fi fi-rr-check"></i>
          Kaydet
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default StokGirisi;