# 🗿 BATU — STONEBREAKING Komuta Merkezi

**Bu klasör projenin hafızasıdır.** Sohbet kaybolsa, oturum kapansa,
bağlam silinse bile buradan devam edilir.

**Son güncelleme:** 28 Temmuz 2026
**Canlı:** https://stonebreaking.github.io/
**Depo:** https://github.com/stonebreaking/stonebreaking.github.io

---

## ⚡ 30 SANİYEDE DURUM

| | |
|---|---|
| **Ürün** | %85 hazır — oynanış, hikaye, ölçüm tam |
| **Canlı sürüm** | `2026-07-28d` |
| **Denetim** | 19 kontrol geçiyor, **1 kritik engel** |
| **Kritik engel** | Bulut kayıt yok → abonelik satılamaz |
| **Başabaş** | 2.105 MAU (~11.000 indirme) |
| **Sıradaki iş** | Firebase hesabı açılması bekleniyor |

**Tek komutla kontrol:**
```bash
URL=https://stonebreaking.github.io/ node test/PATRON.js
```

---

## 🤝 ORTAKLIK — nasıl çalışıyoruz?

### Batu (Proje Sahibi — Kurucu Ortak)
- Fikrin, markanın, **Taşkıran** adının sahibi (kendi soyadı)
- Ürün yönü ve görsel beğenide **son karar mercii**
- Gerçek cihazda test eder, eksikleri bildirir
- GitHub deposunun sahibi

### Geliştirici Ortak (Asistan)
Dört şapka birden takar:
- **🎩 Patron** — yayına hazır mı, neyi durdurmalı?
- **💰 Finansmancı** — para kazandırır mı, gerekçesi ne?
- **🎮 Oyun tasarımcısı** — oynanır mı, hissi doğru mu?
- **🎨 Grafik tasarımcı** — görünüyor mu, oturmuş mu?

### Çalışma ilkeleri (Batu'nun talepleri)
1. **Adım adım anlat** — ne yaptığını yazmadan geçme
2. **Gerçek gözle kontrol et** — ekran görüntüsü al, bak, doğrula
3. **Ölç, tahmin etme** — "sanırım" değil, sayı ver
4. **Her değişikliği yayına al** — Batu canlıda test edebilsin
5. **Gerekçe sun** — "yap" denileni körü körüne yapma, itiraz edebilirsin
6. **Yedek tut** — görseller en pahalı parça, üç katmanlı koruma

---

## 📜 MARKA KURALLARI (tartışmaya kapalı)

| Kural | Açıklama |
|---|---|
| **STONEBREAKING** | Hiçbir dilde çevrilmez, hep büyük harf. **Arayüzde kullanılan ad budur.** |
| **Taşkıran** | Hikayedeki kahramanın adı. İngilizcede de `Taşkıran` kalır. |
| Yasak | "Stonebreaker", "Taş Kıran", "TaşKıran" |

### Element renk anayasası
🔴 **Kırmızı = Alev** · 🔵 **Mavi = Su** · 🟢 **Yeşil = Toprak** · ⚪ **Beyaz = Hava**

Tek kaynak: `INK` sabiti (index.html). Taşlar, kolye, ruh kartları,
zihin haritası çubukları — hepsi buradan beslenir.

### Dört koruyucu
| Ad | Element | Güç | Dersi | Zaafı |
|---|---|---|---|---|
| **Kor** | 🔴 Ateş | Hız | Cesaret | Acelecilik |
| **Dem** | 🔵 Su | Mantık | Sabır | Fazla düşünmek |
| **Kaya** | 🟢 Toprak | Hafıza | Köklenmek | Geçmişe takılmak |
| **Yel** | ⚪ Hava | Örüntü | Bütünü görmek | Yere basmamak |

---

## 🎯 BATU'NUN TÜM TALEPLERİ VE DURUMLARI

### ✅ Tamamlananlar

| # | Talep | Ne yapıldı |
|---|---|---|
| 1 | "Profil silme yok, beğeni olsun" | Profil sil/düzenle + beğeni sistemi |
| 2 | "PvP modu olsun" | **Asenkron Meydan Okuma** — link + eşzamanlı geri sayım |
| 3 | "Taç ve TOP10 sıralama" | Şampiyon şeridi ana menüde |
| 4 | "Enerji sistemi + reklam paneli" | Taşkıran Paneli: bekle/izle/abone ol |
| 5 | "Ruhlar bağırsın, kombo olunca zaman önemsizleşsin" | `SHOUT` + kombo → `freezeTime()` |
| 6 | "Semboller karışıyor, eşit dağılsın" | `facePool()` dört aileden dönüşümlü |
| 7 | "Logo saintgreyhills gibi olsun" | Fırça imzası + kırık taş + 4 madalyon |
| 8 | "Chi değil BT enerjisi olsun" | BT taşı, monogram, enerji sistemi |
| 9 | "100 sahne olsun, hikaye bağlansın" | **100 an**: 10 perde + 91 sahne |
| 10 | "Başlangıç hikayesi daha canlı olsun" | Açılış sinematiği: ruhlar uyanır, çekirdek çatlar |
| 11 | "1. leveli bitirince hikaye yok" | Sv1 boşluğu kapatıldı |
| 12 | "Kadın/erkek yazısı hizalı değil" | Piksel piksel hizalandı (160px) |
| 13 | "Avatar seçiminde 4 element olsun" | 8 hayvan → 4 element |
| 14 | "Yeni Taşkıran değil STONEBREAKING" | 29 arayüz etiketi değişti |
| 15 | "Kendi fontumuzu yapalım" | **138 glif**, Türkçe tam, 7,7 KB |
| 16 | "Tek seferlik IQ testi" | **Ölçüm Sınavı** — sabit tohum, herkes aynı tahta |
| 17 | "Her ruhun ayrı hikayesi olsun" | **Ruh Yolu** — 4 ruh × 10 kişisel an |
| 18 | "Ruh isimleri değişsin" | Pyro→**Kor**, Aqua→**Dem**, Terra→**Kaya**, Zephy→**Yel** |
| 19 | "Ruhların tahtası farklı olsun" | 4 element sunağı üretildi |
| 20 | "Hikaye anları tam sayfa olsun" | Kart → tam ekran sinematik |
| 21 | "Koruyucular bilgelik sözü versin" | **48 söz**, paylaşılabilir kart |
| 22 | "Girişte aksiyon, ilk taşta odak" | Davul + epik mod → tam sessizlik |
| 23 | "Element taşları renk karışıyor" | Renk anayasası tek kaynağa bağlandı |
| 24 | "Oyun kasıyor" | Tepki **273ms → 26ms** (4× hızlanma) |
| 25 | "Meydan okuma basit olsun, aynı anda başlasın" | Link + 45sn randevu + geri sayım |
| 26 | "BT taşını STONEBREAKING'in eline ver" | Süzülen enerji taşı + SVG kolye |
| 27 | "Hikayelerin üstünde avatarımız olsun" | Sahne + Perde I'de oyuncu avatarı |
| 28 | "Logo değişmemiş" | Perde I'de logo → oyuncu avatarı |
| 29 | "Kırılma sahnesi kaymış" | **12 panelin odağı** ölçümle düzeltildi |
| 30 | "Senaryo-arayüz uyumlu olsun" | **Gölge Aynası** — tez veriyle sınanıyor |
| 31 | "Dört gözle kontrol eden kod" | **PATRON denetçisi** |
| 32 | "Yedek klasörü + ortaklık metni" | 3 katmanlı yedek + ORTAKLIK.md |
| 33 | "Fizibilite yap" | FIZIBILITE.md |
| 34 | "Batu klasörü" | **Bu klasör** |

### ⏳ Bekleyenler

| Öncelik | İş | Engel |
|---|---|---|
| 🔴 1 | **Firebase + bulut kayıt** | Batu'nun ücretsiz hesap açması |
| 🟡 2 | Mağaza vitrini (ikon, ekran görüntüleri, video) | — |
| 🟡 3 | Taş sembollerinin markaya dönüşümü | Rakam/harf hâlâ mahjong dilinde |
| 🟢 4 | IQ kalibrasyonu | 1000 gerçek oturum verisi |
| 🟢 5 | Aylık PDF rapor (aboneliğin asıl ürünü) | Firebase gerekir |

---

## 🗺️ YOL HARİTASI

### Faz 1 — Yayına hazırlık
1. **Firebase + bulut kayıt** ← tek kritik engel
2. Mağaza vitrini
3. Taş sembolleri

### Faz 2 — Büyüme
4. Davet ödülü
5. Aylık PDF rapor
6. IQ kalibrasyonu

### Faz 3 — Derinlik
7. Element ustalığı renklenmesi, Denge Mührü
8. Paralaks arka plan, ortam sesi

---

## 🔍 DENETİM SİSTEMİ

`test/PATRON.js` — dört gözle bakan tek denetçi.

```bash
node test/PATRON.js                  # yerel
URL=https://... node test/PATRON.js  # canlı
node test/PATRON.js --hizli          # perde taramasını atla
```

Çıkış kodu: **0 = yayınlanabilir**, **1 = engel var**

### Son sonuç (canlı)
```
🎩 PATRON      — temiz    (açılış 2,7sn · JS hatası yok · 404 yok)
💰 FİNANSMANCI — 1 KRİTİK (bulut kayıt yok)
🎮 TASARIMCI   — temiz    (tepki 10ms · denge cezası ✓ · 100 an)
🎨 GRAFİKER    — temiz    (13 perde · 3 ekran boyutu temiz)

geçen 19 · uyarı 0 · kritik 1
```

---

## 📊 ÖLÇÜLMÜŞ DEĞERLER

| Gösterge | Değer | Hedef |
|---|---|---|
| İlk taşa süre (TTF) | 9,2 sn | < 30 sn ✅ |
| Dokunma tepkisi | 10–26 ms | < 100 ms ✅ |
| Tahta kurulumu | 25 ms | — ✅ |
| İlk yükleme | 981 KB | < 3 MB ✅ |
| Font | 7,7 KB (138 glif) | — ✅ |
| Denge cezası | 1100 > 1060 | teze uygun ✅ |
| Hikaye | 100 an | 100 ✅ |

---

## 💰 İŞ MODELİ (baz senaryo)

| Gösterge | Değer |
|---|---|
| İndirme | 250.000 |
| MAU | 48.875 |
| Aylık kâr | ₺333.249 |
| LTV/CAC | 2,5 |
| Geri ödeme | 3,0 ay |
| **Başabaş** | **2.105 MAU** |

**En güçlü kaldıraç:** İndirme +%50 → kâr **+%52**
(Dönüşüm +1 puan sadece +%15, mağaza payı −%12)

---

## 📁 DOSYA HARİTASI

```
kanka/
├── BATU/                 ⭐ BU KLASÖR — komuta merkezi
│   ├── OKU_BENI.md         (bu dosya)
│   ├── belgeler/           tüm belgelerin kopyası
│   ├── denetim/            PATRON denetçisi + son rapor
│   └── gorseller/          önemli ekran görüntüleri
├── index.html            Oyunun tamamı (tek dosya)
├── HIKAYE.md             ⭐ Hikaye tek paragrafta
├── ORTAKLIK.md           ⭐ Ortaklık beyanı
├── FIZIBILITE.md         ⭐ Fizibilite raporu
├── DURUM.md              ⭐ Teknik hafıza, hata tablosu
├── assets/               90 görsel + font
├── docs/                 matematik modeli, ticari plan
├── test/PATRON.js        ⭐ Dört gözle denetim
└── yedek/                3 katmanlı görsel yedeği
```

---

## 🚨 SOHBET KAYBOLURSA

1. **Bu dosyayı oku** (BATU/OKU_BENI.md)
2. `HIKAYE.md` — hikayenin özü tek paragrafta
3. `DURUM.md` — teknik hafıza, çözülmüş hatalar
4. `FIZIBILITE.md` — nerede olduğumuz, ne kaldığı
5. `node test/PATRON.js` — mevcut durumu ölç

### Depo erişimi
```bash
git remote add origin https://x-access-token:TOKEN@github.com/stonebreaking/stonebreaking.github.io.git
git config user.name Taskiran
git config user.email taskiran@stonebreaking.dev
```

### Ortam kurulumu (her yeni oturumda)
```bash
npm install playwright --silent
npx playwright install chromium
npx playwright install-deps chromium
(nohup python3 -m http.server 8899 >/dev/null 2>&1 &)
```

---

*"Her taş bir düşünce, her kırılış bir keşif."*

**STONEBREAKING** · Element Guardians
