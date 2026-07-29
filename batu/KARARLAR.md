# ⚖️ KARAR DEFTERİ

> Alınan her kararın **gerekçesi** burada. Yeni bir asistan "bu neden
> böyle yapılmış?" diye sorduğunda cevap bulmalı. Karar değiştirilecekse
> önce gerekçesi çürütülmeli.

---

## TİCARİ KARARLAR

### 1. iPhone çekilişi → **HAYIR**
**Hesap:** 10 iPhone = ₺650.000. Aynı parayla kullanıcı edinimi yapılsa
154.762 kurulum → LTV ₺1.616.869. Çekilişin başabaş noktası **62.216
organik kurulum** gerektiriyor.

**Asıl sorun sayı değil:** Çekiliş 10 kişiyi mutlu eder, **10.742 kişiyi
küstürür**.

**Yerine:** *Taşkıran Onuru* — Sv100'ü bitiren herkese unvan + çerçeve
(₺0). İlk 100'e fiziksel sertifika (₺4.500). Sonrasında ₺79'a satılık.
**Net: +₺13.174.** Herkes ödüllenir, üstelik para kazandırır.

### 2. Canlı PvP → **HAYIR**
Sunucu maliyeti + eşleştirme altyapısı + çocuk güvenliği riski.

**Yerine:** Asenkron **Meydan Okuma**. Aynı tohum → aynı tahta, farklı
zaman. Sunucu yok, hesap yok, eşleştirme yok. k-faktörü **0,19**, yıllık
**39.139 organik kurulum**, maliyet **₺0**.

### 3. Kategori: **Eğitim** (Bulmaca değil)
Bulmaca kategorisinde rekabet 10 kat fazla, abonelik toleransı 3 kat
düşük. Oyunun ölçüm vaadi Eğitim'de doğal duruyor.

### 4. Fiyat optimizasyonu değil, **indirme hacmi**
Duyarlılık analizi:
| Kaldıraç | Kâr etkisi |
|---|---|
| İndirme +%50 | **+%52** |
| Dönüşüm +1 puan | +%15 |
| Mağaza payı %15→%30 | −%12 |

Bütçe pazarlamaya gitmeli.

---

## TASARIM KARARLARI

### 5. Müzik: **prosedürel**, hazır mp3 değil
Bir müzik dosyası 2-3 MB ekler, telif riski taşır. WebAudio ile
bestelenen müzik **sıfır bayt** ve perdeye göre ton değiştirebiliyor
(Perde I huzurlu, Perde VII karanlık). Aynı motor, farklı mod.

### 6. Kolye: **SVG katman**, üretilmiş görsel değil
Üretilen rütbe görsellerinde kolye her seferinde farklı renkte çıkıyordu
(mor/turuncu karışımı). SVG `INK` anayasasından besleniyor → 10 rütbede
birebir aynı, sıfır bayt.

### 7. BT taşı: **elde değil, süzülen**
El konumu 10 görselde farklı (x %1,4 ile %10 arası, bazılarında el yok).
"Elin içine" koymak tutarsızlık üretiyordu. Süzülen enerji taşı hem
tutarlı hem hikayeye uygun: BT bir eşya değil, çağrılan bir güç.

### 8. Font: **kendi ürettiğimiz**
Google Fonts bağımlılığı kaldırıldı. 138 glif elle kontur koordinatlarıyla
çizildi. **7,7 KB**, Türkçe tam destek, çevrimdışı çalışır.
Marka hissi eğimden değil **köşe keskinliğinden** gelir (v2'de eğim
0.13→0.055 indirildi, okunabilirlik için).

### 9. Ses: gürültüden **sessizliğe**
Oyun başında ses *eklemek* yerine *kaldırmak* daha güçlü.
Menü sessiz → seçimde davul → açılışta epik → **ilk taşta tam sessizlik**.
Düşüş odağı kendiliğinden kuruyor.

### 10. Tek dosya: **index.html**
Motor, arayüz, çeviri, matematik aynı dosyada (~5900 satır).
Kurulum gerektirmez, tek dosya kopyalanarak yedeklenir, GitHub Pages'e
doğrudan yayınlanır.

### 11. Hikaye anları: **tam sayfa**, kart değil
360px kart "bildirim" gibi duruyordu. Tam ekran + Ken Burns + alttan
yükselen perde. Amaç: *"okumak için bile olsa indirsinler."*

### 12. Perde odakları: **ölçümle**, göz kararıyla değil
Görseller 720×1290, ekranda sadece %61'i görünüyor. Odak yanlışsa
karakterin kafası kesiliyor. Her görselin ilgi merkezi **parlaklık +
doygunluk ağırlıklı** hesaplandı, 12 panelin odağı düzeltildi.

---

## MİMARİ KARARLAR

### 13. Renk: **tek kaynak** (`INK`)
Bir zamanlar taşlar `INK`'ten, ruh kartları `SP_COL`'dan besleniyordu →
hava mor, ateş turuncu çıkıyordu. Artık hepsi tek yerden:
🔴 kırmızı · 🔵 mavi · 🟢 yeşil · ⚪ **beyaz**

### 14. Tahta yeniden çizilmez, **sınıf güncellenir**
Her tıklamada tüm tahta DOM'dan kuruluyordu (Sv60'ta 105 taş = 57ms +
reflow). `refreshLocks()` sadece iki CSS sınıfı değiştiriyor.
**Tepki: 273-354ms → 26-140ms.**

### 15. 200ms'den uzun her bekleme **görünür olmalı**
"Taşkıran Ol" butonundan sonra 2,5 saniye hiçbir şey olmuyordu; test botu
bunu donma sanıp 111 kez tıkladı. `tapBusy()` + `#tapVeil` eklendi.

### 16. Denetim: **tek dosya, dört göz**
11 ayrı test dosyası vardı, hiçbiri "yayına hazır mı?" sorusuna cevap
vermiyordu. `test/PATRON.js` patron/finansmancı/tasarımcı/grafiker
gözüyle bakar, **tek karar** verir.

### 17. Görsel denetimi: **galeri üret**
Bazı hatalar sayıyla yakalanamaz ("kaymış", "boğuk", "renk tutmuyor").
`batu/kontrol/SAHNE_GOZU.js` her sahnenin karesini alıp yan yana bir
HTML galeri üretir — insan gözüyle bakılacak tek dosya.

---

## ERTELENENLER

| İş | Neden ertelendi |
|---|---|
| 6 ten/saç varyantı | Piksel maskeleme kadın saçında başarısız; 30 varyant dosya şişkinliği |
| Element ustalığı renklenmesi | Gelire dokunmuyor; kozmetik ekonomisi kurulunca satılabilir |
| Denge Mührü | Aynı gerekçe |
| Paralaks, ortam sesi | "Güzel ama para getirmiyor, en sona" |
