# 📐 STONEBREAKING — Oyun Matematiği ve Tasarım Kararları

**Referans doküman · Taşkıran / Element Guardians**
Bu belge oyunun tüm sayısal iskeletini, formüllerin *neden* öyle seçildiğini
ve hangi test sonuçlarına dayandığını kayıt altına alır.

> Uygulama: `docs/math_model.py` (Python referansı) ve `index.html`
> (JavaScript birebir karşılığı). İkisi aynı formülleri kullanır.

---

## 1. Seviye Eğrisi

### Formüller

| Büyüklük | Formül | Aralık |
|---|---|---|
| Taş sayısı | `round(12 + 60(1 − e^(−n/30))) × 2` | 28 → 140 |
| Katman | 1/2/3/4/5 eşikleri: 8, 20, 45, 75 | 1 → 5 |
| Yüz çeşidi | `çift / (1.6 + 1.4·e^(−n/40))` | 5 → 36 |
| Par süre | `çift × (6.5·e^(−n/120) + 2.2)` sn | 121 → 352 sn |
| İpucu hakkı | `max(1, 5 − ⌊n/25⌋)` | 5 → 1 |
| Shuffle hakkı | `max(1, 4 − ⌊n/30⌋)` | 4 → 1 |
| Seviye Elo | `800 + 1600·(1−e^(−n/38))/(1−e^(−100/38))` | 845 → 2400 |
| XP | `100 · n^1.35` | 100 → 50 119 |

### Kesitler

| Sv | Rütbe | Taş | Kat | Yüz | Par | Elo | Zorluk |
|---|---|---|---|---|---|---|---|
| 1 | Çırak | 28 | 1 | 5 | 121 sn | 845 | 13.8 |
| 10 | Çırak | 58 | 2 | 11 | 237 sn | 1199 | 29.7 |
| 30 | Öğrenci | 100 | 3 | 22 | 363 sn | 1741 | 52.2 |
| 50 | Bükücü | 122 | 4 | 30 | 396 sn | 2062 | 68.4 |
| 70 | Usta | 132 | 4 | 36 | 385 sn | 2251 | 75.7 |
| 100 | Element Avatarı | 140 | 5 | 36 | 352 sn | 2400 | 84.7 |

**Tasarım notu — par sürenin tepe yapması kasıtlıdır.** Süre 50. seviyede
396 sn ile zirve yapar, sonra 352 sn'ye iner. Taş sayısı artmaya devam
ederken sürenin kısalması, geç oyunda baskıyı *zamandan* yaratır — taş
sayısını sonsuza kadar büyütmek yerine. Çift başına süre 8.7 sn'den
3.0 sn'ye düşer.

**Doygunlaşan üstel eğri neden?** Lineer artış 100. seviyede 500+ taş
üretirdi; telefon ekranında oynanamaz. Üstel doygunluk 140 taşta durur —
klasik Mahjong tahtası (144) ile aynı ölçek.

---

## 2. Chi Skoru Motoru

### Neden Elo?

Ham puan toplama (klasik "skor") oynadıkça sonsuz büyür ve *yetenek*
ölçmez, *süre* ölçer. Elo ise zorluğa göre normalize eder: kolay seviyede
mükemmel oynamak puan kazandırmaz, zor seviyede iyi oynamak kazandırır.

```
E    = 1 / (1 + 10^((seviye_elo − oyuncu_chi)/400))
chi ← chi + K(oturum) · (r − E)
K    = 12 + 28·e^(−oturum/25)
```

`K` düşüşü kritik: yeni oyuncunun skoru hızla gerçek seviyesine oturur
(K=40), deneyimli oyuncunun skoru tek kötü oturumla çökmez (K→12).

### Dört alt zeka → ham performans dönüşümü

| Alt zeka | Ruh | Formül |
|---|---|---|
| **Hız** | 🔥 Pyro | `σ(2.2·(par/süre − 0.95))` — lojistik |
| **Mantık** | 💧 Aqua | `(doğruluk − 0.45)/0.55` — %45 altı sıfır |
| **Hafıza** | 🌍 Terra | `0.55·(1−ipucu oranı) + 0.45·(1−geri dönüş oranı)` |
| **Örüntü** | 💨 Zephy | `0.7·min(1, kombo/(0.35·çift)) + 0.3·(1−shuffle oranı)` |

Her biri `[0,1]` aralığına kırpılır. Başarısız turda tüm `r` değerleri
`×0.55` ile kısmi kredi alır — yarım kalan emek tamamen boşa gitmez.

### Bileşik Chi — denge ödülü

```
chi_total = 0.75 · aritmetik_ortalama + 0.25 · harmonik_ortalama
```

Harmonik bileşen tek alanda uzmanlaşmayı hafifçe cezalandırır:

| Profil | Chi |
|---|---|
| Dengesiz {2000, 800, 800, 800} | **1060** |
| Dengeli {1100, 1100, 1100, 1100} | **1100** |

Bu, oyunun "dört elementi de taşıyan Taşkıran" temasının matematiksel
karşılığıdır — tema ve mekanik burada birbirini destekler.

### Doğrulama

40 seviyelik simülasyon, üç yetenek profili:

| Profil | Chi | IQ | Hız | Mantık | Hafıza | Örüntü |
|---|---|---|---|---|---|---|
| zayıf | 1289 | 101.9 ± 12.0 | 1168 | 1329 | 1244 | 1424 |
| orta | 1411 | 107.7 ± 12.0 | 1223 | 1414 | 1417 | 1604 |
| güçlü | 1516 | 112.8 ± 12.0 | 1315 | 1519 | 1583 | 1660 |

✅ Monotonluk doğrulandı (zayıf < orta < güçlü).

---

## 3. IQ Normalizasyonu

### Dürüstlük problemi ve çözümü

IQ iddiası ürünün en riskli kısmı — hem etik hem hukuki olarak. Üç
mekanizma ile korunuyor:

**1) Ortalamaya regresyon.** 3 oturum oynayan birine "IQ 138" demek
sahtekârlıktır. Spearman-Brown güvenilirliği ile skor ortalamaya çekilir:

```
ρ  = oturum / (oturum + 8)
IQ = 100 + (100 + 15z − 100) · ρ
```

**2) Güven aralığı her zaman gösterilir.**

```
CI₉₅ = 1.96 · 15 · √(1 − ρ)
```

**3) Yasal uyarı** her sonuç ekranında görünür.

### Chi → IQ haritası

| Chi | 5 oturum | 20 oturum | 60 oturum |
|---|---|---|---|
| 900 | 92.2 ± 23.1 | 85.6 ± 15.7 | 82.2 ± 10.1 |
| 1250 | 100.0 ± 23.1 | 100.0 ± 15.7 | 100.0 ± 10.1 |
| 1600 | 107.8 ± 23.1 | 114.4 ± 15.7 | 117.8 ± 10.1 |
| 1900 | 114.4 ± 23.1 | 126.8 ± 15.7 | 133.1 ± 10.1 |

Güvenilirlik: ρ(5)=0.38 · ρ(20)=0.71 · ρ(60)=0.88

IQ **[55, 145]** aralığına kırpılır. Sınır testleri: 0 oturum → tam 100.

> **Kalibrasyon uyarısı:** POP_MEAN=1250 ve POP_SD=260 şu an *varsayım*.
> Lansmanda gerçek oyuncu dağılımından yeniden hesaplanmalı. Bu yapılmadan
> "IQ" kelimesi pazarlamada öne çıkarılmamalı — "Chi Skoru" kullanılmalı.

---

## 4. Skor Bozulması (Decay)

**"Zihin bir kastır, kullanmazsan zayıflar."**

```
taban  = max(400, 0.65 · tepe_chi)
chi(t) = taban + (chi − taban) · e^(−λ(t−2)),   λ = ln2/21
```

| Gün | Chi (tepe 1600) | Kayıp | Geri kazanım |
|---|---|---|---|
| 3 | 1582 | %1.1 | 3 oturum |
| 7 | 1515 | %5.3 | 13 oturum |
| 14 | 1417 | %11.4 | 27 oturum |
| 30 | 1262 | %21.1 | 49 oturum |
| 90 | 1071 | %33.1 | 76 oturum |
| ∞ | 1040 | %35.0 | (taban) |

**Üç koruma:** 2 gün dokunulmazlık (hafta sonu cezalandırılmaz) · %65 taban
(emek asla silinmez) · yavaş yarılanma (21 gün, panik değil hatırlatma).

⚠️ **Etik sınır:** Decay bir FOMO aracıdır. Çocuk Modu'nda **kapalı**
olmalıdır — çocuğa "3 gün oynamazsan zekân düşer" mesajı verilemez.

---

## 5. Chi Enerjisi Ekonomisi

### Düzeltilen tasarım hatası

İlk modelde can *her oynanışta* harcanıyordu. Bu yanlıştı: türün
standardı (Candy Crush, Vita Mahjong) canı **yalnızca başarısızlıkta**
harcar. Baskı, oynama süresinden değil *takılma anından* doğmalı.

### Parametre çözümü

Hedef: haftada 1.5–4 "canın bitti" anı. Tarama sonucu:

| Maks can | Yenilenme | Duvar sıklığı | Duvar başarısızlığı | Duvar/hafta |
|---|---|---|---|---|
| 5 | 45 dk | 8 | %62 | 0.56 ❌ baskı yok |
| 5 | 30 dk | 6 | %72 | 1.58 ⚠️ sınırda |
| **3** | **30 dk** | **6** | **%62** | **1.95** ✅ |
| 3 | 30 dk | 5 | %72 | 3.66 ⚠️ agresif |

**Seçilen:** 3 can · 30 dk yenilenme · her 6 seviyede bir %62 duvar.

| Seviye tipi | Beklenen deneme | Can yakımı | 3 canı tüketme |
|---|---|---|---|
| Normal (%22) | 1.28 | 0.28 | %1.06 |
| Duvar (%62) | 2.63 | 1.63 | %23.83 |

Tam dolum 1.5 saat — cezalandırıcı değil, hatırlatıcı.

---

## 6. Tahta Üretimi ve Çözülebilirlik

### Ters çözüm yöntemi

Rastgele taş dağıtmak Mahjong'da **çözülemez tahtalar** üretir — türün
en sinsi hatası. Çözüm: tahtayı *çözülmüş halinden geriye* inşa et.

```
kalan ← tüm pozisyonlar
while kalan ≥ 2:
    serbest ← kalan içinde üstü açık ve yanı boş olanlar
    iki serbest pozisyon seç → aynı yüzü ata → kalandan çıkar
```

Her adım geçerli bir hamlenin *tersi* olduğu için, adımları ters sırada
oynamak daima tahtayı çözer.

### Test sonuçları

1–100 arası 17 seviye × 12 tahta, greedy çözücü ile:

| Seviye | Taş | Katman | Yüz | Fallback | İlk hamle | Çözülebilir |
|---|---|---|---|---|---|---|
| 1 | 28 | 1 | 5 | 0 | ✅ | ✅ |
| 20 | 82 | 2 | 17 | 0 | ✅ | ✅ |
| 50 | 122 | 4 | 30 | 0 | ✅ | ✅ |
| 90 | 138 | 5 | 36 | 0 | ✅ | ✅ |
| 100 | 140 | 5 | 36 | 0 | ✅ | ✅ (1–4 deneme) |

**Sonuç: %100 çözülebilir, sıfır fallback.**

Oyun içinde hamle kalmazsa tahta otomatik karıştırılır (`autoShuffle`),
karıştırma sonrası hamle garantisi 60 denemeye kadar zorlanır.

---

## 7. İş Modeli

### Varsayımlar

| Parametre | Değer | Gerekçe |
|---|---|---|
| 1. yıl indirme | 500 000 | konservatif hedef |
| Aile çarpanı | 1.9 | 1 indirme → ~2 aktif kullanıcı |
| D1 / D7 / D30 | %55 / %25 / %10 | tür ortalaması üstü hedef |
| Abonelik | 39.99 ₺/ay | KDV dahil brüt |
| Abone dönüşümü | %2.5 (MAU) | sektör bandı %2–5 |
| IAP ARPMAU | 1.10 ₺/ay | kozmetik + Battle Pass + rapor |
| CAC | 12 ₺/install (%35 ücretli) | TR oyun kategorisi |

### Sonuçlar

| Mağaza kesintisi | MAU | Abone | Net/abone | Yıl-1 gelir | ARPMAU | LTV/CAC |
|---|---|---|---|---|---|---|
| %15 (Small Business) | 95 000 | 2 375 | 28.33 ₺ | **1 695 548 ₺** | 1.49 ₺ | **2.83** |
| %30 (standart) | 95 000 | 2 375 | 23.33 ₺ | **1 396 334 ₺** | 1.22 ₺ | **2.33** |

### 2 milyon ₺ hedefi

Gereken abone dönüşümü: **%3.4** (MAU üzerinden). Sektör bandı %2–5
içinde → **gerçekçi ama iddialı**. Üç kaldıraç:

1. Dönüşümü %2.5 → %3.4 çıkarmak (aile değer önerisi güçlü)
2. Yıllık abonelik eklemek (peşin nakit + düşük churn)
3. İndirmeyi 500 K → 650 K'ya çıkarmak

⚠️ **LTV/CAC 2.83** sağlıklı ama 3'ün altında; ücretli kullanıcı
kazanımına agresif yüklenmek riskli. İlk yıl organik + editorial
öne çıkarmaya yaslanmak daha güvenli.

### Retention eğrisi

`r(d) = 0.55 · d^(−0.507)`

| Gün | D1 | D3 | D7 | D14 | D30 | D90 |
|---|---|---|---|---|---|---|
| Oran | %55.0 | %31.7 | %20.7 | %14.7 | %10.0 | %5.8 |

---

## 8. Açık Riskler

| # | Risk | Etki | Azaltma |
|---|---|---|---|
| 1 | **IQ kalibrasyonu varsayım** | Yüksek | Lansmanda gerçek dağılımdan yeniden hesapla; o güne dek "Chi Skoru" de |
| 2 | **Decay + çocuk kullanıcı** | Yüksek | Çocuk Modu'nda decay kapalı |
| 3 | **COPPA / KVKK** | Yüksek | Yaş kapısı, veri minimizasyonu, sıfır reklam |
| 4 | **"IQ testi" mağaza reddi** | Orta | "Beyin antrenmanı" konumlandırması, eğlence uyarısı |
| 5 | **LTV/CAC < 3** | Orta | Organik ağırlıklı büyüme, yıllık abonelik |
| 6 | **Tek geliştirici bağımlılığı** | Orta | Kod + doküman dışa açık, prototip devredilebilir |

---

## 9. Dosyalar

| Dosya | İçerik |
|---|---|
| `math_model.py` | Tüm formüllerin Python referansı, çalıştırılabilir |
| `tables/seviye_egrisi.csv` | 100 seviyenin tam parametre tablosu |
| `tables/chi_iq_haritasi.csv` | Chi → IQ dönüşümü, oturum sayısına göre |
| `tables/decay_tablosu.csv` | Bozulma ve geri kazanım |
| `tables/oyuncu_simulasyonu.csv` | 3 profil × 60 seviye simülasyonu |
| `tables/is_modeli.csv` | Gelir senaryoları |

Yeniden üretmek için:

```bash
cd docs && python3 math_model.py
```

🔥 Pyro · 💧 Aqua · 🌍 Terra · 💨 Zephy
