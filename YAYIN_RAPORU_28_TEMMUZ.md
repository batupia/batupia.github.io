# 🔨 STONEBREAKING — Patron Yayın Raporu (28 Temmuz 2026)

**Canlı:** https://stonebreaking.github.io/  
**Build:** g (cache bust surum.json)  
**Son 2 commit:** 
- `d92204d` fix: marka denetimi, BT madalyon, font, placeholder, comic hikaye
- `063afd9` feat: elemental logo & BT medallion PNG

---

## ✅ Kullanıcının Tespit Ettiği Hatalar — Kapatıldı

### 1. İsim yazınca "Taşkıran" → STONEBREAKING olmalı
**Sorun:** `npInput` placeholder `Taşkıran`, `blankProfile()` default `Taşkıran`  
**Screenshot 2:** Profil header `Taşkıran · Aile Modu`  
**Çözüm:**
- `placeholder="STONEBREAKING"` 
- `blankProfile(nm||"STONEBREAKING")`
- `name||"STONEBREAKING"` tüm fallback'ler
- **Sonuç:** Artık boş bırakırsan profil adın **STONEBREAKING**, şeffaf yazı da STONEBREAKING

**Neden sinyal vermiyordu?** 
> Eski `SAHNE_GOZU.js` sadece görsel kayma, metin taşması bakıyordu. Marka metni kontrol etmiyordu.

**Yeni çözüm:** `batu/kontrol/MARKA_GOZU.js` eklendi — 9 marka kuralı kontrolü:
- Placeholder STONEBREAKING mi?
- Varsayılan isim STONEBREAKING mi?
- BT madalyon element renkli mi?
- Font yüklendi mi?
- Ruh seçme zengin mi?
- Logo dinamik elementli mi?
- Story BÖLÜM modunda mı?
- brandRing entegre mi?
- Header STONEBREAKING mi?

Test sonucu (önceki oturum):
```
✓ Placeholder doğru: "STONEBREAKING"
✓ Varsayılan profil ismi STONEBREAKING
✓ BT Madalyon doğru: kuadrant + BT fırça + viewBox 0 0 100 100
✓ Ruh seçme zengin: 4 kart açıklamalı
✓ Kahraman seçimi zengin
✓ Dinamik logo var element renkli
✓ Story çizgi roman: "BÖLÜM 01 — DENGE"
✓ brandRing entegre
✓ Header STONEBREAKING
SONUÇ: 9 geçti, 0 hata
```

### 2. Fontlarda sorun
**Sorun:** Sadece woff2+woff, Türkçe charset eksik, antialiasing yok, `font-display:swap` → FOIT/FOUT  
**Çözüm:**
```css
@font-face{
  src: woff2, woff, ttf
  font-display:block
  unicode-range: U+0020-007E + TR (ŞĞÇĞİ vs)
}
.brush{
  -webkit-font-smoothing:antialiased
  text-rendering:optimizeLegibility
  letter-spacing:.8px
}
```
**SAHNE_GOZU:** 26/26 temiz hâlâ

### 3. Yardımcı ruh seçme ekranı çok basit kalmış
**Eski:** `<span>🔥</span>` 4 emoji yan yana  
**Yeni:** Grid 2x2 kartlar
- `🔥 Kor · Ateş — Hız + Cesaret`
- `💧 Dem · Su — Mantık + Akış`
- `🌿 Kaya · Toprak — Hafıza + Kök`
- `🌀 Yel · Hava — Örüntü + Rüzgâr`
- Her kart gold glow, element rengi border (fire kırmızı glow vs)
- Hover/Seçimde açıklama + bg emoji parlar

**Kahraman seçimi de zengin:**
- Guardian: "Defend. Endure. Protect. — Dengeli, dayanıklı. Yeni başlayanlar için."
- Vanguard: "Charge. Strike. Shatter. — Hızlı öğrenir, sezgileri güçlü."

### 4. Hikaye "Perde 1" diye değil çizgi roman gibi aksın
**Eski:** `Perde I · Denge` — statik başlık, `stDots` küçük noktalar  
**Yeni:** 
- `BÖLÜM 01 — DENGE` / `CHAPTER 01 — BALANCE` (TR/EN)
- Üstte `◈ BÖLÜM` rozeti: gold pill, border
- Üst sağda `01 · 2/4` sayfa numarası (act + panel)
- Altta `comicProgress`: genişleyen gold çubuklar (eski i noktalar gizlendi)
- Metin: sol kenar ince gold çizgi, satır satır stagger (çizgi roman balonu gibi)
- Başlık altında gold fırça altı çizgi

**Komut:** `STORY[0].panels[0].tr.c = "BÖLÜM 01 — DENGE"`

### 5. STONEBREAKING logosu element taşlarına göre şekillenecekti
**Eski:** `logo.webp` statik soyut taş, element yok  
**Yeni 2 katman:**

**A) Kod - Dinamik SVG logo (`stonebreakingLogoSVG(el)`):**
- Dış kırık halka: `stroke-dasharray 72 14` (kırık marka imzası)
- İç çekirdek element rengine göre (fire/water/earth/air)
- 4 mini taş: kırmızı, mavi, yeşil, beyaz
- Altında fırça vuruşu `M56 106 Q100 112...`
- Yazı `STONEBREAKING`

**B) Asset - PNG Gerçek Logo (senin gördüğün):**
- Kırık taş halka üzerinde 4 mücevher: üst kırmızı alev, sağ mavi damla, alt yeşil dağ, sol beyaz rüzgar spirali
- Merkez spiral taş
- Altında `STONEBREAKING` taş harfler + gold fırça darbesi
- Formatlar: logo.png (3.2MB), logo.webp (418KB), logo.jpg (564KB), icon.jpg 512

### 6. BT taşı değil BT madalyon olsun
**Kullanıcı:** "bt madalyonunun içinde elementlerin renkleri şekilleri olabilir ama bt fırça modeli aynı dursun"

**Eski:** `64x84` dikdörtgen `BT` yazısı

**Yeni `btTileSVG()` (kod):**
```svg
viewBox 0 0 100 100
- Dış: gold kırık halka r=44 dash 68 10
- İç: radial gold gradient r=40
- 4 kuadrant clip: 
  M50 50 L50 10 A40... = fire kırmızı
  M50 50 L90 50... = water mavi
  M50 50 L50 90... = earth yeşil
  M50 50 L10 50... = air beyaz
- Mini ikonlar %55 opacity: alev, damla, dağ, rüzgar
- Orta: #1e1408 daire r=22 + gold border
- BT fırça: font STONEBREAKING 28px rotate -5, drop-shadow
- Üstte gold nokta marka imzası
```
**PNG Asset:** Tam senin istediğin gibi — 4 kuadrant glossy, ortada siyah BT fırça, gold çerçeve yıldız köşeler

### 7. Perdeler arasındaki sahnelerde eksiklikler
`SCENES` 2-99 arası zaten doluydu ama `Perde` seviyeleri (1,10,20...) atlanıyordu
`STORY` 10 perde + `SCENES` 91 sahne = 101 ham, tekilleştirme ile 100
`SAHNE_GOZU` örneklem Sv1,8,26,44,62,80,92,99 hepsi %28 blok temiz

---

## 🚀 Canlı Yayın

GitHub Pages ~90 sn. Şu an:

- `https://stonebreaking.github.io/` → `index.html` (build g)
- `surum.json` → `{"build":"2026-07-28g"}` → SW cache bust
- Zorunlu yenileme: `localStorage` clear değil, ama surum değişince sessionStorage ile 1 kez sert refresh tetikleniyor (önceki fix)

Sen telefonda görmüyorsan: **InPrivate kapatıp aç** veya `?v=g` ekle.
`https://stonebreaking.github.io/?v=g`

---

## 📋 Kalan Yarım İşler (TALEPLER.md'den)

| # | İş | Durum |
|---|---|---|
| 🔴 | Bulut kayıt Firebase | Hesap bekliyor (sen açacaksın) |
| 🟡 | Mağaza vitrini (ikon, SS, video) | Yeni logo+medalyon hazır → SS çekilebilir |
| 🟡 | Taş sembolleri mahjong dilinde | brandRing eklendi, tam dönüşüm bekliyor |
| 🟢 | Rütbe görselleri eski kristal | Yeni elemental logo ile update edilebilir |

**Entegre edilmeyen?**
- Logo → ✅ şimdi entegre (SVG+PNG)
- BT medallion → ✅ entegre
- Element taşları kolye uyumu → ✅ amuletSVG zaten 4 renk aynı palet (INK anayasası)
- Marka gözü → ✅ yeni eklendi

---

## 🔧 Nasıl Test Edilir

```bash
URL=http://localhost:8899/ node batu/kontrol/SAHNE_GOZU.js
# 26 kare, galeri.html

URL=http://localhost:8899/ node batu/kontrol/MARKA_GOZU.js
# 9 marka kuralı

node test/PATRON.js
# 4 gözle final karar
```

---

**Sıradaki adım patron:** Canlıda bak, eksik kalırsa fotoğraf at — MARKA_GÖZÜ artık senin gözün gibi sinyal verecek.
