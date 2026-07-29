# 🎯 STONEBREAKING — Yapım Listesi

**Sürüm 3.0 planı** · 26 Temmuz 2026
Bütçe ve zaman gerçekçi tutuldu — hepsi kod/AI ile üretilebilir, dış stüdyo gerekmez.

---

## 0. MARKA KURALI (bağlayıcı)

> **STONEBREAKING** hiçbir dilde çevrilmez. Her zaman büyük harf, her zaman aynı.
> **Taşkıran** avatar adıdır — İngilizce'de de `Taşkıran` kalır.
> "Stonebreaker", "Taş Kıran", "TaşKıran" **yasak**.

✅ *Uygulandı:* EN çevirideki iki ihlal temizlendi (`the Stonebreaker` → kaldırıldı,
`Stonebreaker Certificate` → `Taşkıran Certificate`).

---

## A. MASKOT & KİMLİK

| # | İş | Neden | Efor |
|---|---|---|---|
| **A1** | **Erkek + Kadın Taşkıran** (üretildi ✅) | Erkek: fade saç + sakal, kurucuya benzer hatlar. Kadın: gür dalgalı bakır kızıl saç. Aynı cübbe, rün ve kolye — kardeş kimlik. | Bitti |
| ~~**A2**~~ | ~~Cinsiyet seçimi~~ ✅ | **Yapıldı** — profil oluştururken iki Taşkıran yan yana, seçilen altın çerçeveyle parlıyor. |
| **A3** | ~~6 ten/saç varyantı~~ ⏸ | **Ertelendi (bilinçli).** Piksel maskeleme kadın saçında güvenilmez çıktı (bukleler kaçıyor, kuşak yanlış boyanıyor). 30 varyant üretmek de dosya şişkinliği. Bütçe rütbe evrimine kaydırıldı — oyuncuya çok daha fazla değer veriyor. |
| ~~**A4**~~ | ~~Rütbe evrimi~~ ✅ | **Yapıldı** — her cinsiyet için 5 kademe (10 görsel, 699 KB WebP). Sv16/36/61/86'da otomatik değişir + kutlama kartı. |
| **A5** | **Element ustalığı renklenmesi** | Hangi elementte güçlüysen cübben o rengi alır. Kolyedeki 4 sembol dolar. | 1 gün |

---

## B. 3B GÖRSEL DİL (öncelik: yüksek)

> ✅ **Tahta arka planı senaryoya bağlandı:** yeşil çuha kaldırıldı.
> Artık Taşkıran taşları **arafta, süzülen antik rün sunağında** kırıyor.
> Açılış evreniyle kesintisiz aynı dünya.

Mevcut düz SVG taşlar işlevsel ama premium değil. Test görseli kanıtladı:
kabartmalı 3B taşlar oyunu **Vita Mahjong / Zen Match** ligine taşıyor.

| # | İş | Detay | Efor |
|---|---|---|---|
| ~~**B1**~~ | ~~40 taşın 3B üretimi~~ ✅ | **Yapıldı, v2 ile yenilendi** — kremsi mahjong gövdesi yerine artık **rün kazılı kumtaşı levha** (evrenin çekirdeğinden kopan taş). Perde V'teki uçuşan tabletler referans alındı: kalın dış çizgi, oyma çerçeve, çatlaklar, kalınlık kenarı. Tek gövde + vektör sembol. 19 KB WebP — eski PNG'den **%77 küçük**. |
| ~~**B2**~~ | ~~Taş durum katmanları~~ ✅ | **Yapıldı** — 5 durum: serbest (üst ışık çizgisi), kilitli (PNG siluetine maskelenmiş soğuk örtü — yüz artık okunuyor), seçili (altın hale + nabız), ret (kilitliye dokununca titreme), patlama karesi (beyaz flaş). |
| ~~**B3**~~ | ~~3B tepsi~~ ✅ | **Yapıldı** — ahşap yerine antik taş + altın çerçeve, uzay temasına uygun. | Bitti |
| ~~**B4**~~ | ~~Katman derinliği~~ ✅ | **Yapıldı** — her taş katman oranına göre `--dep` taşır: ölçek 0.955→1.02, gölge 3px→8px, parlaklık +%10. Tek CSS değişkeni, sıfır asset, sıfır maliyet. |
| ~~**B5**~~ | ~~Patlama efekti~~ ✅ | **Yapıldı** — canvas parçacık motoru, her element kendi fiziğiyle: ateş közleri yukarı yükselir (negatif yerçekimi), su damlaları hıza göre uzayıp düşer, toprak kayaları dönerek savrulur, hava sarmal çizerek dağılır. Şok dalgası + kombo ile güçlenme. 280 parçacıkta 61 FPS. |

---

## C. SİNEMATİK & ATMOSFER

| # | İş | Detay | Efor |
|---|---|---|---|
| 🟡 **C1** | **Açılış sinematiği** | Çekirdeği D5 ile birlikte **yapıldı** (3 panel + Ken Burns). Kalan: kareler arası hareketli geçiş + ses. | 1 gün |
| **C2** | **Paralaks arka plan** | Nebula katmanları telefon eğilince kayar (gyroscope) veya dokunmayla. Derinlik hissi. | 1 gün |
| **C3** | **Ruh giriş animasyonları** | Pyro zıplayarak, Aqua süzülerek, Terra ağır, Zephy dans ederek gelir. | 2 gün |
| **C4** | **Seviye geçiş sahnesi** | Rütbe atlarken kısa kutlama: kolye dolar, cübbe değişir. | 1 gün |
| **C5** | **Ortam sesi** | Uzay uğultusu + element ambiyansı. Şu an sadece efekt var, atmosfer yok. | 1 gün |

---

## D. İMZA ÖZELLİKLER *(benim eklemek istediklerim)*

Bunlar "bu da neymiş?" dedirtecek, kimsede olmayan şeyler:

| # | Özellik | Neden ilgi çeker |
|---|---|---|
| ~~**D1**~~ | ~~🌌 Zihin Haritası~~ ✅ | **Yapıldı** — canvas takımyıldız. Her alt zeka bir kol, skor arttıkça yıldız sayısı ve parlaklık artar. Dengesiz oyuncunun haritası tek kollu kuyruklu yıldıza benzer — denge teması görsel olarak anlatılıyor. Profil kimliğinden sabit tohum: harita kişiye özel ve değişmez. Web Share API ile paylaşım, desteklenmeyen cihazda PNG indirme. |
| **D2** | **🔮 Günün Taşı** | Her gün bir taş "uyanır", kırınca o günün bilişsel ipucunu verir ("bugün hafızan keskin"). 30 saniyelik günlük kanca. |
| **D3** | **👻 Geçmiş Benin** | Kendi eski oturumunun hayaleti yanında oynar. Kendi rekorunla yarışırsın — rakip gerekmez, sunucu gerekmez. |
| ~~**D4**~~ | ~~🪨 Kırılma Anı~~ ✅ | **Yapıldı** — ekran cam gibi çatlar (13 ışınsal zikzak çatlak), beyaz flaş, sonra üçgen cam dilimleri dönerek düşer. 1.8sn. Tetikleyici: her 10. seviye, rütbe atlama, ya da sürenin %75'inden fazlasını kullanmadan bitirme. |
| ~~**D5**~~ | ~~📜 Taşkıran Günlüğü~~ ✅ | **Yapıldı + tam yay tamamlandı** — veriyle beslenen panel motoru (`STORY[]`). **10 perde, Sv1→Sv100 tam hikaye yayı** (Denge → Kırılma → Çağrı → 4 ruhun kurtarılışı → Gölge → Çember → İlk Taşkıran → yeniden doğuş). Günlükten "Baştan Sona İzle" ile kesintisiz izlenir. Ken Burns zoom + fade. Atlanabilir; atlayan Günlük ekranından geri okur. Her sonuç ekranında bir sonraki perdeye ilerleme çubuğu = "bir el daha" motoru. |
| **D6** | **⚖️ Denge Mührü** | Dört elementi eşit geliştirirsen özel mühür. Tema ile mekaniği birleştiren gizli hedef. |
| **D7** | **🎴 Element Rezonansı** | Aynı elementten 3 üçlüyü üst üste patlatırsan ruh devreye girer, kısa bonus. Kombo derinliği. |

---

## E. TEKNİK BORÇ

| # | İş | Aciliyet |
|---|---|---|
| **E1** | **Gerçek Google girişi (Firebase)** | Şu an "yakında" diyor. Ücretsiz katman yeter. | Yüksek |
| **E2** | **Bulut kayıt** | Telefon değişince ilerleme gidiyor. E1 ile birlikte. | Yüksek |
| **E3** | **IQ kalibrasyonu** | POP_MEAN=1250 hâlâ varsayım. 1000 gerçek oturum sonrası yeniden hesapla. ✅ *Eşik düzeltildi:* metin "20 oturum" derken kod 5. oturumda açıyordu — artık `IQ_MIN_SESSIONS=20` tek kaynak, metin geri sayıyor. | Orta |
| **E4** | **Görsel bütçe** | 3B taşlar boyutu artıracak. WebP + lazy load şart. Hedef: <1.5 MB ilk yükleme. | Orta |
| **E5** | **Çevrimdışı mod** | Service worker şu an sadece cache temizliyor. Gerçek offline oynanış. | Düşük |

---

## F. ÖNERİLEN SIRA (finansman gözüyle)

Her fazın sonunda **gösterilebilir bir şey** olsun — yatırımcıya, mağazaya, teste.

### Faz 1 — Görsel sıçrama (1 hafta)
`B1 → B2 → B3 → B4 → A2 → A3`
**Çıktı:** Oyun premium görünüyor, herkes kendi Taşkıran'ını seçiyor.
*Neden önce bu: Mağaza ekran görüntüleri ve yatırımcı sunumu bununla çekilir.*

### Faz 2 — Karakter derinliği (1 hafta)
`A4 → A5 → D5 → D6`
**Çıktı:** İlerlemek görsel ödül veriyor, hikaye açılıyor.

### Faz 3 — İmza anlar (1.5 hafta)
`D1 → D4 → B5 → D2 → C4`
**Çıktı:** Paylaşılabilir Zihin Haritası + günlük kanca. Organik büyüme motoru.

### Faz 4 — Sinematik (1.5 hafta)
`C1 → C2 → C3 → C5`
**Çıktı:** İlk 30 saniye artık unutulmaz.

### Faz 5 — Altyapı (1 hafta)
`E1 → E2 → E4 → D3 → D7`
**Çıktı:** Hesap sistemi, bulut kayıt, kalıcılık.

**Toplam: ~6 hafta.**

---

## G. BÜTÇE NOTU

| Kalem | Klasik yol | Bizim yol |
|---|---|---|
| Karakter tasarımı (2 maskot + 6 varyant + 5 evrim) | 25.000 ₺ | AI + kod |
| 40 taş × 4 durum (160 asset) | 40.000 ₺ | AI + kod |
| Sinematik (20 sn) | 60.000 ₺ | AI kare + CSS |
| Ses tasarımı | 15.000 ₺ | WebAudio, dosyasız |
| **Toplam** | **~140.000 ₺** | **zaman** |

Nakit yakmadan stüdyo kalitesi. Tek maliyet: zaman.

---

## H. NE YAPMAYALIM (bilinçli hayır)

- ❌ **Çoklu oyunculu CANLI maç** — sunucu maliyeti + eşleştirme + çocuk güvenliği.
  ✅ Ama **asenkron PvP yapıldı**: Meydan Okuma kodu (`SBK-...`) aynı tohumu
  taşır, karşı taraf aynı tahtayı oynar. Rekabet hissi var, sunucu yok.
- ❌ **Reklam** — "çocuğum reklam görmesin" değer önerimizi yok eder.
- ❌ **Enerji satışı agresifleştirme** — aile güvenini kırar, abonelik modelimize zarar.
- ❌ **Native uygulama (Unity)** — şu an web sürüm yeterli. PWA ile mağazaya girilebilir. Erken optimizasyon.

