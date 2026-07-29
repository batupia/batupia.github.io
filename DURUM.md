# 📍 STONEBREAKING — Proje Durumu

> **Bu dosya konuşma kaybolursa devam edebilmek içindir.**
> Yeni bir sohbete başlarsan önce bunu oku, sonra `docs/YOL_HARITASI.md` ve
> `docs/TICARI_PLAN.md`'e bak. Her şey burada yazılı.

**Son güncelleme:** 26 Temmuz 2026
**Canlı:** https://stonebreaking.github.io/
**Depo:** https://github.com/stonebreaking/stonebreaking.github.io

---

## 1. PROJE NEDİR

Mahjong Solitaire mekaniğinin **element temalı, IQ ölçümlü, aile odaklı** evrimi.
Oyuncu **Taşkıran**'dır; dört element ruhunun rehberliğinde taş kırarak zihnini ölçer.

**Kritik konumlandırma kararı:** Mahjong bizim ürünümüz değil, **ölçüm aracımız**.
Rakiplerde olmayan üç varlığımız var: ölçüm (Chi/IQ), aile hesabı, Zihin Haritası.
Mağazada **Eğitim** kategorisine gireceğiz, Bulmaca'ya değil.

**Teknik:** Tek `index.html` (~2500 satır), sıfır bağımlılık, build yok, sunucu yok.
İlerleme `localStorage`'da. GitHub Pages'ten yayında.

---

## 2. ÇALIŞMA ŞEKLİMİZ

- Kullanıcı (proje sahibi) siteden kontrol eder, eksikleri söyler.
- Ben (asistan) hem **finansör** hem **oyun tasarımcısı** kimliğiyle hareket ederim:
  sadece "yap" denileni yapmam, ticari ve tasarımsal gerekçe sunarım,
  gerekiyorsa "bunu şimdi yapmayalım" derim.
- Kod yazılır → **Playwright ile gerçek tarayıcıda test edilir** → commit → push.
- Kullanıcı telefondan doğrular.

**Depo erişimi:** classic PAT (scope: `repo`) kullanıcı tarafından sağlandı.
Yeni oturumda token yoksa kullanıcıdan iste.

```bash
git remote add origin https://x-access-token:TOKEN@github.com/stonebreaking/stonebreaking.github.io.git
git config user.name Taskiran && git config user.email taskiran@stonebreaking.dev
```

---

## 3. TAMAMLANANLAR

### Görsel / oynanış
| Kod | İş | Not |
|---|---|---|
| A1 | Erkek + Kadın Taşkıran maskotu | `assets/mascots/` |
| A2 | Cinsiyet seçimi | profil oluştururken |
| A4 | Rütbe evrimi | 5 kademe × 2 cinsiyet, Sv16/36/61/86 |
| B1 | Taş gövdesi | **v2: rün kazılı kumtaşı levha** `tile_stone.webp` 19 KB |
| B2 | Taş durum katmanları | serbest/kilitli/seçili/ret/patlama |
| B3 | 3B tepsi | antik taş + altın çerçeve |
| B4 | Katman derinliği | `--dep` ile ölçek 0.955→1.02, gölge 3→8px |
| B5 | Patlama efekti | canvas parçacık, element başına farklı fizik |
| D1 | Zihin Haritası | canvas takımyıldız, paylaşılabilir |
| D4 | Kırılma Anı | ekran cam gibi çatlar |
| D5 | **Taşkıran Günlüğü + tam hikaye yayı** | aşağıda ayrıntı |
| C1 | Açılış sinematiği | çekirdeği yapıldı (Ken Burns + fade) |

### Hikaye motoru (D5) — en önemli sistem
`STORY[]` dizisi = veriyle beslenen panel motoru. **Yeni perde eklemek kod değil, veri.**

**100 HİKAYE ANI — her seviye bir sahne.** İki katman:
- **10 PERDE** (Sv1/10/20/30/40/50/60/70/85/100): tam ekran sinematik, kendi görseli
- **90 SAHNE**: seviye biter bitmez çıkan günlük sayfası — tek nefeslik bir an,
  daktilo etkisiyle beliren metin, arc'a göre değişen atmosferik zemin

> **Neden 100 ayrı büyük görsel değil:** 100 tam sinematik ≈ 15 MB + haftalarca
> üretim. Sahneler 6 atmosferik zemini paylaşıyor (599 KB toplam) ama **metni her
> seviyede farklı**. Oyuncu için sonuç aynı — her seviyede hikaye ilerliyor.

**10 perde, Sv1 → Sv100:**
| Perde | Sv | Konu |
|---|---|---|
| I | 1 | Denge → Kırılma → Çağrı → *Taş Nasıl Kırılır?* (4 panel) |
| II | 10 | İlk mühür çatlıyor |
| III | 20 | Pyro serbest — *"hız tek başına yetmez"* |
| IV | 30 | Donmuş okyanus — Aqua buzda |
| V | 40 | Boş sayfalar — Terra hafızasını yitiriyor |
| VI | 50 | Dinmeyen fırtına — Zephy kaosta |
| VII | 60 | **Kendi yansıman** — karanlık ikiz |
| VIII | 70 | Dördü bir arada — gölge ancak 4 elementle yenilir |
| IX | 85 | İlk Taşkıran — *"bir seçim yaptım, sen aynısını yapma"* |
| X | 100 | Çekirdek yeniden doğdu |

**Tematik omurga = oyunun matematiği.** Bileşik Chi formülü (aritmetik %75 +
harmonik %25) dengeli oyuncuyu ödüllendirir; hikayede de gölge *"ben senin en
güçlü yanınım, diğerlerine ne gerek var?"* der ve ancak dört element birlikte
kullanılınca yenilir. Oyuncu matematiği okumadan yaşayarak öğreniyor.

**Özellikler:** 4. panel tutorial ama efsanenin dilinde (kural okuma hissi yok) ·
her sonuç ekranında "bir sonraki perdeye N seviye" ilerleme çubuğu (**bir el daha
motoru**) · Günlük'ten "Baştan Sona İzle" ile 10 perde kesintisiz · atlanabilir ·
kadın oyuncu 3 `_f` varyantını görür · `?story=all` ile önizleme.

**Görseller:** 14 panel, hepsi depodaki maskotlar referans alınarak üretildi
(pyro/aqua/terra/zephy = tilki/yunus/panda/kanatlı tavşan + taskiran_male/female).
720px WebP, toplam ~1.5 MB, lazy-load.

### Denetimlerde bulunan ve düzeltilen hatalar
| Hata | Kök sebep | Çözüm |
|---|---|---|
| **Tahta deterministik değildi** | Ticari plan "tohumlu üretiliyor" diyordu ama üretim `Math.random()` kullanıyordu — V3 Meydan Okuma çalışamazdı | Tüm üretim `BRD.rnd` üzerine alındı; aynı tohum = aynı tahta (Sv1–Sv105 doğrulandı) |
| **math_model.py oyundan ayrışmıştı** | Model ÇİFT eşleşme varsayıyordu (oyun ÜÇLÜ), seviye formülleri ve fiyat eski | Tamamı senkronize edildi + `verify_sync()` 19 sabiti otomatik denetliyor, sapmada `exit(1)` |
| **LTV 20 kat şişikti** | Bir install doğrudan MAU sayılıyordu; `D30 × aile` adımı atlanmış. LTV/CAC 29 çıkıyordu | Düzeltildi → gerçek değer **2,5**. Geri ödeme metriği eklendi |
| **Kombo simülasyonu yanıltıyordu** | Basit olasılık modeli tepsi kısıtını yok sayıyor, komboyu 2× fazla gösteriyordu | Gerçek motorla (jsdom + `generateBoard`) 7 pencere × 3 beceri ölçüldü, `CHAIN_MEASURED` tablosuna işlendi |
| **Kombo hiç oluşmuyordu** → zaman dondurma ölü koddu | `checkMatch` her taş seçiminde `combo=0` yapıyordu | Combo artık **zincir**: `CHAIN_MS=4500` |
| **Hikayede çift tık çökmesi** | Son panelde `ST.act` null olurken buton aktif kalıyordu | `storyNext`/`storyFinish`/`paintPanel`'e null koruması |
| **Yüz dağılımı bozuktu** | `ALLFACES.slice(0,nF)` sıralı alıyordu → Sv20'de 9 yıldız, 0 mühür | `facePool()` dört aileden dönüşümlü çeker |
| **IQ eşiği metinle çelişiyordu** | Metin "20 oturum", kod `rho>=0.35` (5. oturum) | `IQ_MIN_SESSIONS=20` tek kaynak |
| **Semboller taşta küçük kalıyordu** | `viewBox` kare, taş dikey; `width:64%` sıkıştırıyordu | `viewBox 6 6 88 88` + %78 ölçek |

### Bu oturumda yapılanlar (son)
1. **IQ eşiği düzeltildi** — metin "20 oturum" diyordu ama kod `rho>=0.35`
   yani **5. oturumda** açıyordu. Artık `IQ_MIN_SESSIONS=20` tek kaynak.
   Metin geri sayıyor: *"20 oturum gerekir — 15 oturum kaldı"* (kanca).
2. **Semboller rün kazımasına çevrildi** — parlak çok renkli mahjong sembolleri
   yerine tek koyu kazıma tonu (`RUNE`), element rengi sadece hafif sızıyor.
3. **Başlangıç zorluğu artırıldı** — aşağıda ayrıntı.

### Zorluk eğrisi (yeni)
| | Eski Sv1 | Yeni Sv1 |
|---|---|---|
| Taş | 21 | **36** |
| Katman | 1 | **2** |
| Sembol çeşidi | 8 | **14** |

Formüller: `triplesOf: 11+26*(1-e^(-n/24))` · `layersOf: ≤8→2, ≤26→3, ≤60→4, else 5` ·
`facesOf: 7+üçlü*0.62` · telafi olarak `trayOf: ≤6→8` (öğrenme penceresi 3→6 seviye).

**Simülasyon (1300 tahta, %100 çözülebilir):**
| Sv | acemi %60 | orta %85 | usta %97 |
|---|---|---|---|
| 1 | %87 | %100 | %100 |
| 20 | %3 | %78 | %100 |
| 100 | %0 | %37 | %98 |

---

## 3b. FİNANSÖR KARARLARI (matematikle verildi)

| Soru | Karar | Gerekçe |
|---|---|---|
| **iPhone çekilişi?** | ❌ HAYIR | ₺650k, 10 mutlu / 10.742 küsen. Başabaş 62.216 organik install gerektirir. Yerine **Taşkıran Onuru**: herkese unvan+çerçeve (₺0), ilk 100'e fiziksel sertifika (₺4.500), sonrası ₺79 satılık → **net +₺13.174** |
| **Sv100'den sonra?** | ✅ Sonsuz Mod | Sv100'e ulaşan %22 = 10.752 kişi. **Arafta Koşu**: seviye değil tur; süre kısılır, yüz artar, tepsi daralır, sonra dağılım. Çözülebilirlik %95-100 |
| **En güçlü kaldıraç?** | İndirme (+%52) | Dönüşüm +1 puan sadece +%15. Büyüme reklam bütçesiyle değil **viral döngüyle** gelir |
| **PvP yapalım mı?** | ✅ Ama asenkron | Canlı maç = sunucu + eşleştirme + çocuk riski. **Meydan Okuma kodu** aynı tohumu taşır → aynı tahta. k=0,19, yıllık **39.139 organik install**, maliyet ₺0 |
| **IQ düşükse ne gösterilir?** | En güçlü dal | Yüzde ancak ≤%50 ise gösterilir; üstünde teşvik metni. Kimse utanmaz, herkes paylaşır |

## 4. SIRADAKİ İŞLER (ticari önceliğe göre)

> Eski yol haritası oyunculuk önceliğineydi. Para gözüyle sıra değişti.

| # | İş | Neden |
|---|---|---|
| ~~**1**~~ | ~~V2 Aile Karnesi~~ ✅ | **Yapıldı** — her alt zekada evin birincisi + Evin Taşkıranı. Canvas, sıfır asset. Web Share ile WhatsApp'a gider. Herkes bir dalda birinci (gurur eşiği). |
| ~~**2**~~ | ~~V4 Gurur Eşiği~~ ✅ | **Yapıldı** — sonuç ekranında en güçlü dal + yüzdelik dilim (normal dağılım CDF). %50 eşiği: üstünde sayı yerine teşvik metni. |
| **3** | **E1+E2 Firebase + bulut kayıt** | Abonelik satacaksak hesap zorunlu. |
| **4** | **V1 Davet ödülü** | Zihin Haritası'na davet kodu; ödül **kozmetik** (enerji değil — ekonomi bozulmasın, statü versin). |
| **5** | **Aylık rapor (PDF)** | Aboneliğin asıl ürünü. |
| **6** | D2 Günün Taşı | günlük dönüş kancası |
| **7** | Perde III–V metin cilası | motor hazır, içerik ucuz |
| **8** | C2/C3/C5 sinematik | güzel ama para getirmiyor, en sona |

**Bilinçli ertelenenler:** A3 (6 ten/saç varyantı — piksel maskeleme kadın saçında
başarısız), A5 (element renklenmesi), D6 (Denge Mührü). A5+D6 gelire dokunmuyor;
kozmetik ekonomisi kurulunca **satılabilir** olacaklar, şimdi yaparsak bedava dağıtırız.

---

## 5. GELİR MODELİ — `docs/math_model.py` v2 (denetlenmiş)

**Aile Aboneliği ₺149/ay veya ₺990/yıl** + **Taşkıran Sertifikası ₺79** (tek seferlik)
+ **ödüllü reklam** (asla zorunlu değil, çocuk modunda yok).

| | Temkinli | **Baz** | İyimser |
|---|---|---|---|
| İndirme / yıl | 120.000 | **250.000** | 500.000 |
| MAU | 23.460 | **48.875** | 97.750 |
| Aktif abone | 586 | **1.955** | 5.865 |
| ARPMAU | ₺4,99 | **₺7,13** | ₺9,24 |
| Aylık kâr | ₺102.011 | **₺333.249** | ₺887.831 |
| LTV / CAC | 1,7 | **2,5** | 3,2 |
| Geri ödeme | 4,3 ay | **3,0 ay** | 2,3 ay |

**Başabaş 2.105 MAU** (~11.000 indirme). Sunucu ₺15.000/ay.

**Duyarlılık:** İndirme +%50 → **kâr +%52** · Dönüşüm +1 puan → +%15 ·
Mağaza payı %15→%30 → −%12.
→ En güçlü kaldıraç **indirme**, dönüşüm değil. Bu yüzden büyüme reklam
bütçesiyle değil **viral döngüyle** gelir; Aile Karnesi bu yüzden 1 numaralı işti.

**Yapmayacaklarımız:** zorunlu reklam, enerji satışını agresifleştirme,
loot box, Unity/native (PWA yeterli).

## 6. TEST

```bash
npm install playwright
npx playwright install chromium
npx playwright install-deps chromium   # libnspr4 vb. eksikse şart

node test/audit.js    # TAM DENETİM — canlıya karşı, önce bunu çalıştır (19)
node test/e2e.js      # ana akış + 10 perdelik zincir      (17)
node test/e2e2.js     # Yolculuğa Başla + oynanış + B2/B4  (13)
node test/e2e3.js     # katmanlar, Sv10 tetikleme, kadın   (11)
node test/e2e4.js     # profil/taç/enerji/kanca            (25)
node test/e2e5.js     # logo/BT taşı/müzik/semboller       (14)
node test/layout.js   # 3 ekran boyutunda yerleşim         (12)
```
**Hepsi geçiyor.** Varsayılan canlı siteye vurur; yerel için `URL=http://localhost:8899/`.

`audit.js` en değerlisi: yükleme süresi + ilk yükleme boyutu, yüz dağılımı
dengesi, kombo/zaman dondurma, çekirdek logo hizası, geri navigasyonu,
BT paneli, taç/sıralama, IQ eşiği ve JS/404 hatalarını tek seferde ölçer.

⚠️ `node_modules` ve `.cache` snapshot'a girmiyor — yeni oturumda yeniden kur.

---

## 7. BİLİNEN AÇIKLAR

| Konu | Durum |
|---|---|
| Google girişi | "yakında" diyor, gerçek değil (E1) |
| Bulut kayıt | yok, telefon değişince ilerleme gider (E2) |
| IQ kalibrasyonu | `POP_MEAN=1250` hâlâ varsayım; 1000 gerçek oturum sonrası yeniden hesapla (E3) |
| Çevrimdışı mod | `sw.js` sadece eski cache temizliyor (E5) |
| Görsel bütçe | hikaye 1.5 MB; lazy-load var ama ilk yükleme hedefi <1.5 MB izlenmeli (E4) |

---

## 8. MARKA KURALI (bağlayıcı)

> **STONEBREAKING** hiçbir dilde çevrilmez, her zaman büyük harf.
> **Taşkıran** avatar adıdır, İngilizce'de de `Taşkıran` kalır.
> "Stonebreaker", "Taş Kıran", "TaşKıran" **yasak**.

Sanat yönü: chibi oran, cel-shaded, kalın koyu dış çizgi, altın rün süsleme,
mor kozmik arka plan, kumtaşı taşlar. Ruhlar **sevimli hayvanlar**
(tilki/yunus/panda/kanatlı tavşan) — soyut element formları değil.

## Açılış sinematiği (commit eda111d)

Kullanıcı: "Başlangıçtaki hikayeye giriş daha canlı bişey olmalı".
Önceki halinde ekran karanlıktan açılıyor, toz süzülüyordu ama sahnede
**hiçbir şey olmuyordu**. Artık metin ne anlatıyorsa ekranda o oluyor:

| Panel | Olay | Kod |
|---|---|---|
| 1 · Dört Ruh | Dört ruh sırayla uyanır (0,45sn arayla kendi renginde ışık), sonra altın halka çemberi kapatır | `fxCircle` + `FX_SPIRITS.denge` |
| 2 · Kırılma | Sarsıntı + beyaz flaş + 7 kırık ışık hattı çizilir + ruhlar dört uca savrulur + `SFX.shatter` | `fxShatter` + `FX_SPIRITS.kirilma` |
| 3 · Çağrı | Kahramanın göğsünde kolye iki kez nabız atar | `fxAmulet` |

- Metin artık `<br><br>` bloklarına ayrılıp **satır satır** akıyor (`stagger`)
- Soğuk açılış 2,4sn → **2,0sn**; efektler perde kalkarken başlıyor (`coldOff=1.6`)
- **Sıfır yeni görsel dosyası** — CSS + SVG, yükleme bütçesi (E4) korundu
- `prefers-reduced-motion` tüm efektleri kapatıyor
- Panel değişiminde `fxClear()` zamanlayıcıları öldürüp DOM'u boşaltıyor → sızıntı yok

**Yakalanan hatalar:** (1) `fxCrack` kapalı logoya `opacity:1` verip patlamanın üstünde hayalet bırakıyordu → `#stCore.on` seçicisi. (2) Efektler siyah perdenin altında olup bitiyordu → gecikme 900ms→1500ms.

Test: `node test/intro.js` (14 kontrol, canlıda geçiyor).

## Sv1 hikaye boşluğu + "değişiklik göremiyorum" (commit 6a13b17)

Kullanıcı iki şey bildirdi, ikisi de **gerçek hataydı**:

### 1. "Sitede değişiklik göremiyorum"
Kod canlıdaydı ama kullanıcı göremiyordu. **İki sebep:**
- `startLevelStoried` perdeyi yalnızca `!seenActs().includes(act.act)` ise oynatıyor. Kullanıcı Perde I'i çoktan izlemişti → açılış sinematiği ona **hiç açılmıyordu**.
- GitHub Pages `index.html`'i `cache-control: max-age=600` ile servis ediyor → yenilese bile 10 dk eski dosya.

**Çözüm:**
- Ana menüye `#goIntro` — "✦ Efsanenin Başlangıcını İzle". Yalnızca Perde I görülmüşse görünür (`refreshSplash`). Bitince oyuna değil **menüye** döner.
- `surum.json` + `BUILD` damgası: açılışta sunucu sürümü sorulur, değiştiyse `sessionStorage` korumasıyla **bir kez** sert yenileme. Artık yayına aldığımızı oyuncu anında görüyor.

### 2. "1. leveli bitirince 2. levele geçiyor, hikaye yok"
**Gerçek boşluk:** `SCENES` sözlüğü 2–99 arasını kapsıyordu. Perde seviyeleri (1,10,20…) hariç tutulmuştu ama **Sv1 hem perde hem de ilk zafer**. Sonuç: oyuncu ilk taşını kırıyor, oyunun en kritik "bu iş yürüyor" anında hikaye susuyordu.

- Sv1 sahnesi eklendi: *"Kolyem ısındı. Efsane doğruymuş — taş beni tanıdı."* (bg `n01`, açılış perdesiyle çakışmıyor)
- Sahne sayısı 90 → **91**, ham toplam 101 olunca `storyProgress()` **seviye bazında tekilleştirildi** → sayaç yine **100** (marka sözü korundu)
- 1–100 arası **boş seviye kalmadı** (doğrulandı)

Test: `node test/hikaye100.js` (11 kontrol), `node test/intro2.js` (12 kontrol) — canlıda geçiyor.

## UX turu — "insanlar indirmek için can atmalı" (commit 4fc2d71)

Hisle değil **ölçümle** başladım: yeni oyuncunun ilk taşı kırma süresini (TTF) botla ölçtüm.

### 🔴 Kritik bulgu: 2,5 saniyelik sessiz ölüm penceresi
"Taşkıran Ol ⚡" butonuna basıldıktan sonra `shatter()` animasyonu perde arkasında çalışıyor, **ekranda hiçbir şey değişmiyordu**. Test botu bunu donma sanıp **111 kez tıkladı**. Gerçek oyuncu ya aynısını yapar ya uygulamayı siler — hem de ilk 10 saniyede.

**Çözüm:** `tapBusy()` (buton kendini spinner'a çevirir) + `#tapVeil` (geçiş örtüsü). `show()` içinde `veilOff()` otomatik çağrılıyor, hiçbir geçişte takılı kalamaz. Kural: **200ms'den uzun her bekleme görsel olarak karşılanır.**

### Ana menü yeniden kurgulandı
Eskiden 5 eşit ağırlıkta buton vardı — yeni oyuncu nereye basacağını bilmiyor, dönen oyuncu nerede kaldığını göremiyordu.

- **Yolculuk Şeridi** (`renderJourney`): rütbe + seviye + enerji + "sıradaki perdeye N sunak" + ilerleme çubuğu + açılan an sayısı. Hiç oynamamışa vaat gösterir.
- Çubuk ile hedef metni **aynı şeyi** ölçüyor (bir sonraki perde). Önce çubuk toplam %, metin sunak sayısıydı — tutarsızdı.
- `btnStart` artık duruma göre değişiyor: **"Yolculuğa Başla"** / **"Yolculuğa Devam Et"**
- İkincil butonlar `#moreBox` içinde katlandı → ana eylem görünürlüğü korundu

**TTF sonucu:** 9,2 sn / 11 dokunuş. Sektör hedefi <30 sn, iyi durumdayız.

Test: `test/intro2.js` 16/16, `test/hikaye100.js` 11/11 — canlıda geçiyor.

## Görsel şov turu (commit fdc07c7)

### 1. Element renk anayasası — TEK kaynak
Kullanıcı: *"kırmızı alev, mavi su, yeşil toprak, hava beyaz — ana yapısı bu"*.
Önceden **hava mordu**, ateş turuncuya kaçıyordu; `INK` (taşlar) ile `SP_COL` (ruh kartları) ayrı renkler tutuyordu → karışıklık.

```js
INK = { fire:#b3261a/#ff7a45  water:#12579e/#4aa8e8
        earth:#1f6b3a/#57b96f  air:#5c6b78/#eef4fa }
```
`SP_COL` artık aynı paletin `ui` tonları. Sahne 1'deki ruh ışıkları da bu renklere çekildi.

### 2. STONEBREAKING.font — kendi yazı tipimiz
`tools/font_yap.py` her glifi **elle kontur koordinatlarıyla** çiziyor (hazır font kopyası değil).
- **138 glif**: büyük/küçük Latin, Türkçe (ç ğ ı İ ö ş ü), rakam, noktalama, ₺ €, Avrupa aksanları
- Çıktı: **WOFF2 7 KB** + WOFF + TTF
- Google Fonts bağlantısı **kaldırıldı** → harici bağımlılık yok, çevrimdışı çalışır
- Tasarım: fırça imzası (`SLANT=0.13`) + kırık taş keskinliği
- S/C/2/3/5 glifleri ilk üretimde kopuktu, kontur birleştirmesiyle düzeltildi

### 3. Hikaye anları TAM SAYFA
Kullanıcı: *"bildiri gibi değil de tam sayfa... okumak için bile olsa indirsinler"*.
360px kart → tüm ekran. Görsel `object-fit:cover` + 16sn Ken Burns, metin alttan yükselen perdenin üstünde. Yazı 15px→17.5px, satır aralığı 1.72.

### 4. Ruh sunakları — dört ayrı tahta
`board_fire/water/earth/air.jpg` üretildi, `applyBoardTheme()` ile seçilen ruha göre değişiyor. Merkez kasıtlı karanlık (taş okunurluğu), kenar detaylı. `--boardTint` ile element rengi kenardan sızıyor.

### 5. Ruh isimleri Türkçeleşti
Pyro→**Kor**, Aqua→**Dem**, Terra→**Kaya**, Zephy→**Yel**. 187 geçiş güncellendi. Dosya adları kasıtlı korundu (kırık bağlantı riski yok).

### 6. Arayüzde Taşkıran → STONEBREAKING
29 arayüz etiketi değişti. **Ayrım:** arayüz = STONEBREAKING, hikaye içi karakter adı = Taşkıran (proje sahibinin soyadı, korunur).

### 7. Sahne 1 çerçeve hatası
Kullanıcı bildirdi: alttaki iki ruh yazıya gömülüyordu. `focus` 34%→47%, metin bloğu üst sınırı 60%→46%. Dört ruh da görünüyor.

### 8. HIKAYE.md — tek paragraf yedek
Tüm anlatı tek paragrafta saklandı + karakter tablosu, 10 perde, tema-mekanik eşleşmesi, özgünlük gerekçesi. Çizgi roman/film uyarlaması için çekirdek belge.

## Doğum günü sürümü (commit 021a972)

### 1. Koruyucuların Bilgeliği — 40 paylaşılası söz
Kullanıcı: *"insanlar 'bu ne kadar güzel bir söz' deyip SS alsın, story atsın"*.

Her söz **iki iş birden** yapar: gerçek bir oynanış ipucu taşır **ve** tek başına alıntılanabilir bir aforizma gibi durur.

| Koruyucu | Alan | Örnek |
|---|---|---|
| Kor 🔴 | cesaret, an | *"Tereddüt de bir seçimdir — ve genelde en pahalısıdır."* |
| Dem 🔵 | sabır, akış | *"Su engeli aşmaz, etrafından dolaşır. Kilitli taşa direnme, yanına bak."* |
| Kaya 🟢 | kök, hafıza | *"Dağ acele etmediği için dağdır."* |
| Yel ⚪ | örüntü, mesafe | *"Örüntü, tesadüfün korktuğu şeydir."* |

- **Tam ekran kart**: koruyucu portresi + element rengi + STONEBREAKING imzası
- Kart, paylaşılan her ekran görüntüsünde marka taşır → bedava pazarlama
- `pickWisdom()` tekrar koruması: aynı söz üst üste çıkmaz (10 çekilişte 9 farklı)
- Her **3 seviyede bir** gösterilir — her seferinde çıksa değeri düşerdi

### 2. Element taşları yeniden üretildi
`em_fire/water/earth/air.webp` — kumtaşı levha üzerine kazınmış, renk anayasasına tam uyumlu: **kırmızı alev, mavi damla, yeşil kristal, beyaz sarmal**. Hava artık gerçekten beyaz (önce mordu), her biri küçük boyutta net okunuyor.

### 3. Ses dramaturjisi — macera girişi
Kullanıcı: *"oyunun başındaki ses yetersiz, bir maceraya giriş yapacağız... sonra ilk taş kırılacak, zaman daha sakin, odak önemli"*.

Üç katman eklendi, hepsi WebAudio (sıfır dosya):
- `heroSting()` — alçaktan yükselen testere dalgası + filtre süpürme + davul vuruşu
- `drumStart()` — kalp atışı davulu (güçlü/yankı/hazırlık deseni, 430ms), uzak çan
- `focusChime()` — oyun başında tek temiz iki nota

**Akış (test edildi):**
```
menü sessiz → seçim ekranı: davul girer → açılış perdesi: epic mod + davul
→ İLK TAŞ: davul susar, müzik 1.4sn'de söner → TAM SESSİZLİK = odak
```
`MOODS.epic` eklendi (root 130.81, geniş aralıklar, sawtooth) — yalnız açılış perdesinde.

**Tasarım gerekçesi:** gürültüden sessizliğe geçiş odağı kendiliğinden kurar. Oyun başında ses eklemek yerine *kaldırmak* daha güçlü.

## Font v2 + Marka Mührü + Derin Sözler + Meydan Okuma v2 (commit 253c92a)

### 1. Font okunabilirlik revizyonu
Kullanıcı: *"fontlar kötü olmuş, benim evrenime uysun AMA ANLAŞILIR olsun"*.

| Parametre | v1 | v2 | Neden |
|---|---|---|---|
| Eğim (SLANT) | 0.13 | **0.055** | Fazla yatıklık okumayı bozuyordu |
| x-yüksekliği | 500 | **545** | Küçük harfler ekranda kayboluyordu |
| Gövde (STEM) | 92 | **104** | Küçük puntoda inceydi |
| İnce (THIN) | 58 | **76** | Kontrast farkı 34→28, daha okunur |
| Halka çokgen | 28 | **44** | Yuvarlaklar köşeli görünüyordu |

**Yeniden çizilen glifler:** S, s, 2, 3, 5, T, t, Z, ?, ç/ş sedillası. Yaylarla çizilen formlar küçük puntoda kopuyordu → açık köşeli kontur diline geçildi (kazıma diline de daha uygun). Marka hissi artık eğimden değil **köşe keskinliğinden** geliyor.

### 2. Marka mührü taşlara işlendi
Kullanıcı: *"STONEBREAKING logomuzu da taşlarımıza entegre edelim"*.

Logoyu olduğu gibi basmak 64px'lik taşta okunmazdı. Bunun yerine logonun **dili** alındı:
- **Kırık halka** (`stroke-dasharray` ile iki çatlak boşluğu) — kırık taş teması
- **Fırça vuruşu** halkanın altında — logonun alt çizgisi
- **Altın çekirdek noktası** tepede

Element taşlarında tam mühür, diğer 36 taşta sağ altta ince marka izi (`BRAND_MARK`). İlk denemede halka sembolün üstüne biniyordu → r=37→41, viewBox 6→4 genişletildi.

### 3. Bilgelik sözleri derinleştirildi: 40 → 48
Kullanıcı: *"bilgelik sözleri de biraz basit olmuş gibi"*.

Her söz artık **iki katmanlı**: yüzeyde oynanış ipucu, altında felsefi gözlem.

> **Önce:** "Tereddüt de bir seçimdir — ve genelde en pahalısıdır."
> **Sonra:** "Tereddüt bir seçim değildir sanırsın. Oysa her tereddüt, kararı senin yerine zamana verir."

Uzun sözler için kart tipografisi uyarlandı: 90+ karakter `.long` (18px), 150+ `.xlong` (16.5px). En uzun söz (110 karakter) taşmadan sığıyor.

### 4. Meydan Okuma v2 — link + eşzamanlı başlangıç
Kullanıcı: *"meydan okuma yeri daha basit olsun ve bağlantıyı tıklayınca iki kişi aynı anda başlasın, başlamaya şu dakika kaldı gibi"*.

**Eski akış:** kod kopyala → gönder → oyunu aç → menü → Meydan Okuma → kodu yapıştır → oyna
**Yeni akış:** **linke dokun → geri sayım → ikisi birden başlar**

- `challengeLink()` koda **randevu zaman damgası** gömer (paylaşımdan +45 sn)
- `duelLobby()` tam ekran geri sayım: *"Ayşe karşı Ahmet"*, dev sayaç, son 3 saniyede davul vuruşu
- Sunucu **yok** — iki cihaz da aynı damgayı okur, gerçek dünya saatine bakar
- Geç kalan için geri sayım atlanır (tahta aynı, adalet skorla sağlanır)
- Linkle gelen **yeni oyuncu**: `PENDING_DUEL` ile profil kurulumundan sonra randevuya yönlendirilir
- Kabul ekranı sadeleşti: "Meydan Oku" / "veya" / "linki yapıştır"

**Test edildi:** iki tarayıcı, aynı link → lobi açıldı → sayaç işledi → ikisi de **aynı tahtada** (81 taş birebir eşleşti).

## Sahnede kahraman + BT taşı + kolye (commit 7c1a30b)

### 1. Boş sahne sorunu çözüldü
Kullanıcı: *"hikayelerin üzerinde bizim STONEBREAKING avatarımız da olsun, çok boş görüntü olmuş"*.

602 piksellik manzara vardı ama içinde kimse yoktu — oyuncu kendi yolculuğunu izlemiyordu. Eklenenler:
- `#sceneHeroWrap` — oyuncunun **rütbesine göre evrilen** Taşkıran'ı, yavaş süzülerek girer, hafif yüzer
- `#sceneSpirit` — ruh anlarında **konuşan koruyucu** sağda belirir ("Dem fısıldadı" derken Dem görünür)
- `#sceneBrand` — sağ üstte sessiz STONEBREAKING imzası (ekran görüntüsü paylaşılırsa marka da gider)

### 2. BT taşı kahramanın eline
Kullanıcı: *"benim kendi BT yazan taşımı STONEBREAKING'in eline ver"*.

Elindeki renksiz kristal yerine **BT kazınmış kumtaşı levha** kondu. Altın nabızla parlıyor (`btPulse`).

### 3. Kolye dört elementten — renk karışması bitti
Kullanıcı: *"kolyemizin detayı element taşlarından oluşsun, renk karışmasın"*.

**Karar: SVG katmanı, üretilmiş görsel değil.** Gerekçe:
- Üretilen görsellerde kolye her rütbede farklı renk çıkıyordu (mor/turuncu karışımı)
- SVG `INK` anayasasından besleniyor → **kırmızı alev üstte, mavi damla sağda, yeşil kristal altta, beyaz sarmal solda**, ortada altın çekirdek
- On rütbede de birebir aynı görünüyor
- Sıfır bayt, sıfır yükleme maliyeti

`paintHeroGear()` tek fonksiyon; ana menü, sahne ve yolculuk kartında aynı görünümü basıyor. `HERO_FIT` tablosu her rütbenin çerçevesine göre konum veriyor.

### 4. Yakalanan hata: kaybolan saydamlık
Rütbe görsellerini yeniden üretirken alfa kanalı düştü, arkalarında **dama tahtası deseni** basılı kaldı. Fark edildi, `git checkout` ile orijinaller geri alındı, çözüm SVG katmanına çevrildi. Orijinaller `/tmp/rank_backup` ve Git geçmişinde güvende.

**Not:** Görsel üretim limiti (oturum başına 10) doldu. Rütbe görsellerinin kendi içindeki kolye/kristal detayları bir sonraki turda düzeltilebilir — ama SVG katmanı zaten üstlerine bindiği için acil değil.

## Perde I'de logo → oyuncu avatarı (commit 9e26bbf)

Kullanıcı ekran görüntüsüyle sordu: *"sence burada logo değişmiş mi?"*

**Hayır, değişmemişti.** Önceki turda avatarı yalnızca **günlük sayfasına** (`playScene`) eklemiştim; **hikaye perdelerine** (`playAct`) eklememiştim. Perde I'de çemberin ortasında hâlâ logo duruyordu.

### Yapılanlar
- `#stHeroWrap` + `#stHero` katmanı hikaye ekranına eklendi
- Perde I panel 1'den `core:{...}` (logo) **kaldırıldı**, yerine `heroAt:{x,b,h}` kondu
- `paintPanel()` içinde: panelde `heroAt` varsa avatar sahneye girer, `paintHeroGear()` ile kolye + BT taşı üstüne binmiş olarak
- Avatar yavaş süzülerek girer (`stHeroIn`), sonra hafif yüzer (`stHeroFloat`)

### Neden yalnız panel 1?
Diğer 8 perdenin görsellerinde (`a20`–`a100`) **kahraman zaten çizili**. Avatar eklemek çift kahraman yaratırdı. Kontrol edildi, yalnız Perde I panel 1'de gerekliydi (orada logo vardı).

**Tasarım gerekçesi:** Logo bir marka işaretidir, sahnenin oyuncusu değil. Dört ruhun kurduğu çemberin merkezinde marka değil **oyuncunun kendisi** durmalı — hikaye onun hikayesi.

Test: panel 1'de avatar ✓ / logo kalktı ✓ / kolye + BT ✓, panel 2'de avatar kalkıyor ✓.

## Perde denetimi + senaryo-arayüz bağı (commit 1ac3662)

Kullanıcı: *"Perde I Kırılma'da görselde sorun var, kaymış. Perdeleri yeniden gözden geçir, baştan sona detaylı eksiklikleri ölç, gerçek gözle kontrol et."*

### Adım 1-2: Denetim aracı yazıldı
`test/perdeler.js` — 13 panelin **hepsini** tek tek açar, ölçer, kare alır:
görsel yüklendi mi, metin bloğu ne kadar yer kaplıyor, avatar/logo taşıyor mu, metin sığıyor mu.

### Adım 3-5: Kök sebep bulundu
Kırılma panelinde dört ruhun kafaları kesikti, alttaki ikisi hiç görünmüyordu.

Ölçüm: görsellerin doğal boyutu **720x1290**, ekran alanı **430x473** → dikeyde sadece **%61'i** görünüyor.
Sonra her görselin **ilgi merkezi** hesaplandı (parlaklık + doygunluk ağırlıklı):

| Görsel | Ölçülen merkez | Koddaki odak | Fark |
|---|---|---|---|
| ch2_kirilma | %49 | %38 | **11 puan yukarı kaymış** |
| ch10_muhur | %43 | %30 | 13 puan |
| a20 | %47 | %34 | 13 puan |
| a100 | %50 | %40 | 10 puan |

**12 panelin odağı** ölçülen değere çekildi.

### Adım 6-8: Metin bloğu
Tavan %46 → **%50**, ayrıca içeriğe göre punto: 250+ karakter `.long` (13.5px), 380+ `.xlong` (12.5px).
Testteki "10px taşma" uyarısının sahte alarm olduğu bulundu — `lnIn` animasyonunun `translateY(10px)` başlangıcı ölçüme karışıyordu. Bekleme 1500→2600ms, tolerans 12px.

**Sonuç: 13/13 panel temiz.**

### Adım 9-11: Gözle kontrol
Kırılma, Perde II (Mühür), Perde IX (İlk Taşkıran) tek tek incelendi — hepsi düzgün çerçevelendi.
Senaryo akışı taranıp arc-perde eşleşmesi doğrulandı (10/10 uyumlu), eski ruh adı kalıntısı yok (0), ruh yolu durakları perde seviyeleriyle çakışmıyor.

### Adım 12-14: 🔴 Asıl bulgu — senaryo ile arayüz kopuktu
Perde VII'de Gölge soruyor: *"Ben senin en güçlü yanınım. Diğer üçüne ne gerek var?"*
Perde VIII'de deniyor ki: *"Dördünü aynı anda kullandığında dağıldı."*

**Ama oyuncu böyle bir şey yapmamıştı.** Hikayenin tezi arayüzde karşılıksızdı.

**Çözüm — Gölge Aynası (`shadowMirror`):** Perde VII bitince oyuncunun kendi dört dalı çubuk grafikle gösterilir. En güçlü dal altın renkte öne çıkar, "çemberin bütünlüğü %N" hesaplanır. Gölge'nin iddiası oyuncunun **gerçek verisiyle** sınanır; Perde VIII'deki cümle artık bir gerçeğe dayanıyor.

### Ek: renk anayasası tamamlandı
`MIND_DIMS` ve `.bar` renkleri de anayasaya çekildi — hava hâlâ **mordu** (#8b7dd8), toprak ikonu 🌍 idi. Artık kırmızı/mavi/yeşil/**beyaz**, ikonlar 🔥💧🌿🌀.

**Test: 38/38 geçiyor** (perdeler 13, hikaye100 11, intro 14).

## PATRON — dört gözle tek denetim (test/PATRON.js)

Kullanıcı: *"oyun motorunuza hem patron hem finansmancı hem oyun tasarımcısı hem grafik tasarımcı gözüyle her işlemden sonra tek tek kontrolünü sağlayacak, eksikleri söyleyecek bir kod mu yapsak"*

**Sorun:** 11 ayrı test dosyası vardı (1477 satır). Her biri kendi dilinde konuşuyor, hiçbiri *"bu iş yayına hazır mı?"* sorusuna cevap vermiyordu.

**Çözüm:** Tek dosya, dört gözle bakan denetçi.

| Göz | Neye bakar |
|---|---|
| 🎩 **PATRON** | Oyun açılıyor mu, JS hatası, 404, sürüm damgası |
| 💰 **FİNANSMANCI** | Yükleme ağırlığı, gelir kapıları, viral motor, ilk seans ödülü |
| 🎮 **TASARIMCI** | TTF, dokunma tepkisi, bot seviye bitirebiliyor mu, **denge cezası**, hikaye kapsamı |
| 🎨 **GRAFİKER** | Logo çakışması, font, 13 perde taraması, 3 ekran boyutunda taşma |

### Kullanım
```bash
node test/PATRON.js                  # yerel
URL=https://... node test/PATRON.js  # canlı
node test/PATRON.js --hizli          # perde taramasını atla
```

Çıkış kodu **0 = yayınlanabilir**, **1 = engel var**. Sonunda tek karar verir:
> 🎩 PATRON KARARI: YAYINLA / YAYINLAMA

### İlk çalıştırma sonucu
```
geçen 19 · uyarı 0 · kritik 1
🎩 PATRON KARARI: YAYINLAMA.
   • Bulut kayıt yok → ABONELİK SATILAMAZ
```

**Doğruladığı ölçümler:** açılış 2,7sn · tahta 21ms · dokunma tepkisi 26ms · yükleme 2222 KB · denge cezası çalışıyor (dengeli 1100 > tek dal 1060) · 100 hikaye anı · 13 perde temiz · 3 ekran boyutu temiz.

**Değeri:** Artık her değişiklikten sonra tek komut. Dört farklı bakış açısı, tek karar. Kritik/uyarı ayrımı sayesinde "neyi şimdi düzeltmeliyim" sorusu kendiliğinden cevaplanıyor.

## Estetik denetimi — "kopyala yapıştır gibi duruyor" (commit a81b784)

Kullanıcı: *"hâlâ kolyede ve ana ekrandaki logoda elementlerin simgeleri kopyalayıp yapıştırılmış gibi, hiçbir estetik yok"* ve *"bu denetçi ne işe yarıyor, gerçek gözle baksın"*.

**Haklıydı — denetçi bunu göremiyordu.** "Piksel çakışması yok" demek "güzel" demek değildir.

### Gözle bakınca görülen 3 gerçek sorun

**1. Logo kendini tekrar ediyordu**
Logonun *kendisi* zaten dört elementi taşıyor (kırmızı alev, mavi damla, yeşil kristal, beyaz sarmal — hepsi taş madalyonların içinde çizili). Biz dışına **dört tane daha** koymuşuz. Aynı sembol iki kez, üstelik dışarıdakiler kare kutu içinde, logonun organik taş diliyle çatışıyor.
→ **Ek madalyonlar kaldırıldı.** Bir logo kendi kendini tekrar etmez.

**2. Logo kare kutu gibi duruyordu**
`logo.webp` **RGB** formatındaydı, saydamlığı yoktu. Köşeleri koyu lacivert (3,2,14) olduğu için arka plandan kopuk, yapıştırılmış görünüyordu.
→ Flood-fill ile koyu arka plan saydama çevrildi, kenarlar Gaussian blur ile yumuşatıldı (322.783 piksel).

**3. Kolye düz vektördü**
Karakter yumuşak gölgeli, altın işlemeli, değişken çizgi kalınlığında çizilmiş; kolye ise tek renk dolgu + düz kenardı. Çıkartma gibi duruyordu.
→ **Kolye v2:** her taşa radyal gradyan, çift katman altın çerçeve (kabartma), iç gölge filtresi, yumuşak uçlu semboller, ışık saçan çekirdek.
→ **BT taşı v2:** kalınlık kenarı, gradyan gövde, oyma çerçeve, çatlaklar.

### Denetçiye ESTETİK GÖZÜ eklendi
Artık üç yeni ölçüt var:

| Ölçüt | Nasıl ölçülüyor |
|---|---|
| **Saydamlık** | Görselin 4 köşesi canvas ile okunur; 3+ köşe opaksa "kare kutu gibi duruyor" |
| **Tekrar** | Logo etrafındaki ek sembol sayısı; 0'dan büyükse "tekrar" uyarısı |
| **Oran/konum** | Kolyenin karaktere göre yüzdesi; %26 üstü "orantısız", %36 altı "yüze giriyor" |

**Denetçi hemen işe yaradı:** kolyeyi %27 ölçüp "orantısız büyük" dedi. Sebep: yüzdeler kap genişliğine göre hesaplanıyordu ama kahraman görseli kaptan dardı (295px kap / 183px görsel). `paintHeroGear()` artık görsel/kap oranını ölçüp ölçeği düzeltiyor. Sonuç **%17** — oturmuş.

### Son durum
```
geçen 21 · uyarı 0 · kritik 1 (bulut kayıt)
🎨 GRAFİKER — temiz
   ✓ Logo arka plana karışıyor (köşeler saydam)
   ✓ Logo tekrarsız (etrafında ek sembol yok)
   ✓ Kolye oturmuş (y%47 · genişlik %17)
```
