import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Warehouse {
  id: string;                          
  depoAdi: string;                     
  depoTuru: 'Üretim' | 'Yükleme';    
  durum: 'Aktif' | 'Pasif';          
}

interface WarehouseState {
  warehouses: Warehouse[];                                  
  addWarehouse: (warehouse: Warehouse) => void;             
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;  
  deleteWarehouse: (id: string) => void;                      
}

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set) => ({

      warehouses: [], 

      addWarehouse: (warehouse) =>
        set((state) => ({
          warehouses: [...state.warehouses, warehouse],
        })),

      updateWarehouse: (id, updatedWarehouse) =>
        set((state) => ({
          warehouses: state.warehouses.map((w) =>
            w.id === id ? { ...w, ...updatedWarehouse } : w
          ),
        })),

      deleteWarehouse: (id) =>
        set((state) => ({
          warehouses: state.warehouses.filter((w) => w.id !== id),
        })),
    }),
    {
     
      name: 'warehouse-storage',
    }
  )
);
