# 🗺️ YOL HARİTASI

**Güncelleme:** 28 Temmuz 2026

---

## NEREDEYİZ?

```
FİKİR ──── YAPIM ──── [BURADAYIZ] ──── YAYIN ──── BÜYÜME
                          %85
```

| Alan | Durum |
|---|---|
| Oynanış motoru | ✅ Tam |
| Hikaye (100 an) | ✅ Tam |
| Ölçüm sistemi | ✅ Tam |
| Marka kimliği | ✅ Tam |
| Viral motor | ✅ Tam |
| **Bulut kayıt** | 🔴 **Yok** |
| Mağaza vitrini | ⬜ Yok |

---

## FAZ 1 — YAYINA HAZIRLIK (kritik)

### 1.1 🔴 Bulut kayıt (Firebase)
**Neden kritik:** Abonelik gelir modelinin merkezinde. Bulut kayıt yoksa
telefon değişince oyuncunun 100 seviyelik emeği gidiyor — kimse ₺149
abonelik almaz.

**Engel:** Proje sahibinin ücretsiz Firebase hesabı açması.
Ücretsiz katman bu ölçek için fazlasıyla yeterli (50k okuma/gün).

**Yapılacaklar (hesap açılınca):**
- Google ile giriş
- Profil + ilerleme senkronu
- Çakışma çözümü (iki cihaz aynı anda oynarsa)
- Çevrimdışı kuyruk

### 1.2 Mağaza vitrini
İnsanlar oyunu görmeden önce ikonu, ekran görüntülerini ve videoyu görür.
**Dönüşümü en çok bu değiştirir.**
- Uygulama ikonu (512×512)
- 6-8 ekran görüntüsü (hikaye + oynanış + ölçüm)
- 30 saniyelik tanıtım videosu
- Mağaza metni (TR + EN)

### 1.3 Taş sembollerinin markaya dönüşümü
Rakamlar ve harfler hâlâ mahjong dilinde. Hikayede *"her taş bir düşünce
parçası"* diyoruz ama tahtada "3" ve "B" görünüyor.

**Plan:** Rakamlar → çekirdek kristalleri, Harfler → antik mühürler.
Vektör kalacak (sıfır bayt). **Risk:** rakam/harf saymayı kolaylaştırıyor,
oynanabilirlik zedelenmemeli.

---

## FAZ 2 — BÜYÜME

| # | İş | Ön koşul |
|---|---|---|
| 2.1 | Davet ödülü | Bulut kayıt |
| 2.2 | Aylık PDF rapor (aboneliğin asıl ürünü) | Bulut kayıt |
| 2.3 | IQ kalibrasyonu (`POP_MEAN` gerçek veriyle) | 1000 oturum |
| 2.4 | Mağaza A/B testi | Vitrin |

---

## FAZ 3 — DERİNLİK

| # | İş | Not |
|---|---|---|
| 3.1 | Element ustalığı renklenmesi | Kozmetik ekonomisi kurulunca satılabilir |
| 3.2 | Denge Mührü | Gizli hedef |
| 3.3 | Günün Taşı | 30 saniyelik günlük kanca |
| 3.4 | Geçmiş Benin (hayalet yarış) | Sunucusuz |
| 3.5 | Paralaks arka plan, ortam sesi | Gelire dokunmuyor |

---

## 📊 HEDEFLER

| Gösterge | Başabaş | Baz senaryo |
|---|---|---|
| İndirme | 11.000 | 250.000 |
| MAU | 2.105 | 48.875 |
| Aylık kâr | ₺0 | ₺333.249 |
| Geri ödeme | — | 3,0 ay |

**En güçlü kaldıraç:** İndirme +%50 → kâr **+%52**
(Dönüşüm +1 puan sadece +%15. Bütçe pazarlamaya gitmeli.)

---

## ✅ HER TURUN SONUNDA

```bash
node test/PATRON.js                    # dört gözle denetim
node batu/kontrol/SAHNE_GOZU.js        # sahneleri gözle kontrol
bash yedek/al.sh                       # görsel yedeği tazele
```

Sonra yayına al, canlıda doğrula, `DURUM.md`'ye işle.
