# 🖼️ STONEBREAKING — Görsel Yedeği

Bu klasör oyunun **tüm görsellerinin** GitHub üzerindeki açık yedeğidir.
Sıkıştırılmamıştır — her dosyaya tarayıcıdan tek tek bakabilir, tek tıkla indirebilirsin.

> **Neden hem burası hem `.tar.gz` var?**
> `gorseller_YYYYMMDD.tar.gz` arşivi tek dosyada tüm geçmişi tutar ama
> içine bakmak için indirip açman gerekir. Bu klasör ise **doğrudan
> GitHub'da görünür** — telefondan bile açıp bakabilirsin.
> İkisi birbirinin yedeği: biri bozulursa diğeri ayakta kalır.

---

## 📥 Tamamını nasıl indirirsin?

**Yol 1 — Tarayıcıdan (en kolay):**
Depo ana sayfasında yeşil **`Code`** düğmesi → **`Download ZIP`**.
Tüm proje iner, görseller `yedek/gorseller/` içindedir.

**Yol 2 — Tek klasör indirmek istersen:**
https://download-directory.github.io/ adresine şu bağlantıyı yapıştır:
```
https://github.com/stonebreaking/stonebreaking.github.io/tree/main/yedek/gorseller
```

**Yol 3 — Bilgisayardan:**
```bash
git clone https://github.com/stonebreaking/stonebreaking.github.io.git
```

---

## 📂 Klasörde ne var?

| Klasör / Dosya | İçerik |
|---|---|
| `logo.webp` · `logo.png` · `logo.jpg` | STONEBREAKING logosu — fırça imzası + kırık taş dokusu + 4 element madalyonu |
| `em_fire/water/earth/air.webp` | Dört element madalyonu (logonun etrafında yanıp söner) |
| `tile_stone.webp` | Taş gövdesi — rün kazılı kumtaşı levha (19 KB) |
| `bt_stone.webp` · `bt_stone_off.webp` | BT enerji taşı (dolu / boş) |
| `pyro.jpg` `aqua.jpg` `terra.jpg` `zephy.jpg` | Dört ruh: tilki, yunus, panda, kanatlı tavşan |
| `mascots/` | Taşkıran avatarları (erkek + kadın) |
| `ranks/` | Rütbe evrimi — her cinsiyet için 5 kademe (10 görsel) |
| `story/` | **50 hikaye görseli** — 10 perde + 32 sahne zemini |
| `bg_cosmos.jpg` · `bg_board.jpg` | Arka planlar (evren + oyun tahtası sunağı) |
| `hero_taskiran.png` · `taskiran.jpg` | Ana kahraman görselleri |
| `icon.jpg` | Uygulama ikonu |

**Toplam: 82 dosya, ~7,5 MB**

---

## 🔍 Bozulma kontrolü

Her dosyanın MD5 parmak izi `yedek/manifest.txt` içinde tutulur.
Bir dosyanın bozulup bozulmadığını anlamak için:

```bash
bash yedek/dogrula.sh
```

Yeni görsel eklendiğinde yedeği tazelemek için:

```bash
bash yedek/al.sh
```

---

## ⚠️ Bu klasörü silme

Görseller bu projenin en pahalı parçası — her biri tek tek tasarlandı.
Kod yeniden yazılabilir, görsel yeniden üretmek hem zaman hem para.
**Üç katmanlı korumamız var:** GitHub geçmişi + bu klasör + `.tar.gz` arşivi.
