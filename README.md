# 🌡️ Sıcaklık & Nem Kaydedici

Modern, bulut tabanlı sıcaklık ve nem ölçümü kayıt uygulaması. JSONBin.io kullanarak verilerinizi bulutta saklayın ve her yerden erişin!

## ✨ Özellikler

- 🌡️ **Sıcaklık ve Nem Kaydı** - Detaylı ölçüm kayıtları
- ☁️ **Bulut Depolama** - JSONBin.io ile verileri bulutta saklama
- 🌍 **Her Yerden Erişim** - Uzaktan veri ekleme ve görüntüleme
- 📊 **İstatistikler** - Otomatik ortalama hesaplama
- 📥 **JSON İçe/Dışa Aktarma** - Verilerinizi yedekleyin
- 🎨 **Modern Tasarım** - Premium UI/UX
- 📱 **Responsive** - Mobil uyumlu
- 💾 **Otomatik Yedekleme** - LocalStorage fallback

## 🚀 Kurulum Adımları

### 1. JSONBin.io Hesabı Oluşturma

1. **[JSONBin.io](https://jsonbin.io)** adresine gidin
2. **Sign Up** ile ücretsiz hesap oluşturun (GitHub ile giriş yapabilirsiniz)
3. Giriş yaptıktan sonra Dashboard'a gidin

### 2. API Key Alma

1. Dashboard'da **"API Keys"** sekmesine gidin
2. **"Create Access Key"** butonuna tıklayın
3. Key ismini verin (örn: "Temperature App")
4. **"Create Key"** butonuna tıklayın
5. Oluşan API Key'i kopyalayın (güvenli bir yerde saklayın!)

### 3. Bin (Veritabanı) Oluşturma

1. Dashboard'da **"Bins"** sekmesine gidin
2. **"Create Bin"** butonuna tıklayın
3. Bin ismini verin (örn: "temperature-data")
4. İlk veriye boş bir array girin: `[]`
5. **"Create"** butonuna tıklayın
6. Oluşan Bin ID'yi kopyalayın (URL'de görünür, örn: `65a1b2c3d4e5f6g7h8i9j0k1`)

### 4. Uygulamayı Yapılandırma

**`jsonbin-config.js`** dosyasını açın ve şu bilgileri güncelleyin:

```javascript
const JSONBIN_CONFIG = {
    // Adım 2'de aldığınız API Key
    apiKey: '$2a$10$.kyqiHUyso1851v.r5t3d.zgUcAVqQV7dOx9OWVQNPaZTcraWFm36',
    
    // Adım 3'te oluşturduğunuz Bin ID
    binId: '694e32fe43b1c97be905c64d',
    
    // Bu satırı değiştirmeyin
    apiUrl: 'https://api.jsonbin.io/v3/b'
};
```

**Örnek:**
```javascript
const JSONBIN_CONFIG = {
    apiKey: '$2a$10$AbCdEfGhIjKlMnOpQrStUv',
    binId: '65a1b2c3d4e5f6g7h8i9j0k1',
    apiUrl: 'https://api.jsonbin.io/v3/b'
};
```

### 5. Uygulamayı Çalıştırma

1. Dosyaları bir web sunucusunda barındırın veya:
   - **Live Server** (VS Code extension) kullanın
   - **Python**: `python -m http.server 8000`
   - **Node.js**: `npx http-server`

2. Tarayıcınızda `http://localhost:8000` adresine gidin

3. Console'da (F12) şu mesajı görmelisiniz:
   ```
   ✅ JSONBin.io bağlantısı aktif
   ```

## 📖 Kullanım

### Ölçüm Ekleme

1. Sıcaklık değerini girin (°C)
2. Nem değerini girin (%)
3. İsteğe bağlı: Konum ekleyin
4. İsteğe bağlı: Not ekleyin
5. **"Ölçümü Kaydet"** butonuna tıklayın

✅ Veri hem yerel tarayıcınıza hem de JSONBin.io bulutuna kaydedilir!

### Uzaktan Veri Ekleme

Aynı API Key ve Bin ID'yi başka bir cihazda/tarayıcıda kullanarak:
- Başka bir bilgisayardan
- Telefonunuzdan
- Farklı lokasyonlardan

veri ekleyebilir ve tüm cihazlarda senkronize olarak görebilirsiniz!

### JSON İçe Aktarma

1. **"JSON Yükle"** butonuna tıklayın
2. Daha önce indirdiğiniz JSON dosyasını seçin
3. Veriler otomatik olarak birleştirilir ve buluta yüklenir

### JSON Dışa Aktarma

1. **"JSON Olarak İndir"** butonuna tıklayın
2. Tüm verileriniz tarih damgalı bir JSON dosyası olarak indirilir
3. Bu dosyayı yedek olarak saklayabilirsiniz

### Verileri Silme

- **Tekli Silme**: Her ölçümün yanındaki çöp kutusu ikonuna tıklayın
- **Toplu Silme**: **"Tüm Verileri Sil"** butonuna tıklayın (onay gerektirir)

## 🔒 Güvenlik

- **API Key'inizi paylaşmayın!** Bu key ile herkes verilerinizi okuyup değiştirebilir
- Üretim ortamında API Key'i backend'de saklayın
- JSONBin.io üzerinde Bin ayarlarından erişim kısıtlamaları yapabilirsiniz

## 🌐 GitHub Pages'de Yayınlama

1. GitHub'da yeni bir repository oluşturun
2. Dosyaları repository'ye yükleyin
3. **Settings** > **Pages** sekmesine gidin
4. **Source** olarak main branch'i seçin
5. **Save** butonuna tıklayın
6. Birkaç dakika sonra `https://kullanici-adi.github.io/repo-adi` adresinde yayında olacak

⚠️ **ÖNEMLİ**: GitHub Pages'de `jsonbin-config.js` dosyası herkese açık olacaktır. API Key'iniz görünür olur. Üretim ortamında şunları yapın:
- Backend API oluşturun (Vercel/Netlify Functions)
- API Key'i environment variable olarak saklayın
- Frontend'den backend'e istek gönderin

## 📱 Mobil Kullanım

Uygulama tamamen responsive'dir. Mobil cihazlardan da rahatlıkla kullanabilirsiniz:
- PWA olarak telefonunuza ekleyin
- Offline kullanım için Service Worker eklenebilir
- Mobil sensörlerden otomatik veri çekme eklenebilir

## 🛠️ Teknolojiler

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, gradients, animations
- **Vanilla JavaScript** - No frameworks
- **JSONBin.io API** - Cloud storage
- **LocalStorage** - Offline fallback

## 📊 Veri Formatı

```json
[
  {
    "id": 1703596800000,
    "timestamp": "2024-12-26T10:00:00.000Z",
    "temperature": 23.5,
    "humidity": 65.2,
    "location": "Ofis",
    "notes": "Normal çalışma koşulları"
  }
]
```

## 🐛 Sorun Giderme

### "JSONBin.io yapılandırılmamış" hatası

- `jsonbin-config.js` dosyasındaki API Key ve Bin ID'yi kontrol edin
- Değerlerin placeholder olmadığından emin olun

### Veriler yüklenmiyor

- Browser Console'u (F12) açın ve hata mesajlarını kontrol edin
- API Key'in geçerli olduğundan emin olun
- Bin ID'nin doğru olduğundan emin olun
- İnternet bağlantınızı kontrol edin

### Veriler kaydedilmiyor

- JSONBin.io Dashboard'a gidip Bin'i manuel kontrol edin
- Ücretsiz plan limitlerini kontrol edin (aylık 10,000 request)
- CORS hatası varsa JSONBin.io ayarlarını kontrol edin

## 📄 Lisans

Bu proje tamamen ücretsiz ve açık kaynaklıdır. İstediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz.

## 💡 Geliştirme Fikirleri

- [ ] Grafik görünümü (Chart.js ile)
- [ ] Veri filtreleme ve arama
- [ ] CSV export
- [ ] Email bildirimleri (eşik değerlerde)
- [ ] Çoklu lokasyon desteği
- [ ] Kullanıcı hesapları ve kimlik doğrulama
- [ ] PWA (Progressive Web App) desteği
- [ ] Dark/Light mode toggle

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

---

**İyi Kullanımlar! 🎉**

Sorularınız için: [GitHub Issues](https://github.com/kullanici-adi/repo-adi/issues)
