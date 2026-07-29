# 💰 STONEBREAKING — Ticari Plan

**Finansör notu · 26 Temmuz 2026**
Bu dosya "oyunu nasıl güzelleştiririz"i değil, **"bu oyun nasıl para basar ve nasıl dilden dile dolaşır"**ı anlatır.

---

## 0. ACI GERÇEK ÖNCE

Mahjong/Match-3 kategorisi **dolu**. Bu kategoride "iyi oyun yapmak" seni kurtarmaz —
Zen Match'in pazarlama bütçesi bizim tüm bütçemizden büyük. Reklamla kazanamayız.

**O yüzden reklamla yarışmayacağız. Konuşulacak bir şey satacağız.**

Ürünümüzün rakiplerde **olmayan** üç şeyi var:

| Varlık | Rakipte var mı? | Neye çevrilir |
|---|---|---|
| **Ölçüm** (Chi Skoru, 4 alt zeka, IQ tahmini) | ❌ Yok | Paylaşılabilir kimlik + abonelik gerekçesi |
| **Aile hesabı** (tek telefon, 4 profil, çocuk modu) | ❌ Yok | 1 indirme = 3 kullanıcı, aile aboneliği |
| **Zihin Haritası** (kişiye özel takımyıldız) | ❌ Yok | Bedava dağıtım motoru |

Mahjong mekaniği bizim **ürünümüz değil** — ölçüm aracımız. Bunu karıştırırsak batarız.

---

## 1. NASIL DİLDEN DİLE DOLAŞIR — Viral Motor

İnsanlar oyunu paylaşmaz. İnsanlar **kendileri hakkındaki bir şeyi** paylaşır.
Kimse "şu mahjong oyununu oyna" demez; herkes "benim zihin haritama bak" der.

### V1 — Zihin Haritası zaten viral yakıtı, ama eksik ✅→🔧
Şu an paylaşılıyor ama **paylaşan bir şey kazanmıyor**. Eklenmeli:
- Paylaşım görselinin köşesinde **kişiye özel davet kodu**
- Kodla gelen biri Sv5'e ulaşınca **davet edene kalıcı ödül** (enerji değil — *kozmetik*: cübbe rengi, çerçeve)
- Kozmetik seçilmesi bilinçli: enerji verirsen ekonomiyi bozar, kozmetik verirsen **statü** verir, statü daha çok paylaştırır

### V2 — "Aile Sıralaması" kartı 🔥 *en yüksek getirili tek özellik*
Tek telefonda 4 profil zaten var. Haftalık **aile karnesi** üret:
> *"Bu hafta evin en hızlı zihni: Ayşe 🔥 · En iyi hafızası: Dedem 🌍"*

Bu kart WhatsApp aile grubuna atılır. Türkiye'de bir içeriğin yayılma yolu budur —
Instagram değil, **aile grubu**. Sıfır maliyet, en yüksek yayılma.

### V3 — Meydan Okuma ✅ *(yapıldı)*
Kullanıcı PvP istedi. **Canlı eşzamanlı maç reddedildi** — sunucu maliyeti,
eşleştirme sorunu ve çocuk hesaplarında güvenlik riski. Yerine **asenkron PvP**:

`SBK-1E2B354-RS-Taşkıran` → bu kod WhatsApp'a gider, karşı taraf yapıştırır,
**aynı tohum aynı tahtayı üretir**. Sunucu yok, hesap yok, eşleştirme yok.

> ⚠️ **Bu plan çalışmayan bir varsayıma dayanıyordu.** Metin "tahtalarımız
> tohumlu üretiliyor, bu bedava geliyor" diyordu ama üretim `Math.random()`
> kullanıyordu — aynı tohum aynı tahtayı **vermiyordu**. Tüm üretim `BRD.rnd`
> üzerine alındı, determinizm testle doğrulandı (Sv1–Sv105, %100).

**Düello skoru** Chi'den bağımsız: hız (lojistik eğri) %40 + isabet %25 +
kombo %20 + temizlik %15. Böylece düşük seviyeli oyuncu da yüksek seviyeliyi
yenebilir — rekabet adil.

**Viral değeri (temkinli varsayımlarla):**

| | |
|---|---|
| Haftalık davet | 9.775 |
| Haftalık yeni install | 753 |
| k-factor | 0,19 |
| **Yıllık organik** | **39.139 install** |
| UA karşılığı | ₺164.384 |
| Yıllık ek gelir | **₺408.904** |
| Geliştirme + sunucu | **₺0** |

### V4 — Utanç değil gurur eşiği
IQ düşükse asla gösterme. Her oyuncunun **en güçlü alt zekasını** öne çıkar:
> *"Sen bir Örüntü Ustasısın — insanların %8'i bu profilde."*

Herkes paylaşabileceği bir üstünlük bulur. Kimse kötü skorunu paylaşmaz; herkes bir kategoride birincidir.

---

## 2. NASIL PARA KAZANIR

### ❌ Yapmayacaklarımız (ve neden)
- **Reklam** — "çocuğum reklam görmesin" değer önerimizi yok eder. Zaten CPM ile bu kategoride kazanılmaz.
- **Enerji satışı** — aile güvenini kırar, ARPU'yu kısa vadede şişirip retention'ı öldürür.
- **Loot box / gacha** — çocuk hesabı olan üründe düzenleyici riski, itibar riski.

### ✅ Model: Aile Aboneliği (tek ürün, tek fiyat)

**STONEBREAKING AİLE — ₺149/ay veya ₺990/yıl**

| İçerik | Neden bunu satıyoruz |
|---|---|
| 4 profile kadar sınırsız enerji | Enerji *satmıyoruz*, **kaldırıyoruz** — dürüst his |
| Detaylı bilişsel rapor (aylık PDF) | Ebeveynin gerçekten istediği şey bu |
| Aile turnuvası + haftalık karne | Aboneliği aile ritüeline dönüştürür |
| Tüm kozmetikler | Statü |
| Sınırsız Zihin Haritası geçmişi | "Çocuğumun 6 aylık gelişimi" — **iptal ettirmeyen şey budur** |

**Neden abonelik, neden tek fiyat:**
Ebeveyn oyuna para vermez. Ebeveyn **çocuğunun gelişimine** para verir.
Çocuğun 6 aylık hafıza grafiğini gören ebeveyn aboneliği iptal edemez — grafik kesilir.
Bu, oyun sektörünün değil **eğitim sektörünün** retention'ıdır (%85+ yıllık, oyunlarda bu %20).

### 💎 İkinci gelir: "Taşkıran Sertifikası" — tek seferlik ₺79
60 oturum sonunda, güven aralığı daralınca üretilen **kişiye özel basılabilir sertifika**
(Zihin Haritası + 4 alt zeka + gelişim eğrisi). Tek seferlik, hediye edilebilir, çerçevelenir.
Ebeveynler bunu **duvara asar** — ve asılan her sertifika bir reklamdır.

### Sayılarla — `math_model.py` çıktısı (v2, düzeltilmiş)

> ⚠️ v1'de LTV hesabı `D30 × aile çarpanı` adımını atlıyordu ve LTV/CAC'yi
> **20 kat şişiriyordu** (29× gibi inanılmaz bir sayı çıkıyordu). Düzeltildi.

| | Temkinli | **Baz** | İyimser |
|---|---|---|---|
| Yıllık indirme | 120.000 | **250.000** | 500.000 |
| MAU | 23.460 | **48.875** | 97.750 |
| Abone dönüşümü | %2,5 | **%4,0** | %6,0 |
| Aktif abone | 586 | **1.955** | 5.865 |
| ARPMAU | ₺4,99 | **₺7,13** | ₺9,24 |
| Aylık gelir (net) | ₺117.011 | **₺348.249** | ₺902.831 |
| Aylık kâr | ₺102.011 | **₺333.249** | ₺887.831 |
| LTV / CAC | 1,7 | **2,5** | 3,2 |
| Geri ödeme | 4,3 ay | **3,0 ay** | 2,3 ay |

**Başabaş: 2.105 MAU.** Sunucu gideri ₺15.000/ay. Yani ~11.000 indirmede
maliyeti karşılıyoruz — risk düşük.

**Gelir kırılımı (Baz):** abonelik ₺206k · reklam ₺117k · sertifika ₺25k.

**Duyarlılık — hangi kaldıraç en güçlü:**

| Kaldıraç | Kâr etkisi |
|---|---|
| İndirme +%50 | **+%52** |
| Abone dönüşümü +1 puan | +%15 |
| Mağaza payı %15→%30 | −%12 |

> **Finansör notu:** En güçlü kaldıraç dönüşüm değil **indirme**. Bu yüzden
> 1 numaralı iş Aile Karnesi — reklam bütçesi değil, WhatsApp aile grubu.
> LTV/CAC 2,5 sağlıklı ama parlak değil; 3,0'ın üstüne çıkmanın tek yolu
> organik payı artırmak, yani viral döngü.

## 3. HANGİ KATEGORİDE YAYINLANACAĞIZ — kritik karar

Mağazada **"Oyun > Bulmaca"** kategorisine girersek Zen Match ile aynı ligde
boğuluruz. **"Eğitim"** kategorisine girersek:
- rekabet 10 kat az, edinme maliyeti düşük
- ebeveyn arama niyeti yüksek ("çocuk zeka oyunu")
- abonelik fiyat toleransı 3 kat yüksek
- ⚠️ ama "Eğitim" kategorisinde IQ iddiası **düzenleyici dikkat** çeker → dilimiz temkinli kalmalı (zaten öyle)

**Karar: Eğitim kategorisi, "bilişsel gelişim" dili, oyun gibi görünen ürün.**

---

## 4. SIRADAKİ 6 HAFTA — ticari önceliğe göre yeniden sıralanmış

Eski yol haritası *oyunculuk* önceliğine göreydi. Para gözüyle sıra değişiyor:

| Sıra | İş | Neden bu sırada |
|---|---|---|
| ~~**1**~~ | ~~V2 Aile Karnesi~~ ✅ | **Yapıldı** — haftalık karne kartı: her alt zekada evin birincisi + Evin Taşkıranı. Canvas, sıfır maliyet. Web Share API ile WhatsApp'a gider. Herkes bir dalda birinci çıkar (gurur eşiği), kimse utanmaz. |
| ~~**2**~~ | ~~V4 Gurur Eşiği~~ ✅ | **Yapıldı** — sonuç ekranında en güçlü dal ilan ediliyor, yüzdelik dilim popülasyon dağılımından türetiliyor. Kural: yüzde ancak ≤%50 ise gösterilir; üstünde teşvik metni çıkar — kimse utanmaz. |
| **3** | **E1+E2 Firebase + bulut kayıt** | Abonelik satacaksak hesap **zorunlu**. Bunsuz para alınamaz. |
| **4** | **V1 Davet ödülü** | E1 gerektiriyor, o yüzden burada. |
| **5** | **Aylık rapor (PDF)** | Aboneliğin *asıl ürünü*. |
| **6** | **D2 Günün Taşı** | Günlük dönüş kancası — retention. |
| **7** | Perde III–V hikaye | Hikaye artık motorda; içerik eklemek ucuz. |
| **8** | C2/C3/C5 sinematik | Güzel ama para getirmiyor. En sona. |

> **Bilinçli erteleme:** A5 element renklenmesi ve D6 Denge Mührü güzel işler
> ama gelire dokunmuyor. Kozmetik ekonomisi (V1 ödülleri) kurulunca birlikte gelecekler —
> o zaman **satılabilir** olacaklar. Şimdi yaparsak bedava dağıtmış oluruz.

---

## 4b. ÖDÜL POLİTİKASI — "iPhone çekilişi yapalım mı?"

**Soru:** İlk 100 seviyeye gelen 10 kişiye iPhone verelim mi?
**Finansör cevabı: HAYIR.** Matematik açık.

| | Çekiliş | **Onur Sistemi** |
|---|---|---|
| Maliyet | ₺650.000 | **₺4.500** |
| Mutlu olan | 10 kişi | **10.752 kişi** |
| Küsen | 10.742 kişi | 0 |
| Net etki | −₺650.000 | **+₺13.174** |

**Neden:** Simülasyon Sv100'e ulaşan oranı **%22** veriyor (seviye başı %1,5
bırakma). Baz senaryoda bu **10.752 kişi** demek. 10 kişiye ödül vermek,
10.742 kişiye "sen kaybettin" demektir — sadakat ödülü küskünlük üretir.

Ayrıca aynı ₺650.000 ile UA'ya girsek 154.762 install alırdık; çekilişin
başabaş noktası **62.216 organik install** — hiçbir çekiliş bunu getirmez.

**Bunun yerine — Taşkıran Onuru (Sv100'ü bitiren HERKESE):**
1. **Element Avatarı** unvanı + kalıcı altın çerçeve — ₺0
2. Adı oyunun **Efsaneler Duvarı**'nda — ₺0
3. **Fiziksel Taşkıran Sertifikası** — ilk 100 kişiye hediye (₺45/adet),
   sonrasında ₺79'a satın alınabilir → **kâr merkezi**

Duvara asılan her sertifika bir reklamdır. Çekiliş gider, onur gelir getirir.

---

## 4c. SONSUZ MOD — "Sv100'den sonra ne olacak?"

Sv100'de taş sayısı doygun (111 — telefonda okunabilirlik sınırı), Elo
tavanda (2400). Daha fazlası mümkün değil. Ama **10.752 kişiyi boşluğa
bırakamayız** — onlar en sadık, en çok ödeyen kitle.

**Arafta Koşu:** Seviye değil **tur**. Tahta boyu sabit, ama:

| Tur | Yüz çeşidi | Tepsi | Dağılım | Süre × |
|---|---|---|---|---|
| 1 | 31 | 7 | 9 | 0,95 |
| 5 | 35 | 6 | 9 | 0,78 |
| 10 | 40 | 6 | 9 | 0,55 |
| 20 | 40 | 5 | 11 | 0,55 |
| 40+ | 40 | 5 | 12 | 0,55 |

Tur 10'da süre/yüz/tepsi tavana vuruyor; sonrasında asıl zorluk kolu
**dağılım** oluyor (üçlüler tepside daha uzun bekliyor). Çözülebilirlik
gerçek motorla ölçüldü: **%95–100**.

Chi zaten tavanda olduğu için artık **ulaşılan tur** yarışıyor — sıralama
tablosu buradan besleniyor, rekabet sonsuz.

---

## 5. RİSKLER

| Risk | Karşılık |
|---|---|
| IQ iddiası düzenleyici/itibar riski | Dil zaten temkinli; "eğlence amaçlıdır" + güven aralığı görünür. Klinik iddia asla yok. |
| Çocuk verisi (KVKK/COPPA) | Veri cihazda. Bulut kaydı gelince çocuk profilinde **sadece ilerleme**, kişisel veri yok. |
| Kategori boğulması | Eğitim kategorisi + aile dili. Bulmaca kategorisine girmiyoruz. |
| Tek kişilik geliştirme | Motor veriyle besleniyor; içerik eklemek kod gerektirmiyor. Ölçeklenebilir. |

---

## 6. TEK CÜMLE

> Mahjong satmıyoruz. **Bir ailenin, kendi zihinleri hakkında konuşacağı bir şey** satıyoruz —
> ve o konuşma her yapıldığında bir kişi daha oyunu indiriyor.
