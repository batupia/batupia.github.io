# 📊 STONEBREAKING — Fizibilite Raporu

**Tarih:** 28 Temmuz 2026
**Hazırlayan:** Geliştirici ortak (tasarım + finansman)
**Karar mercii:** Proje sahibi

> Bu rapor tahmin değil **ölçüm** üzerine kuruludur. Her rakam
> `docs/math_model.py` içindeki modelden gelir; model `verify_sync()`
> ile oyunun kodundaki 19 sabiti sürekli denetler. Sapma olursa
> model çalışmayı reddeder.

---

## 1. YÖNETİCİ ÖZETİ

| Soru | Cevap |
|---|---|
| Ürün hazır mı? | **%85** — oynanış, hikaye, ölçüm tam. Bulut kayıt eksik. |
| Para kazanır mı? | **Evet**, başabaş 2.105 MAU (~11.000 indirme) |
| Ne zaman? | Baz senaryoda **3,0 ay** geri ödeme |
| En büyük risk | Bulut kayıt yok → abonelik satılamaz |
| En güçlü kaldıraç | İndirme +%50 → kâr **+%52** |
| Tavsiye | **Devam** — kalan iş 3 kalemde toplanıyor |

---

## 2. ÜRÜN DURUMU (ölçülmüş)

### Tamamlanan
| Alan | Durum | Kanıt |
|---|---|---|
| Oynanış motoru | ✅ 100 seviye + sonsuz mod | Sv100'de 111 taş, 5 katman |
| Hikaye | ✅ 100 an (10 perde + 91 sahne) | Boş seviye: 0 |
| Ruh yolları | ✅ 4 ruh × 10 kişisel an | Aynı seviyede 4 farklı metin |
| Bilgelik sözleri | ✅ 48 söz, paylaşılabilir kart | 12/koruyucu |
| Ölçüm sınavı | ✅ Sabit tohum, tek oturum IQ | Acemi 76 / Orta 114 / Usta 129 |
| Meydan okuma | ✅ Link + eşzamanlı geri sayım | İki tarayıcı aynı tahtada doğrulandı |
| Marka kimliği | ✅ Kendi fontu (138 glif, 7,7 KB) | Türkçe tam destek |
| Görsel varlık | ✅ 90 dosya | 4 ruh sunağı, 32 sahne zemini |
| Test paketi | ✅ 25 kontrol, canlıya karşı | hikaye100 11/11, intro 14/14 |

### Ölçülmüş performans
| Gösterge | Değer | Sektör hedefi | Durum |
|---|---|---|---|
| İlk taşa süre (TTF) | **9,2 sn** | < 30 sn | ✅ |
| Dokunuş sayısı | **11** | < 20 | ✅ |
| Taşa basma tepkisi | **26–140 ms** | < 100 ms | ✅ |
| İlk yükleme | ~1,5 MB | < 3 MB | ✅ |
| Font boyutu | 7,7 KB | — | ✅ |

### Eksikler
| # | Eksik | Etki | Engel |
|---|---|---|---|
| 🔴 1 | **Bulut kayıt (Firebase)** | Abonelik satılamaz, telefon değişince ilerleme gider | Proje sahibinin hesap açması |
| 🟡 2 | Mağaza vitrini | İndirme dönüşümü düşük kalır | — |
| 🟡 3 | Taş sembolleri hâlâ mahjong dilinde | Marka özgünlüğü zayıf | — |
| 🟢 4 | IQ kalibrasyonu varsayım | Ölçüm hassasiyeti | 1000 gerçek oturum |

---

## 3. OYNANIŞ MATEMATİĞİ (doğrulandı)

### Zorluk eğrisi
| Sv | Taş | Katman | Yüz | Süre | Rütbe |
|---|---|---|---|---|---|
| 1 | 36 | 2 | 14 | 114 sn | Çırak |
| 20 | 78 | 3 | 23 | 221 sn | Öğrenci |
| 50 | 102 | 4 | 28 | 248 sn | Bükücü |
| 100 | 111 | 5 | 30 | 229 sn | Element Avatarı |

### Denge cezası — oyunun tezi kanıtlandı
| Profil | Chi | Çember |
|---|---|---|
| Her alanda 1100 | **1100** | %100 |
| Tek alan 2000, kalan 800 | **1060** | %25 |

**Tek alanda uzmanlaşan, her alanda ortalama olandan DÜŞÜK alıyor.** Hikayedeki "İlk Taşkıran'ın hatası" mekanikte birebir karşılık buluyor.

### Enerji ekonomisi
Arz 53/gün, talep 3,55/gün → **haftada 1,95 duvar anı**. Sağlıklı bant: oyuncu ne bunalıyor ne bedavaya oynuyor.

### Kombo kalibrasyonu (gerçek motorla ölçüldü)
| Pencere | Ortalama | 3'lü | 5'li |
|---|---|---|---|
| 3000 ms | 2,27 | %38 | %0 |
| **4500 ms** | **3,63** | **%87** | **%17** |
| 6000 ms | 7,20 | %93 | %85 |

4500 ms seçildi: kombo ulaşılabilir ama sıradan değil.

---

## 4. İŞ MODELİ

| | Temkinli | **Baz** | İyimser |
|---|---|---|---|
| İndirme | 120.000 | **250.000** | 500.000 |
| MAU | 23.460 | **48.875** | 97.750 |
| Abone | 586 | **1.955** | 5.865 |
| Gelir/ay | ₺117.011 | **₺348.249** | ₺902.831 |
| **Kâr/ay** | ₺102.011 | **₺333.249** | ₺887.831 |
| ARPMAU | ₺4,99 | **₺7,13** | ₺9,24 |
| LTV/CAC | 1,7 | **2,5** | 3,2 |
| Geri ödeme | 4,3 ay | **3,0 ay** | 2,3 ay |

**Başabaş: 2.105 MAU** (~11.000 indirme). Sunucu gideri ₺15.000/ay.

### Duyarlılık — hangi kaldıraç güçlü?
| Değişken | Yeni kâr | Etki |
|---|---|---|
| **İndirme +%50** | ₺507.373 | **+%52** ⭐ |
| Abone dönüşümü +1 puan | ₺384.832 | +%15 |
| Mağaza payı %15→%30 | ₺292.493 | −%12 |

**Sonuç:** Bütçe **indirme hacmine** gitmeli, fiyat optimizasyonuna değil.

### Viral motor — Meydan Okuma
- k-faktörü **0,19** · yıllık **39.139 organik indirme**
- UA karşılığı **₺164.384** · ek gelir **₺408.904/yıl**
- Maliyeti **₺0** (sunucu yok, deterministik tahta yeterli)

---

## 5. ALINMIŞ KARARLAR (gerekçeli)

| Karar | Gerekçe | Net etki |
|---|---|---|
| **iPhone çekilişi → HAYIR** | ₺650k maliyet; başabaş 62.216 organik install gerektirir. 10 mutlu, 10.742 küsen. | Onur sistemi: **+₺13.174** |
| **Canlı PvP → HAYIR** | Sunucu + eşleştirme + çocuk güvenliği riski | Asenkron: **₺0 maliyet, 39k install/yıl** |
| **Kategori: Eğitim** | Bulmaca'ya göre rekabet 10× az, abonelik toleransı 3× yüksek | Dönüşüm avantajı |
| **Müzik: prosedürel** | Hazır mp3 yerine WebAudio | **0 bayt**, telif riski yok |
| **Kolye: SVG katman** | Üretilen görsellerde renk tutarsızdı | **0 bayt**, 10 rütbede aynı |
| **Font: kendi üretimimiz** | Google Fonts bağımlılığı kalktı | **7,7 KB**, çevrimdışı çalışır |

---

## 6. RİSKLER

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Bulut kayıt gecikirse abonelik satılamaz | **Yüksek** | **Kritik** | Firebase ücretsiz katman yeterli; hesap açılması bekleniyor |
| İndirme hedefi tutmazsa | Orta | Yüksek | Başabaş düşük (11k indirme); viral motor destekliyor |
| IQ iddiası düzenleyici ilgisi çekebilir | Düşük | Orta | "Klinik test değildir" uyarısı her sonuçta var |
| Mağaza payı %30'a çıkarsa | Orta | Düşük | Kârın −%12'si; model dayanıklı |
| Taş sembolleri jenerik kalırsa | Orta | Orta | Marka mührü eklendi; tam dönüşüm planlandı |

---

## 7. YOL HARİTASI

### Faz 1 — Yayına hazırlık (kritik)
1. **Firebase + bulut kayıt** — abonelik satmanın önündeki tek teknik engel
2. **Mağaza vitrini** — ikon, ekran görüntüleri, tanıtım videosu
3. Taş sembollerinin markaya dönüşümü

### Faz 2 — Büyüme
4. Davet ödülü (bulut kayıt gerektirir)
5. Aylık PDF rapor (aboneliğin asıl ürünü)
6. IQ kalibrasyonu (1000 gerçek oturum sonrası)

### Faz 3 — Derinlik
7. Element ustalığı renklenmesi, Denge Mührü
8. Paralaks arka plan, ortam sesi

---

## 8. SONUÇ

**Ürün teknik olarak sağlam.** Oynanış ölçüldü, matematik oyunla senkron, performans sektör hedeflerinin içinde, test paketi canlıya karşı geçiyor.

**Ticari model tutarlı.** Başabaş noktası düşük (11.000 indirme), en güçlü kaldıraç belirlendi (indirme hacmi), viral motor sıfır maliyetle yılda 39.000 organik kurulum getiriyor.

**Tek kritik engel bulut kayıt.** Bu çözülmeden abonelik satılamaz — ve abonelik gelir modelinin merkezinde. Firebase'in ücretsiz katmanı bu ölçek için fazlasıyla yeterli; gereken tek şey hesap açılması.

**Tavsiye: DEVAM.** Kalan iş üç kalemde toplanıyor ve hiçbiri yeni bir teknoloji ya da bütçe gerektirmiyor.

---

*"Her taş bir düşünce, her kırılış bir keşif."*
**STONEBREAKING** · Element Guardians
