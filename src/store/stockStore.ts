import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Stock {
  id: string;                           
  warehouseId: string;               
  malzemeAdi: string;                
  marka: string;                      
  model: string;                   
  miktar: number;                      
  birim: string;                   
  seriNo?: string;                    
  takipTuru: 'Seri Takip' | 'Normal'; 
}

export interface StockMovement {
  id: string;                          
  warehouseId: string;          
  type: 'Giriş' | 'Çıkış';            
  date: string;                        
  tedarikci?: string;                   
  musteri?: string;                   
  aciklama: string;                   
  items: {               
    malzemeAdi: string;
    marka: string;
    model: string;
    miktar: number;
    birim: string;
    alisBirimFiyati?: number;           
    toplamTutar?: number;           
    seriNolari?: string[];            
  }[];
}

interface StockState {
  stocks: Stock[];                                          
  movements: StockMovement[];                               
  addStock: (stock: Stock) => void;                         
  updateStock: (id: string, stock: Partial<Stock>) => void; 
  removeStock: (id: string, miktar: number) => void;        
  addMovement: (movement: StockMovement) => void;           
}

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({

      stocks: [],      
      movements: [],   

      addStock: (stock) =>
        set((state) => ({
          stocks: [...state.stocks, stock],
        })),

      updateStock: (id, updatedStock) =>
        set((state) => ({
          stocks: state.stocks.map((s) =>
            s.id === id ? { ...s, ...updatedStock } : s
          ),
        })),

      removeStock: (id, miktar) =>
        set((state) => ({
          stocks: state.stocks
            .map((s) => {
              if (s.id === id) {
                const newMiktar = s.miktar - miktar;
                return newMiktar > 0 ? { ...s, miktar: newMiktar } : null;
              }
              return s;
            })
            .filter((s): s is Stock => s !== null),
        })),

      addMovement: (movement) =>
        set((state) => ({
          movements: [movement, ...state.movements],
        })),
    }),
    {
      name: 'stock-storage',
    }
  )
);
