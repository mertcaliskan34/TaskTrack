# TaskTrack - Öğrenci Görev Takip Sistemi Roadmap

Bu roadmap, TaskTrack projesinin geliştirme sürecinde izlenecek adımları, aşamaları ve kilometre taşlarını detaylandırmaktadır. Proje, üniversite öğrencilerinin ödev, sınav ve günlük görevlerini kolayca yönetebilmeleri için tasarlanmıştır.

## İçindekiler
- [1. Planlama ve Gereksinimler](#1-planlama-ve-gereksinimler)
- [2. Teknik Yığın ve Ortam Kurulumu](#2-teknik-yığın-ve-ortam-kurulumu)
- [3. Backend Geliştirme](#3-backend-geliştirme)
  - [3.1 Proje Yapısı ve Temel Kurulum](#31-proje-yapısı-ve-temel-kurulum)
  - [3.2 Veritabanı Tasarımı (MySQL)](#32-veritabanı-tasarımı-mysql)
  - [3.3 API Tasarımı (Express.js & Node.js)](#33-api-tasarımı-expressjs--nodejs)
- [4. Frontend Geliştirme (React.js)](#4-frontend-geliştirme-reactjs)
  - [4.1 Proje Yapısı ve Temel Kurulum](#41-proje-yapısı-ve-temel-kurulum-1)
  - [4.2 Sayfa ve Bileşen Tasarımı](#42-sayfa-ve-bileşen-tasarımı)
  - [4.3 Durum Yönetimi ve API Entegrasyonu](#43-durum-yönetimi-ve-api-entegrasyonu)
- [5. Entegrasyon ve Test Süreci](#5-entegrasyon-ve-test-süreci)
- [6. Dağıtım ve DevOps Süreci](#6-dağıtım-ve-devops-süreci)
- [7. Gelecek Geliştirmeler](#7-gelecek-geliştirmeler)
- [8. Ek Araçlar ve İpuçları](#8-ek-araclar-ve-ipuçları)

---

## 1. Planlama ve Gereksinimler

- **Proje Tanımı:** Üniversite öğrencilerinin ödev, sınav ve günlük görevlerini takip edebilecekleri, takvim görünümü ve bildirim özelliklerine sahip web uygulaması.
- **Hedef Kullanıcı:** Üniversite öğrencileri, ileride akademisyenler için genişletilebilir.
- **Temel Özellikler:**
  - Görev ekleme, düzenleme ve tamamlama.
  - Takvim üzerinde görevlerin görselleştirilmesi.
  - Hatırlatıcı bildirimler.
  - Kullanıcı dostu arayüz.
  - (Gelecek) Akademisyen modülü.
- **Başarı Ölçütleri:** Kullanıcı dostu arayüz, hızlı API cevapları, ölçeklenebilir veri yapısı.

---

## 2. Teknik Yığın ve Ortam Kurulumu

- **Backend:**
  - Node.js (LTS sürümü)
  - Express.js
  - MySQL (veritabanı)
- **Frontend:**
  - React.js (Create React App veya Next.js gibi yapılandırılmış bir framework)
  - CSS/SCSS veya UI kütüphanesi (örn. Material UI, Ant Design)
- **Diğer Araçlar:**
  - Git (versiyon kontrolü)
  - Docker (konteynerleştirme)
  - Postman veya Insomnia (API test araçları)
- **Kurulum Adımları:**
  - Gerekli yazılımların (Node.js, MySQL) kurulması.
  - Proje repository'sinin oluşturulması ve temel yapılandırmanın yapılması.
  - Ortam dosyalarının (örn. .env) oluşturulması.

---

## 3. Backend Geliştirme

### 3.1 Proje Yapısı ve Temel Kurulum
- Proje dizin yapısının oluşturulması:
  - `/src`
    - `/controllers`
    - `/models`
    - `/routes`
    - `/middlewares`
    - `/config`
    - `app.js` veya `server.js`
- Gerekli paketlerin kurulması:
  - `express`, `mysql2` veya `sequelize` (ORM kullanımı isteğe bağlı), `cors`, `dotenv`, `body-parser`

### 3.2 Veritabanı Tasarımı (MySQL)
- **Temel Tablolar:**
  - `users`: Kullanıcı bilgileri (id, isim, email, şifre, rol)
  - `tasks`: Görev bilgileri (id, kullanıcı_id, başlık, açıklama, başlangıç tarihi, bitiş tarihi, durum, oluşturulma tarihi)
  - `notifications`: Hatırlatıcı bildirimler (id, kullanıcı_id, görev_id, bildirim zamanı, durum)
- **İlişkiler ve Indexler:**
  - Kullanıcı-görev ilişkisi (1-N)
  - Gerekli indexlerin ve foreign key kısıtlamalarının oluşturulması.
- **SQL Sorguları ve Migration Dosyaları:**
  - Migration araçları kullanılarak veritabanı şemasının yönetimi.

### 3.3 API Tasarımı (Express.js & Node.js)
- **API Endpoint’leri:**
  - **Kullanıcı Yönetimi:** `/api/users`
    - Kayıt olma, giriş yapma, kullanıcı bilgilerini güncelleme.
  - **Görev Yönetimi:** `/api/tasks`
    - Görev ekleme, düzenleme, silme, listeleme.
  - **Bildirimler:** `/api/notifications`
    - Hatırlatıcı ayarlama ve bildirim durumu güncelleme.
- **Orta Katmanlar (Middlewares):**
  - Authentication (JWT veya session tabanlı)
  - Hata yönetimi
  - Loglama
- **Test Süreci:**
  - Postman/Insomnia ile endpoint testlerinin yapılması.
  - Unit test ve integration testler için Jest veya Mocha kullanılabilir.

---

## 4. Frontend Geliştirme (React.js)

### 4.1 Proje Yapısı ve Temel Kurulum
- **React Projesi Oluşturma:**
  - Create React App veya Next.js kullanarak proje kurulumu.
- **Gerekli Paketler:**
  - `axios` veya `fetch` ile API entegrasyonu.
  - React Router (sayfa geçişleri için)
  - UI kütüphanesi (örn. Material UI, Bootstrap)
  - Durum yönetimi için Context API veya Redux.

### 4.2 Sayfa ve Bileşen Tasarımı
- **Ana Sayfalar:**
  - **Dashboard:** Kullanıcının genel görev durumu, yaklaşan görevler ve bildirimler.
  - **Görev Listesi:** Görevlerin listelendiği, filtreleme ve sıralama seçenekleri.
  - **Takvim Görünümü:** Görevlerin takvim üzerinde gösterimi.
  - **Profil ve Ayarlar:** Kullanıcı bilgilerini güncelleme, bildirim tercihleri.
- **Bileşenler:**
  - Görev Kartı
  - Modal ve Form Bileşenleri
  - Bildirim Paneli

### 4.3 Durum Yönetimi ve API Entegrasyonu
- **API İstekleri:**
  - Axios kullanılarak backend API entegrasyonu.
  - API hata yönetimi ve yeniden deneme mekanizmaları.
- **Durum Yönetimi:**
  - Global state yönetimi için Context API/Redux yapısının kurulması.
  - React Hooks (useState, useEffect) ile bileşen yaşam döngüsünün yönetilmesi.
- **Kullanıcı Deneyimi:**
  - Responsive tasarım
  - Animasyonlar ve kullanıcı geri bildirimleri (örn. yükleniyor spinnerları)

---

## 5. Entegrasyon ve Test Süreci

- **API Entegrasyonu:**
  - Frontend ve backend entegrasyon testlerinin yapılması.
  - CORS ayarlarının kontrol edilmesi.
- **Test Planı:**
  - Unit testler: Jest, React Testing Library, Mocha.
  - Entegrasyon testleri: API endpoint testleri ve UI etkileşimleri.
- **Sürekli Entegrasyon (CI):**
  - GitHub Actions, Travis CI veya Jenkins ile otomatik test süreçlerinin oluşturulması.

---

## 6. Dağıtım ve DevOps Süreci

- **Docker Konteynerleştirme:**
  - Backend ve frontend için ayrı Dockerfile’lar oluşturulması.
  - Docker Compose ile tüm servislerin (MySQL, API, Frontend) birlikte çalıştırılması.
- **Sunucu Dağıtımı:**
  - Bulut servis sağlayıcıları (AWS, DigitalOcean, Heroku) üzerinde dağıtım.
  - SSL sertifikaları ve güvenlik önlemleri.
- **Monitoring ve Logging:**
  - Uygulama performansını izlemek için araçların (örn. PM2, Logstash) entegre edilmesi.

---

## 7. Gelecek Geliştirmeler

- **Akademisyen Modülü:**
  - Akademisyenlerin ödev ve duyuru paylaşımı.
  - Ek yetkilendirme ve farklı kullanıcı rolleri.
- **Mobil Uygulama Desteği:**
  - PWA (Progressive Web App) veya native mobil uygulama geliştirme.
- **Ek Özellikler:**
  - İleri seviye raporlama, veri analizi ve öğrenme materyalleri entegrasyonu.

---

## 8. Ek Araçlar ve İpuçları

- **Kod Kalitesi:**
  - ESLint, Prettier gibi araçlarla kod standardizasyonu sağlanması.
- **Versiyon Kontrolü:**
  - Git branching stratejileri (Git Flow veya feature branching) kullanılması.
- **Dokümantasyon:**
  - API dokümantasyonu için Swagger veya Postman Collection kullanımı.
  - Kullanıcı kılavuzu ve geliştirici dökümantasyonlarının hazırlanması.
- **Topluluk ve Destek:**
  - Geliştirici forumları, Stack Overflow gibi kaynaklardan destek alınması.
  - Açık kaynak kodlu projelerde geri bildirim ve katkı sağlanması.

---

Bu roadmap, proje geliştirme sürecinde rehber olarak kullanılabilir ve ihtiyaçlara göre detaylandırılarak güncellenebilir. Her aşamada, düzenli kod gözden geçirmeleri ve testler yaparak kalitenin korunması sağlanmalıdır.
