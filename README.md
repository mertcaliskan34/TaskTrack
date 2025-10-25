# TaskTrack - Öğrenci Görev Takip Sistemi

Üniversite öğrencileri için görev takibini kolaylaştıran, verimliliği artıran bir web uygulaması.

## İçindekiler

-   [Proje Hakkında](#proje-hakkında)
    -   [Özellikler](#özellikler)
    -   [Teknolojiler](#teknolojiler)

## Proje Hakkında

Üniversite öğrencileri, ödevlerini, sınav tarihlerini ve günlük görevlerini takip etmekte zorlanabiliyor. TaskTrack, bu sorunlara çözüm sunarak öğrencilerin zamanlarını daha iyi yönetmelerine ve akademik başarılarını artırmalarına yardımcı olmayı amaçlıyor.

### Özellikler

*   **Görev Yönetimi:** Ödev, sınav, proje gibi görevleri ekleme, düzenleme ve tamamlama.
*   **Takvim Görünümü:** Görevlerin takvim üzerinde görselleştirilmesi.
*   **Hatırlatıcılar:** Yaklaşan görevler için bildirimler.
*   **Kullanıcı Dostu Arayüz:** Basit ve anlaşılır tasarım.
*   **Akademisyen Modülü (Gelecek Geliştirme):** Akademisyenlerin ödev ve duyuru paylaşabilmesi.

### Teknolojiler

*   **Frontend:** React + TypeScript + Vite
*   **Backend:** Node.js + Express
*   **Veritabanı:** MongoDB
*   **Diğer Araçlar:** Git, ESLint, Prettier

## Proje Yapısı

```
TaskTrack/
├── backend/          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middlewares/
│   └── package.json
├── frontend/         # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- MongoDB (yerel veya cloud)

### Backend Kurulumu
```bash
cd backend
npm install
npm start
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

### Veritabanı Kurulumu
MongoDB bağlantısı için `backend/.env` dosyasını oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/tasktrack
JWT_SECRET=your-secret-key
PORT=3000
```

## Geliştirme

### Proje Yapısı
- `backend/` - Node.js + Express API
- `frontend/` - React + TypeScript + Vite
- Her klasör kendi `package.json` dosyasına sahip

### Geliştirme Komutları
```bash
# Backend geliştirme
cd backend
npm run dev

# Frontend geliştirme  
cd frontend
npm run dev

# Her iki servisi aynı anda çalıştırma
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

### API Endpoints
- `GET /api/tasks` - Tüm görevleri getir
- `POST /api/tasks` - Yeni görev oluştur
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## İletişim

Proje hakkında sorularınız için issue açabilir veya pull request gönderebilirsiniz.
