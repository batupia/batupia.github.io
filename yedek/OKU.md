# 🗄️ YEDEK — Görseller Kaybolmasın

Görseller projenin en pahalı parçası (AI üretimi, tekrar üretmek saatler alır
ve **birebir aynısı çıkmaz**). Üç katmanlı koruma var.

---

## Katman 1 — GitHub (asıl yedek)

Tüm `assets/` klasörü git deposunda. Her push ile GitHub'a gidiyor.
Bilgisayar, çalışma alanı, hatta bu sohbet kaybolsa bile görseller orada.

```bash
# Sıfırdan geri almak
git clone https://github.com/stonebreaking/stonebreaking.github.io.git
```

**Bu tek başına yeterli.** Aşağıdakiler ekstra güvence.

---

## Katman 2 — Sıkıştırılmış arşiv

`yedek/gorseller_YYYYMMDD.tar.gz` — tüm `assets/` klasörünün anlık kopyası.

```bash
# Yeni yedek al
bash yedek/al.sh

# Geri yükle
tar -xzf yedek/gorseller_20260727.tar.gz
```

Bu dosya da git'te, yani GitHub'da. İki kopya aynı yerde ama farklı biçimde —
biri bozulsa diğeri sağlam.

---

## Katman 3 — Manifest (bütünlük denetimi)

`yedek/manifest.txt` her görselin **MD5 imzasını** tutar. Bir dosya sessizce
bozulursa fark ederiz.

```bash
bash yedek/dogrula.sh
```

---

## Görsel envanteri

| Grup | Adet | Ne işe yarar |
|---|---|---|
| Hikaye panelleri (`ch*`, `a*`) | 14 | 10 perdenin tam ekran sinematikleri |
| Sahne zeminleri (`s_*`, `n01–n30`) | 36 | 90 sahnenin atmosferik arka planları |
| Maskotlar, rütbeler, ruhlar | ~26 | Taşkıran, 4 ruh, 5 rütbe × 2 cinsiyet |

**Toplam ~76 dosya.** Sahne görselleri **tembel yükleniyor** — ilk yükleme
602 KB'de kalıyor, hedef 1,5 MB'ın çok altında.

---

## Yeni görsel eklerken

1. `assets/story/` içine `.webp` olarak koy (640px genişlik, kalite 74)
2. `index.html` içindeki `ARCS` dizisinde ilgili arc'ın `bg` listesine ekle
3. Henüz üretilmediyse `MISSING_BG` kümesine yaz — havuzdan otomatik düşer
4. `bash yedek/al.sh` ile yedeği tazele
