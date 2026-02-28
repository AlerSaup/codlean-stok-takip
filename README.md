# 📦 Codlean Stok Takip Sistemi

Modern ve kullanici dostu bir **Stok & Depo Yonetim Sistemi**. React, TypeScript ve Tailwind CSS ile gelistirilmistir. Depo olusturma, stok giris/cikis islemleri, seri numarasi takibi ve hareket loglari gibi kapsamli ozellikler sunar.

---

![gorsel](https://i.imgur.com/a1tTdSU.png)
![gorsel](https://i.imgur.com/XTgHj4H.png)
![gorsel1](https://i.imgur.com/E5HTs5Z.png)
![gorsel2](https://i.imgur.com/6pocrTR.png)
![gorsel3](https://i.imgur.com/prz85rl.png)
![gorsel4](https://i.imgur.com/3RPIN0L.png)
![gorsel5](https://i.imgur.com/NwcR2OS.png)
![gorsel6](https://i.imgur.com/wPQnLue.png)
![gorsel7](https://i.imgur.com/rhqTxZk.png)

## 🚀 Ozellikler

### 🔐 Kimlik Dogrulama
- Kullanici girisi (Login) ekrani
- Oturum durumu `localStorage` ile kalici olarak saklanir
- Korumali rotalar (Protected Routes) — giris yapmadan sayfalara erisim engellenir

### 🏭 Depo Yonetimi
- Yeni depo olusturma (Uretim / Yukleme turleri)
- Depo bilgilerini duzenleme (ad, tur, durum)
- Depo durumu yonetimi (Aktif / Pasif)
- Depo detay sayfasina yonlendirme


### 📥 Stok Girisi
- Tedarikci secimi ile stok girisi
- Birden fazla malzeme kalemi ekleme
- **Seri Takip** ve **Normal** takip turu destegi
- Seri numarasi takipli urunler icin her birime ayri seri no girisi
- Alis birim fiyati ve toplam tutar hesaplama
- Ayni malzeme varsa miktari otomatik guncelleme


### 📤 Stok Cikisi
- Musteri secimi ile stok cikisi
- Depodaki mevcut stoklardan secim
- Miktar belirleyerek kismi cikis yapabilme
- Stok miktari sifira dusunce otomatik silme

### 📋 Stok Listesi
- Tum depolardaki stoklarin merkezi gorunumu
- Depo adi, malzeme, marka, model, miktar, birim, seri no ve takip turu bilgileri
- Seri Takip / Normal takip turu gorsel ayirimi

### 📊 Stok Hareketleri (Log)
- Tum giris/cikis hareketlerinin kronolojik kaydi
- Malzeme, marka veya model bazli arama
- Depo bazli filtreleme
- Tarih, tedarikci/musteri ve aciklama bilgileri


### 🎨 Kullanici Arayuzu
- Modern ve responsive sidebar navigasyon
- Gradient tasarim temasi (Slate/Blue renk paleti)
- Toast bildirimleri (basari/hata)
- Dialog (modal) bilesenleri
- Tab bazli sayfa organizasyonu

---

## 🛠️ Teknoloji Yigini

| Kategori | Teknoloji |
|---|---|
| **Framework** | React 19 |
| **Dil** | TypeScript |
| **Stil** | Tailwind CSS |
| **State Yonetimi** | Zustand (persist middleware) |
| **Routing** | React Router DOM v7 |
| **Form Yonetimi** | React Hook Form + Zod |
| **UI Bilesenleri** | Radix UI (Dialog, Label, Toast, Slot) |
| **Ikonlar** | Flaticon UIcons + Lucide React |
| **Yardimcilar** | clsx, tailwind-merge, class-variance-authority |

---

## 📁 Proje Yapisi

```
src/
├── components/
│   ├── Layout.tsx              # Sidebar + ana duzen
│   ├── ProtectedRoute.tsx      # Kimlik dogrulama korumasi
│   ├── StokGirisi.tsx          # Stok giris formu ve islemleri
│   ├── StokCikisi.tsx          # Stok cikis formu ve islemleri
│   ├── StokHareketleri.tsx     # Hareket loglari ve filtreleme
│   └── ui/                     # Yeniden kullanilabilir UI bilesenleri
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── table.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── data/
│   └── staticData.ts           # Sabit malzeme, tedarikci ve musteri listeleri
├── hooks/
│   └── use-toast.ts            # Toast hook
├── lib/
│   ├── toast-helpers.ts        # Basari/Hata toast fonksiyonlari
│   └── utils.ts                # Yardimci fonksiyonlar (cn)
├── pages/
│   ├── Login.tsx               # Giris sayfasi
│   ├── DepoYonetimi.tsx        # Depo listesi ve yeni depo ekleme
│   ├── DepoDetay.tsx           # Depo detay, stok giris/cikis sekmeli sayfa
│   └── StokListesi.tsx         # Tum stoklar ve hareket loglari
├── store/
│   ├── authStore.ts            # Kimlik dogrulama state (Zustand)
│   ├── stockStore.ts           # Stok ve hareket state (Zustand)
│   └── warehouseStore.ts       # Depo state (Zustand)
├── App.tsx                     # Uygulama rotalari
└── index.tsx                   # Giris noktasi
```

---

## ⚡ Kurulum ve Calistirma

### Gereksinimler

- **Node.js** (v16 veya uzeri)
- **npm** veya **yarn**

### Adimlar

```bash
# 1. Projeyi klonlayin
git clone https://github.com/kullanici/codlean-stok-takip.git
cd codlean-stok-takip

# 2. Bagimliliklari yukleyin
npm install

# 3. Gelistirme sunucusunu baslatin
npm start
```

Uygulama varsayilan olarak [http://localhost:3000](http://localhost:3000) adresinde calisir.

### Diger Komutlar

```bash
# Production build olustur
npm run build

# Testleri calistir
npm test
```

---

## 🔑 Varsayilan Giris Bilgileri

| Alan | Deger |
|---|---|
| **Kullanici Adi** | `admin` |
| **Sifre** | `12345` |

---

## 📐 Uygulama Akisi

```
Giris Sayfasi (Login)
    │
    ▼
Depo Yonetimi ──────────────────── Stok Listesi
    │                                   │
    ▼                                   ▼
Depo Detay                        Tum Stoklar (Tablo)
    │                                   │
    ├── Stoklar (sekmesi)               └── Stok Hareketleri (sekmesi)
    ├── Stok Girisi (sekmesi)                ├── Arama Filtresi
    └── Stok Cikisi (sekmesi)               └── Depo Filtresi
```

---

## 📦 Sabit Veriler

Uygulama asagidaki sabit veri setleri ile calisir:

**Malzemeler:**
| Malzeme | Marka | Model | Birim | Takip Turu |
|---|---|---|---|---|
| Laptop | Dell | XPS 15 | Adet | Seri Takip |
| Monitor | Samsung | 27" 4K | Adet | Seri Takip |
| Klavye | Logitech | K120 | Adet | Normal |
| Mouse | Logitech | M185 | Adet | Normal |
| Kablo | Generic | Cat6 | Metre | Normal |

**Tedarikciler:** ABC Teknoloji, XYZ Elektronik, Sistem Bilisim, Global Tedarik

**Musteriler:** A Sirketi, B Holding, C Organizasyon, D Kurumsal

---

## 💾 Veri Saklama

Uygulama verileri **localStorage** uzerinde kalici olarak saklar (Zustand persist middleware):

| Store | localStorage Key | Aciklama |
|---|---|---|
| `authStore` | `auth-storage` | Oturum durumu ve kullanici adi |
| `stockStore` | `stock-storage` | Stok kalemleri ve hareket loglari |
| `warehouseStore` | `warehouse-storage` | Depo bilgileri |

> **Not:** Veritabani kullanilmamaktadir. Tum veriler tarayicinin localStorage'inda tutulur. Tarayici verilerini temizlemek tum verileri siler.
