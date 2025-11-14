import { toast } from '../hooks/use-toast';

// ============================================
// SUCCESS TOAST
// ============================================
// Başarılı işlem bildirimleri için
export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600',
  });
};

// ============================================
// ERROR TOAST
// ============================================
// Hata bildirimleri için
export const showErrorToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600',
  });
};
