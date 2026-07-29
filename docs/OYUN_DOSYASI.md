# 📘 STONEBREAKING — Oyun Dosyası

**Element Guardians · Taşkıran'ın Efsanesi**
Sürüm 2.0 · Tepsili Üçlü Eşleme · 26 Temmuz 2026

🔗 **Canlı:** https://stonebreaking.github.io/

---

## 1. Oyun Nedir?

Oyuncu **Taşkıran**'dır — dört elementin gücünü taşıyan efsanevi avatar.
Element taşlarını kırarak zihnini keskinleştirir, dört ruh (Pyro, Aqua,
Terra, Zephy) ona rehberlik eder.

**Tür:** Tile Match (tepsili üçlü eşleme) + bilişsel ölçüm
**Platform:** HTML5 — tarayıcı, mobil, PWA (ana ekrana eklenebilir)
**Diller:** Türkçe / İngilizce (tam çeviri, anlık geçiş)
**Boyut:** 508 KB (tüm oyun, bağımlılık yok)

---

## 2. Temel Mekanik

```
Taşa dokun  →  Tepsiye gider  →  Aynı yüzler yan yana dizilir
                                        ↓
                            3 aynı bir araya gelince PATLAR
```

### Kurallar

| Kural | Açıklama |
|---|---|
| **Alınabilir taş** | Üstü örtülü olmayacak **ve** sağı veya solu boş olacak |
| **Kilitli taş** | Soluk görünür, dokunulunca uyarı sesi verir, alınmaz |
| **Tepsi** | 7 slot (ilk 3 seviyede 8). Dolar ve eşleşme yoksa **kaybedersin** |
| **Yan yana dizilim** | Aynı yüz tepsiye girince, eşinin hemen sağına yerleşir |
| **Zincirleme** | Bir patlama sonrası yeni üçlü oluşursa o da patlar (kombo) |
| **Süre** | Her seviyenin par süresi var, bitince kaybedersin |

### Yardımcılar

- **💡 İpucu** — tepsideki taşla eşleşen serbest taşları vurgular (4→1 hak)
- **↩ Geri Al** — son alınan taşı tahtaya geri koyar (3→1 hak)

---

## 3. Taş Yüzleri (40 çeşit)

Tümü **SVG çizim** — emoji yok, her çözünürlükte net.

| Grup | Adet | İçerik |
|---|---|---|
| **Elementler** | 4 | Ateş, Su, Toprak, Hava |
| **Sayma — Noktalar** | 9 | 1-9 arası renkli nokta dizilimleri |
| **Sayma — Çubuklar** | 9 | 1-9 arası düzenli çubuk grupları |
| **Rakamlar** | 9 | 1-9, çerçeveli serif |
| **Harfler** | 9 | A-I, daireli serif |

Seviye ilerledikçe çeşit artar: **8 → 22**.
Sayma grupları çocuklara sayı-miktar ilişkisi kurdurur; rakam ve harf
grupları sembol tanımayı çalıştırır.

📁 Tek tek PNG: `paket/taslar/` · Katalog: `paket/taslar/_TUM_TASLAR.png`

---

## 4. Zorluk Eğrisi

| Sv | Rütbe | Taş | Üçlü | Katman | Yüz | Tepsi | Spread | Süre | Elo | İpucu | Geri |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Çırak | 21 | 7 | 1 | 8 | 8 | 0 | 67s | 845 | 4 | 3 |
| 2 | Çırak | 24 | 8 | 1 | 8 | 8 | 0 | 76s | 888 | 4 | 3 |
| 3 | Çırak | 27 | 9 | 1 | 9 | 8 | 0 | 85s | 931 | 4 | 3 |
| 5 | Çırak | 33 | 11 | 1 | 10 | 7 | 3 | 102s | 1013 | 4 | 3 |
| 8 | Çırak | 42 | 14 | 2 | 11 | 7 | 4 | 128s | 1127 | 4 | 3 |
| 10 | Çırak | 48 | 16 | 2 | 12 | 7 | 4 | 144s | 1199 | 4 | 3 |
| 15 | Çırak | 57 | 19 | 2 | 14 | 7 | 4 | 166s | 1362 | 4 | 3 |
| 20 | Öğrenci | 66 | 22 | 3 | 15 | 7 | 5 | 187s | 1506 | 4 | 3 |
| 25 | Öğrenci | 75 | 25 | 3 | 17 | 7 | 5 | 206s | 1631 | 4 | 3 |
| 30 | Öğrenci | 81 | 27 | 3 | 18 | 7 | 5 | 217s | 1741 | 3 | 3 |
| 40 | Bükücü | 90 | 30 | 4 | 19 | 7 | 6 | 229s | 1922 | 3 | 2 |
| 50 | Bükücü | 96 | 32 | 4 | 20 | 7 | 7 | 234s | 2062 | 3 | 2 |
| 60 | Bükücü | 99 | 33 | 4 | 21 | 7 | 8 | 231s | 2169 | 2 | 2 |
| 70 | Usta | 102 | 34 | 4 | 21 | 7 | 8 | 230s | 2251 | 2 | 1 |
| 80 | Usta | 105 | 35 | 5 | 22 | 7 | 9 | 229s | 2314 | 2 | 1 |
| 90 | Büyük Usta | 105 | 35 | 5 | 22 | 7 | 9 | 222s | 2363 | 1 | 1 |
| 100 | Element Avatarı | 105 | 35 | 5 | 22 | 7 | 9 | 216s | 2400 | 1 | 1 |

### Tasarım mantığı

- **Taş sayısı** 21 → 105 (doygunlaşan üstel; telefonda oynanabilir kalır)
- **Katman** 1 → 5 (dikey karmaşıklık, yarım hücre kaydırmalı organik yığın)
- **Tepsi** 7'de sabit — 6'ya indirmek kazanmayı %50'ye düşürüyordu (ölçüldü)
- **Spread** asıl zorluk kolu: üçlünün taşları soyma sırasında ne kadar dağılır
- **Süre** taş başına 2.6s → 1.7s (geç seviyede tempo baskısı)

---

## 5. Çözülebilirlik Garantisi

Bu, türün en sinsi hatası: **çözülemez tahta**. İki katmanlı korumamız var.

### Katman 1 — Soyma sırasına göre dağıtım

Rastgele dağıtım felaketti. Greedy oyuncu simülasyonunda:

| Seviye | Rastgele dağıtım |
|---|---|
| 1-10 | %43-100 |
| 40+ | **%0** |

Sebep: bir üçlünün üç taşı tahtanın rastgele yerlerine düşüyor, biri erken
açılıp tepside sonsuza kadar bekliyor, tepsi doluyor.

**Çözüm:** tahta önce sanal olarak *soyulur* (`peelOrder`), taşların hangi
sırayla erişilebilir olduğu çıkarılır, üçlüler o sıraya göre atanır.
`spread` penceresi ile kontrollü dağıtılır.

### Katman 2 — Üretimde doğrulama

Üretilen her tahta, oyuncuya gösterilmeden önce iç simülasyonla oynanır
(`boardSolvable`). Geçmezse yeniden üretilir (24 deneme hakkı).

**Sonuç:**

| Ölçüm | Önce | Sonra |
|---|---|---|
| 100 seviye × 25 tahta | %73-100 (ort. %95.3) | **%100** |
| En kötü seviye | Sv82 → %73 | **yok** |
| Tahta üretim süresi | 0.3ms | 5.1ms (fark edilmez) |

---

## 6. Chi Skoru ve IQ

### Neden Elo?

Klasik puan toplama *yetenek* değil *süre* ölçer. Elo zorluğa göre normalize
eder: kolay seviyede mükemmel oynamak puan kazandırmaz.

```
E    = 1 / (1 + 10^((seviye_elo − oyuncu_chi)/400))
chi ← chi + K(oturum) · (r − E)
K    = 12 + 28·e^(−oturum/25)
```

`K` düşüşü kritik: yeni oyuncunun skoru hızla gerçek seviyesine oturur,
deneyimlinin skoru tek kötü oturumla çökmez.

### Dört alt zeka

| Alt zeka | Ruh | Ölçülen davranış |
|---|---|---|
| **Hız** | 🔥 Pyro | par süreye göre bitirme hızı (lojistik) |
| **Mantık** | 💧 Aqua | doğru/yanlış eşleşme verimliliği |
| **Hafıza** | 🌍 Terra | ipucu kullanımı + görülen yüze geri dönme |
| **Örüntü** | 💨 Zephy | en uzun kombo zinciri + geri alma kullanmama |

### Denge ödülü

```
chi = 0.75 · aritmetik + 0.25 · harmonik
```

| Profil | Chi |
|---|---|
| Dengesiz {2000, 800, 800, 800} | **1060** |
| Dengeli {1100 × 4} | **1100** |

"Dört elementi de taşıyan Taşkıran" teması matematiksel olarak da doğru.

### IQ normalizasyonu — dürüst versiyon

3 oturum oynayana "IQ 138" demek sahtekârlıktır. Üç koruma:

```
ρ  = oturum / (oturum + 8)          Spearman-Brown güvenilirliği
IQ = 100 + (15z)·ρ                  ortalamaya regresyon
CI = 1.96 · 15 · √(1−ρ)             %95 güven aralığı
```

| Oturum | ρ | Chi 1600 → IQ |
|---|---|---|
| 5 | 0.38 | 107.8 ± 23.1 |
| 20 | 0.71 | 114.4 ± 15.7 |
| 60 | 0.88 | 117.8 ± 10.1 |

Her sonuç ekranında güven aralığı ve "eğlence amaçlıdır" uyarısı görünür.

> ⚠️ **Kalibrasyon açık:** POP_MEAN=1250, POP_SD=260 şu an varsayım.
> Lansmanda gerçek oyuncu dağılımından hesaplanmalı. O güne dek pazarlamada
> **"Chi Skoru"** kullanılmalı, "IQ" öne çıkarılmamalı.

---

## 6.5 Oyun Modları

Üç mod var ve **gerçekten farklı davranıyorlar** — sadece etiket değil.

| | 🧸 Çocuk | 👨‍👩‍👧 Aile | ⚔️ Usta |
|---|---|---|---|
| Süre | **yok** | var (×1.35) | var (tam) |
| Skor düşmesi (decay) | **kapalı** | açık | açık |
| IQ gösterimi | **yok** | var | var |
| Chi Enerjisi (can) | **yok** | var | var |
| Tepsi | +1 slot | normal | normal |

### Neden Çocuk Modu böyle?

Bir çocuğa *"3 gün oynamazsan zekân düşer"* demek savunulabilir değil.
Çocuk Modu'nda decay tamamen kapalı — 90 gün sonra dönse bile skoru
aynı kalır (test edildi). Süre baskısı yok, can sistemi yok, IQ sayısı
hiç gösterilmez. Çocuk sadece oynar ve keşfeder.

---

## 6.6 Aile Hesabı

Yatırımcı sunumunun temeli **"1 indirme = 2-4 kullanıcı"** iddiasıydı.
Tek profille bu iddia boştu. Artık gerçek:

- Aynı telefonda **sınırsız profil** — herkes kendi Taşkıran'ı
- Her profilin kendi adı, avatarı (8 seçenek), modu, seviyesi, Chi'si
- Profil değiştirme tek dokunuş (sol üstteki avatar düğmesi)
- **Aile Bonusu:** aynı gün 2+ profil oynarsa herkese **+%10 Chi kazancı**

```
👨‍👩‍👧 Kim Oynuyor?
   ├── 🐰 Efe   · Sv 8  · ⚡1000 · 🧸 Çocuk Modu
   ├── 🐬 Anne  · Sv 27 · ⚡1537 · 👨‍👩‍👧 Aile Modu
   └── 🦁 Baba  · Sv 41 · ⚡1677 · ⚔️ Usta Modu
```

### Geriye dönük uyumluluk

Eski tek profilli kayıt (`stonebreaking_v2`) açılışta otomatik taşınır.
Mevcut oyuncular ilerlemelerini kaybetmez — Sv33/41 oturumluk bir kayıt
test edildi, sorunsuz aktarıldı.

---

## 6.7 IQ Dürüstlüğü — sıkılaştırıldı

Önceden az oturumda da bir IQ sayısı gösteriliyordu (güven aralığıyla
birlikte ama yine de bir sayı). Artık:

**ρ < 0.35 (yaklaşık 20 oturum altı) → sayı yerine "—" gösterilir**
ve "IQ tahmini için en az 20 oturum gerekir" yazar.

Yeterli veri yokken sayı üretmemek, güven aralığı göstermekten daha
dürüst bir davranış.

---

## 7. Chi Enerjisi

**Can yalnızca başarısızlıkta harcanır** — tür standardı budur. Baskı
oynama süresinden değil takılma anından doğar.

| Parametre | Değer |
|---|---|
| Maks can | 3 |
| Yenilenme | 30 dk/can |
| Tam dolum | 1.5 saat |

---

## 8. Skor Bozulması

*"Zihin bir kastır, kullanmazsan zayıflar."*

```
taban  = max(400, 0.65 · tepe)
chi(t) = taban + (chi − taban)·e^(−λ(t−2)),  λ = ln2/21
```

| Gün | Chi (tepe 1600) | Kayıp |
|---|---|---|
| 7 | 1515 | %5.3 |
| 30 | 1262 | %21.1 |
| ∞ | 1040 | %35 (taban) |

2 gün dokunulmazlık · %65 taban · 21 gün yarılanma.

> ⚠️ Çocuk Modu'nda **kapalı** olmalı. Bir çocuğa "3 gün oynamazsan zekân
> düşer" demek savunulamaz.

---

## 9. Ses ve Geri Bildirim

WebAudio ile üretilir — **harici ses dosyası yok**.

| Olay | Ses |
|---|---|
| Taş alma | 520 Hz kısa tık |
| Eşleşme | 620 Hz + kombo yükseldikçe tizleşir + titreşim |
| Kazanma | Do-Mi-Sol-Do arpej |
| Kaybetme | Alçalan üç ton |
| Uyarı | Son 10 sn + tepsi dolmak üzere |
| Reddedilme | Kilitli taşa dokunma |

🔊 Sol üstten kapatılabilir, tercih hatırlanır.

---

## 10. Teknik Notlar

- Tek dosya (`index.html`), sıfır bağımlılık, build adımı yok
- İlerleme `localStorage`'da; dönüşte decay ve enerji yenilenmesi uygulanır
- **Watchdog:** animasyon kilidi 3sn'den uzun takılırsa otomatik açılır
- PWA: ana ekrana eklenir, tam ekran açılır
- Open Graph + Twitter Card meta etiketleri

### Test kapsamı

| Test | Sonuç |
|---|---|
| 100 seviye × 25 tahta çözülebilirlik | ✅ %100 |
| 11 seviye gerçek tarayıcıda uçtan uca | ✅ 11/11 |
| 15 senaryo (kilitli taş, undo, ipucu, süre, can, race) | ✅ 0 hata |
| 4 cihaz (320-1280px) | ✅ temiz |
| Mod davranışları (çocuk decay/IQ/süre) | ✅ 0 hata |
| Aile hesabı (profil CRUD, geçiş, kalıcılık) | ✅ 0 hata |
| v2 → v3 kayıt geçişi | ✅ ilerleme korundu |
| Konsol hataları | ✅ 0 |

---

## 11. Bilinen Riskler

| # | Risk | Etki | Azaltma |
|---|---|---|---|
| 1 | IQ kalibrasyonu varsayım | Yüksek | Gerçek dağılımdan hesapla; o güne dek "Chi Skoru" de |
| 2 | ~~Decay + çocuk kullanıcı~~ | ✅ Çözüldü | Çocuk Modu'nda decay/IQ/süre kapalı |
| 3 | COPPA / KVKK | Yüksek | Yaş kapısı, veri minimizasyonu, sıfır reklam |
| 4 | "IQ testi" mağaza reddi | Orta | "Beyin antrenmanı" konumlandırması |
| 5 | Tek geliştirici bağımlılığı | Orta | Kod + doküman açık, devredilebilir |
| 6 | Bulut kayıt yok | Orta | Telefon değişince ilerleme gider — v3'te hesap sistemi |

---

## 12. Yol Haritası

| Faz | İçerik |
|---|---|
| **Şimdi** | 100 seviye, 40 taş yüzü, TR/EN, Chi+IQ, ses, PWA, **3 mod, aile hesabı** |
| **Sonraki** | Günlük görev, Chi gelişim grafiği, rozet sistemi |
| **Ay 3** | Battle Pass, kozmetik Taşkıran kıyafetleri, rozet sistemi |
| **Ay 6** | Aile turnuvası, bulut kayıt, sosyal paylaşım |

---

## 13. Dosya Yapısı

```
stonebreaking/
├── index.html              Oyunun tamamı
├── manifest.json           PWA tanımı
├── sw.js                   Service worker
├── assets/                 Oyun içi görseller (344 KB)
├── docs/
│   ├── OYUN_DOSYASI.md     ← bu dosya
│   ├── OYUN_MATEMATIGI.md  Formül referansı
│   ├── math_model.py       Çalıştırılabilir model
│   └── tables/*.csv        Denge tabloları
└── paket/                  Dışa aktarılmış görseller
    ├── taslar/             40 taş + katalog
    ├── ekranlar/           21 ekran görüntüsü
    ├── karakterler/        Taşkıran + 4 ruh
    └── marka/              Logo + app icon
```

🔥 Pyro · 💧 Aqua · 🌍 Terra · 💨 Zephy
