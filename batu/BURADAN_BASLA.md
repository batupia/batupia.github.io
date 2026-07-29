# 🪨 BATU — STONEBREAKING Komuta Merkezi

> **Sohbeti kaybettiysen buradasın. Panik yok. Her şey burada.**
> Bu klasör, projenin hafızasıdır. Kod silinse, sohbet uçsa, bilgisayar
> değişse — bu dosyaları okuyan biri projeyi kaldığı yerden sürdürebilir.

**Son güncelleme:** 28 Temmuz 2026
**Canlı oyun:** https://stonebreaking.github.io/
**Depo:** https://github.com/stonebreaking/stonebreaking.github.io

---

## ⚡ 30 SANİYEDE DURUM

| | |
|---|---|
| **Ürün** | %85 hazır — oynanış, hikaye, ölçüm tam |
| **Canlı mı?** | Evet, çalışıyor |
| **Para kazanır mı?** | Evet — başabaş 2.105 MAU (~11.000 indirme) |
| **Tek kritik engel** | 🔴 **Bulut kayıt (Firebase) yok** → abonelik satılamaz |
| **Sıradaki iş** | Proje sahibi Firebase hesabı açacak |

**Denetim komutu:**
```bash
node test/PATRON.js
```
Dört gözle bakar (patron/finansmancı/tasarımcı/grafiker), tek karar verir.

---

## 📁 BU KLASÖRDE NE VAR?

| Dosya | Ne anlatır |
|---|---|
| **`BURADAN_BASLA.md`** | ⭐ Bu dosya — giriş noktası |
| **`ILISKI.md`** | Nasıl çalışıyoruz, kim ne yapar, kurallarımız |
| **`YOL_HARITASI.md`** | Nereye gidiyoruz, ne bitti, ne kaldı |
| **`TALEPLER.md`** | Proje sahibinin bugüne kadarki **tüm istekleri** ve durumları |
| **`KARARLAR.md`** | Alınan kararlar ve gerekçeleri |
| **`kontrol/`** | Sahneleri gerçek gözle denetleyen programlar |
| **`arsiv/`** | Ekran kareleri, raporlar |

### Kök dizindeki diğer belgeler
| Dosya | İçerik |
|---|---|
| `HIKAYE.md` | Hikayenin tek paragraf özü + karakterler + 10 perde |
| `ORTAKLIK.md` | Ortaklık beyanı, roller, fikri mülkiyet |
| `FIZIBILITE.md` | Ticari analiz, iş modeli, riskler |
| `DURUM.md` | Teknik günlük — her turda ne yapıldı |
| `docs/math_model.py` | Oyunla senkron matematik modeli |

---

## 🔑 ERİŞİM

> **Token bu dosyada TUTULMAZ.** GitHub'ın gizli tarama koruması depoya
> yazılan anahtarları engelliyor — ve haklı. Anahtar depoda dururken
> depo herkese açıksa, anahtar da açık demektir.

**Token nerede?** Proje sahibinde. Yeni oturumda asistana verilir.

Depoya bağlanma (TOKEN yerine gerçek anahtar konur):
```bash
cd kanka
git remote add origin https://x-access-token:TOKEN@github.com/stonebreaking/stonebreaking.github.io.git
git config user.name Taskiran
git config user.email taskiran@stonebreaking.dev
```

**Yeni token üretmek:**
GitHub → Settings → Developer settings → Personal access tokens →
Tokens (classic) → Generate new token → scope: `repo`

> ⚠️ Eski token sohbette düz metin geçtiyse iptal et. Bir anahtar bir
> kez görünür olduysa artık gizli değildir.

---

## 🚀 YENİ OTURUMDA NE SÖYLEMELİSİN?

Sohbeti kaybettiysen, yeni asistana şunu söyle:

> "STONEBREAKING adlı oyunu birlikte geliştiriyoruz. Depoda `batu/`
> klasörü var, oradaki `BURADAN_BASLA.md` ve `ILISKI.md` dosyalarını
> oku, kaldığımız yerden devam edelim. Sen hem oyun tasarımcısı hem
> finansör hem ortağımsın."

Sonra bu klasördeki dosyaları paylaş. Asistan projeyi tanır.

---

## 🧭 TEK CÜMLEYLE PROJE

> Dört elementin ruhları evrenin çekirdeğinde bir çember kurmuştu; biri
> güçlü olmak isteyince çember koptu, çekirdek bin taşa bölündü. Sen
> **Taşkıran**'sın: üç aynı taşı buluşturup içindeki düşünceyi serbest
> bırakıyor, her kırılışta zihninin bir ölçüsünü alıyorsun. Yolun
> sonunda Gölge çıkar — senin en güçlü yanın — ve yalnızca dört
> elementin dengesiyle dağılır.

**Oyunun tezi:** Tek dalda uzmanlaşan, her dalda dengeli olandan düşük skor alır. Bu hikayede de mekanikte de böyle. Ölçüldü: dengeli **1100**, tek dal **1060**.

---

*"Her taş bir düşünce, her kırılış bir keşif."*
**STONEBREAKING** · Element Guardians
