# 📋 TALEP KÜTÜĞÜ

> Proje sahibinin bugüne kadarki **tüm istekleri** ve durumları.
> Hiçbir talep unutulmasın diye tutulur. ✅ bitti · 🟡 kısmen · ⬜ bekliyor

---

## 1. OYNANIŞ

| # | Talep | Durum | Kodda karşılığı |
|---|---|---|---|
| 1.1 | Üçlü eşleştirme, 100 seviye | ✅ | `MATCH_N=3`, `MAX_LEVEL=100` |
| 1.2 | Enerji sistemi, zamanla dolsun | ✅ | `ENERGY_MAX=3`, `REGEN_MIN=30` |
| 1.3 | Reklam izleyerek enerji | ✅ | `AD_MAX_DAY=5` |
| 1.4 | Taşkıran simgesiyle enerji paneli | ✅ | `openEnergyPanel()` |
| 1.5 | Kombo olunca zaman önemsizleşsin | ✅ | `freezeTime()` — 3'lü=3sn, 5'li=6sn |
| 1.6 | Taşlarda elementler eşit dağılsın | ✅ | `facePool()` dört aileden dönüşümlü |
| 1.7 | Nokta gibi semboller karışıyor | ✅ | Yıldız takımı takımyıldız çizgili |
| 1.8 | Sv100 sonrası devam | ✅ | Sonsuz mod "Arafta Koşu" |
| 1.9 | Taşa basma/tahtaya geçiş kasıyor | ✅ | 273-354ms → **26-140ms** (`refreshLocks`) |

## 2. HİKAYE

| # | Talep | Durum | Karşılığı |
|---|---|---|---|
| 2.1 | 100 sahne, her seviye bağlansın | ✅ | 10 perde + 91 sahne = **100 an** |
| 2.2 | Başlangıç hikayesi daha canlı | ✅ | `coldOpen` + dört ruh uyanışı + çekirdek çatlaması |
| 2.3 | Sv1'i bitirince hikaye yoktu | ✅ | Sv1 sahnesi eklendi |
| 2.4 | Her ruhun ayrı hikayesi | ✅ | `SPIRIT_PATH` — ruh başına 10 kişisel an |
| 2.5 | Anlar bildirim gibi değil tam sayfa | ✅ | 360px kart → tüm ekran + Ken Burns |
| 2.6 | Hikaye tek paragrafta saklansın | ✅ | `HIKAYE.md` |
| 2.7 | Perde görselleri kaymış | ✅ | 12 panelin odağı ölçümle düzeltildi |
| 2.8 | Senaryo-arayüz uyumu | ✅ | **Gölge Aynası** (`shadowMirror`) |

## 3. GÖRSEL & MARKA

| # | Talep | Durum | Karşılığı |
|---|---|---|---|
| 3.1 | Logo saintgreyhills tarzı fırça | ✅ | `logo.webp` |
| 3.2 | Kendi fontumuz, tüm karakterler | ✅ | **138 glif**, 7,7 KB, Türkçe tam |
| 3.3 | Font okunaklı olsun | ✅ | v2: eğim 0.13→0.055, S/t/n/2/3 yeniden çizildi |
| 3.4 | Kırmızı alev, mavi su, yeşil toprak, **beyaz hava** | ✅ | `INK` anayasası — tek kaynak |
| 3.5 | Avatar seçiminde 4 element | ✅ | `AVATARS=["🔥","💧","🌿","🌀"]` |
| 3.6 | Kadın/erkek yazısı hizasız | ✅ | Sabit yükseklik + flex |
| 3.7 | "Yeni Taşkıran" → STONEBREAKING | ✅ | 29 arayüz etiketi |
| 3.8 | Logoyu taşlara entegre et | ✅ | `brandRing` kırık halka + fırça vuruşu |
| 3.9 | BT taşı kahramanın eline | ✅ | `btTileSVG` — süzülen enerji taşı |
| 3.10 | Kolye element taşlarından, renk karışmasın | ✅ | `amuletSVG` — 4 element, 10 rütbede aynı |
| 3.11 | Hikaye sahneleri boş görünüyor | ✅ | `sceneHero` + konuşan ruh + marka imzası |
| 3.12 | Perde I'de logo yerine avatar | ✅ | `stHeroWrap` |
| 3.13 | Ruhların tahta arka planı farklı | ✅ | 4 sunak: `board_fire/water/earth/air` |
| 3.14 | Element taşlarında siyah kare | ✅ | Flood-fill ile saydamlaştırıldı |

## 4. SES

| # | Talep | Durum | Karşılığı |
|---|---|---|---|
| 4.1 | Hikaye müziği olsun | ✅ | WebAudio, dosyasız, perdeye göre ton |
| 4.2 | Başlangıç sesi yetersiz, aksiyon olsun | ✅ | `heroSting` + `drumStart` kalp atışı |
| 4.3 | İlk taşta sakin, odak önemli | ✅ | `focusChime` + davul susar → sessizlik |

## 5. SİSTEMLER

| # | Talep | Durum | Karşılığı |
|---|---|---|---|
| 5.1 | Profil silme/düzenleme/beğeni | ✅ | `renderProfiles()` |
| 5.2 | Taç + TOP10 sıralama | ✅ | `championId()`, şampiyon şeridi |
| 5.3 | PvP modu | ✅ | Asenkron **Meydan Okuma** (canlı PvP reddedildi) |
| 5.4 | Meydan okuma basit olsun | ✅ | Link + tek dokunuş |
| 5.5 | Linke tıklayınca ikisi aynı anda başlasın | ✅ | `duelLobby` — randevu damgası + geri sayım |
| 5.6 | Tek oturumluk IQ testi | ✅ | **Ölçüm Sınavı** — sabit tohum, herkese aynı tahta |
| 5.7 | Koruyucular ipucu/güzel söz versin | ✅ | **48 bilgelik sözü**, paylaşılabilir kart |
| 5.8 | Sözler basit kalmış | ✅ | 40→48, iki katmanlı yeniden yazıldı |
| 5.9 | Oyun içi geri tuşu | ✅ | `backBtn` + donanım geri (`popstate`) |
| 5.10 | Aile karnesi | ✅ | Canvas + Web Share |

## 6. BELGELER & GÜVENLİK

| # | Talep | Durum | Karşılığı |
|---|---|---|---|
| 6.1 | Görsellerin yedeği | ✅ | 3 katman: Git + açık klasör + `.tar.gz` |
| 6.2 | Ortaklığı meşrulaştıran metin | ✅ | `ORTAKLIK.md` |
| 6.3 | Tek dosyada indirilebilir yedek | ✅ | `STONEBREAKING_YEDEK_*.zip` (7,4 MB) |
| 6.4 | Fizibilite | ✅ | `FIZIBILITE.md` |
| 6.5 | Dört gözle denetleyen program | ✅ | **`test/PATRON.js`** |
| 6.6 | Batu klasörü, tüm talepler | ✅ | Bu klasör |

---

## ⬜ AÇIK İŞLER

| Öncelik | İş | Engel |
|---|---|---|
| 🔴 1 | **Bulut kayıt (Firebase)** | Proje sahibinin hesap açması |
| 🟡 2 | Mağaza vitrini (ikon, ekran görüntüleri, video) | — |
| 🟡 3 | Taş sembolleri hâlâ mahjong dilinde (rakam/harf) | Marka mührü eklendi, tam dönüşüm bekliyor |
| 🟢 4 | Rütbe görsellerindeki eski kristal | Görsel üretim limiti |
| 🟢 5 | IQ kalibrasyonu (`POP_MEAN=1250` varsayım) | 1000 gerçek oturum verisi |
| 🟢 6 | Aylık PDF rapor | Bulut kayıt gerektirir |
| 🟢 7 | Paralaks arka plan, ortam sesi | Gelire dokunmuyor, en sona |

---

## 🚫 BİLİNÇLİ REDDEDİLENLER

| İstek | Neden reddedildi | Yerine ne yapıldı |
|---|---|---|
| iPhone çekilişi | ₺650k; başabaş 62.216 organik install ister. 10 mutlu / 10.742 küsen. | **Taşkıran Onuru** → net +₺13.174 |
| Canlı PvP | Sunucu + eşleştirme + çocuk güvenliği riski | **Asenkron Meydan Okuma** → ₺0, 39k install/yıl |
| Hazır mp3 müzik | +2-3 MB yükleme, telif riski | **Prosedürel WebAudio** → 0 bayt |
| 6 ten/saç varyantı | Piksel maskeleme kadın saçında başarısız | Bütçe rütbe evrimine kaydırıldı |
