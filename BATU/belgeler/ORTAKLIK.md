# 🤝 STONEBREAKING — Ortaklık ve Proje Beyanı

**Proje:** STONEBREAKING — Element Guardians
**Canlı adres:** https://stonebreaking.github.io/
**Depo:** https://github.com/stonebreaking/stonebreaking.github.io
**Belge tarihi:** 27 Temmuz 2026
**Geliştirme başlangıcı:** 26 Temmuz 2026

---

## 1. Bu belge ne için var?

Bu proje bir sohbet üzerinden yürütülüyor. Sohbet kaybolabilir, bağlam
silinebilir, oturum kapanabilir. **Bu belge kaybolmaz** — depoda durur,
geçmişi Git ile damgalıdır.

Amacı üç şey:
1. **Kimin ne yaptığını** kayıt altına almak
2. **Hangi kararların neden** alındığını korumak
3. Yeni bir oturum açıldığında **kaldığımız yerden** devam edebilmek

> Konuşma kaybolursa: önce bu dosyayı, sonra `DURUM.md` dosyasını oku.
> İkisi birlikte projenin tam hafızasıdır.

---

## 2. Taraflar ve roller

### Proje Sahibi — Kurucu Ortak
- Projenin **fikir sahibi** ve marka sahibi
- STONEBREAKING adının, Taşkıran karakterinin ve element temasının yaratıcısı
- Ürün yönü, oynanış hissi ve görsel beğeni konusunda **son karar mercii**
- Gerçek cihazda test eder, eksikleri bildirir
- GitHub deposunun sahibi

### Geliştirici Ortak — Tasarım ve Yapım
- **Oyun tasarımcısı** kimliğiyle: mekanik, matematik, seviye eğrisi, hikaye yapısı
- **Finansör/patron** kimliğiyle: hangi işin yapılacağına ticari gerekçeyle karar verir,
  gerekirse "bunu şimdi yapmayalım" der
- Tüm kodu yazar, tüm testleri kendisi yapar, her değişikliği yayına alır
- Kararlarını gerekçesiyle sunar; körü körüne uygulamaz

**Çalışma ilkesi:** Bu bir "yap denileni yap" ilişkisi değil. İki ortak da
itiraz edebilir, ikisi de gerekçe sunmak zorundadır.

---

## 3. Bağlayıcı marka kuralları

Bu kurallar tartışmaya kapalıdır ve her dilde geçerlidir:

| Kural | Açıklama |
|---|---|
| **STONEBREAKING** | Hiçbir dilde çevrilmez. Her zaman büyük harf, her zaman aynı. |
| **Taşkıran** | Avatar adıdır. İngilizce metinlerde de `Taşkıran` olarak kalır — Türkçe karakterleriyle. |
| **Yasak kullanımlar** | "Stonebreaker", "Taş Kıran", "TaşKıran" — hiçbiri kullanılamaz. |

---

## 4. Fikri mülkiyet

- **Marka, isim, karakterler ve hikaye:** Proje sahibine aittir.
- **Görseller:** Bu proje için üretilmiştir, projeye aittir. Yedekleri
  `yedek/gorseller/` klasöründe ve `.tar.gz` arşivlerinde korunur.
- **Kod:** Proje deposunda, Git geçmişiyle birlikte kayıtlıdır.
- **Matematik modeli:** `docs/math_model.py` — oyunla birebir senkron,
  `verify_sync()` ile 21 sabit sürekli denetlenir.

---

## 5. Ne inşa ettik? (27 Temmuz 2026 itibarıyla)

### Oynanış
- **100 seviyelik** üçlü eşleştirme motoru (mahjong-vari katmanlı tahta)
- Tohumlu (deterministik) tahta üretimi — aynı tohum, aynı tahta
- **Zincir kombo sistemi** (`CHAIN_MS=4500`) — gerçek motorla kalibre edildi
- Kombo → **zaman donar** (3'lü = 3sn, 5'li = 6sn)
- Enerji sistemi, ipucu, geri alma, sonsuz mod ("Arafta Koşu")

### Hikaye — 100 seviye = 100 an
- **10 perde** (tam sinematik): Sv1, 10, 20, 30, 40, 50, 60, 70, 85, 100
- **91 sahne** (günlük sayfası, daktilo efekti)
- **10 arc**, 32 benzersiz sahne zemini
- Açılış sinematiği: dört ruh uyanır → çekirdek çatlar → kolye çağırır
- Kadın oyuncu ayrı görsel varyantları görür

### Görsel kimlik
- Logo: fırça imzası + kırık taş dokusu + 4 element madalyonu
- **40 taş yüzü** dört aileden: Element, Yıldız, Rün, Rakam, Mühür
- Taş gövdesi: rün kazılı kumtaşı levha
- Rütbe evrimi: her cinsiyet için 5 kademe
- Dört ruh: Pyro (tilki), Aqua (yunus), Terra (panda), Zephy (kanatlı tavşan)

### Sistemler
- Profil yönetimi, taç + TOP10 sıralama, beğeni
- **Taşkıran Paneli**: bekle / ödüllü reklam / abonelik
- **Aile Karnesi** + Web Share ile paylaşım
- **Meydan Okuma** — asenkron PvP, sunucusuz, maliyet ₺0
- **Çekirdeğin Haritası** — bilişsel profil görselleştirmesi
- Üç katmanlı yedek sistemi

### Ölçülmüş performans
| Ölçüm | Değer |
|---|---|
| İlk taşa kadar geçen süre (TTF) | 9,2 sn / 11 dokunuş |
| Taşa basma tepki süresi | 26–140 ms (önce 273–354 ms idi) |
| Toplam görsel | 82 dosya, 7,5 MB |

---

## 6. Alınmış ticari kararlar

Bunlar gerekçeleriyle birlikte alındı, keyfi değil:

| Karar | Gerekçe |
|---|---|
| **iPhone çekilişi → HAYIR** | ₺650k maliyet, 10 mutlu / 10.742 küsen oyuncu. Başabaş için 62.216 organik indirme gerekir. Yerine **Taşkıran Onuru** (net +₺13.174). |
| **Canlı PvP → HAYIR** | Sunucu maliyeti + eşleştirme + çocuk güvenliği riski. Yerine **asenkron Meydan Okuma**: yıllık 39.139 organik indirme, maliyet ₺0. |
| **Kategori: Eğitim** | Bulmaca kategorisine göre rekabet 10 kat az, abonelik toleransı 3 kat yüksek. |
| **Müzik: prosedürel** | Hazır mp3 yerine WebAudio ile bestelendi. Sıfır bayt, sıfır telif riski, perdeye göre ton değiştirebiliyor. |

### İş modeli (baz senaryo)
| Gösterge | Değer |
|---|---|
| İndirme | 250.000 |
| MAU | 48.875 |
| ARPMAU | ₺7,13 |
| Aylık kâr | ₺333.249 |
| LTV/CAC | 2,5 |
| Geri ödeme | 3,0 ay |
| Başabaş | 2.105 MAU (~11.000 indirme) |

---

## 7. Açık işler

| Öncelik | İş | Engel |
|---|---|---|
| 🔴 1 | **Firebase + bulut kayıt** | Proje sahibinin ücretsiz hesap açması gerekiyor. Abonelik satmanın önündeki tek teknik engel. |
| 🟡 2 | Mağaza vitrini (ikon, ekran görüntüleri, tanıtım videosu) | — |
| 🟡 3 | İlk seans ödül eğrisi ölçümü | — |
| 🟢 4 | IQ kalibrasyonu (`POP_MEAN=1250` hâlâ varsayım) | 1000 gerçek oturum verisi gerekiyor |

---

## 8. Projeyi devralacak kişiye not

Bu depoyu eline alan biri şu sırayla okumalı:

1. **`ORTAKLIK.md`** (bu dosya) — kim, ne, neden
2. **`DURUM.md`** — teknik durum, hata tablosu, çözülmüş sorunlar
3. **`docs/TICARI_PLAN.md`** — gelir modeli ve viral motor
4. **`docs/YOL_HARITASI.md`** — yapım listesi, tamamlananlar işaretli
5. **`test/OKU.md`** — test paketi nasıl çalıştırılır

Kod tek dosyada: **`index.html`**. Motor, arayüz, çeviri ve matematik
aynı dosyada tutuldu — bilinçli bir karar. Sebep: kurulum gerektirmez,
tek dosya kopyalanarak yedeklenebilir, GitHub Pages'e doğrudan yayınlanır.

---

## 9. Doğrulama

Bu belgenin ve projenin gerçekliği şunlarla doğrulanabilir:

- **Git geçmişi:** 31+ commit, 26–27 Temmuz 2026 tarihli, her biri imzalı
- **Canlı site:** https://stonebreaking.github.io/ — çalışır durumda
- **Test paketi:** `test/` altında 9 dosya, hepsi canlı siteye karşı geçiyor
- **Görsel yedeği:** `yedek/gorseller/` — 82 dosya, MD5 parmak izleriyle

---

*"Her taş bir düşünce, her kırılış bir keşif."*

**STONEBREAKING** · Element Guardians
