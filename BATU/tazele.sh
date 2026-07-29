#!/usr/bin/env bash
# BATU klasorunu tazeler: belgeleri, denetciyi ve gorselleri kopyalar.
# Her onemli degisiklikten sonra calistir:  bash BATU/tazele.sh
set -e
cd "$(dirname "$0")/.."

echo "📁 BATU tazeleniyor..."

# 1) Belgeler
cp -f HIKAYE.md ORTAKLIK.md FIZIBILITE.md DURUM.md BATU/belgeler/ 2>/dev/null || true
cp -f docs/TICARI_PLAN.md docs/YOL_HARITASI.md docs/OYUN_MATEMATIGI.md BATU/belgeler/ 2>/dev/null || true

# 2) Denetci + son rapor
cp -f test/PATRON.js BATU/denetim/ 2>/dev/null || true
cp -f test/patron_rapor.json BATU/denetim/ 2>/dev/null || true

# 3) Onemli ekran goruntuleri
for f in perde1 golge_aynasi menu_fix bilgelik2 lobi font3 sahne_bos; do
  cp -f "test/shots/$f.png" BATU/gorseller/ 2>/dev/null || true
done
cp -f test/shots/perde/p0_1_ch2_kirilma.png BATU/gorseller/perde_kirilma.png 2>/dev/null || true

# 4) Canli surum damgasi
if [ -f surum.json ]; then
  echo "surum: $(cat surum.json)" > BATU/SON_DURUM.txt
  echo "tarih: $(date '+%Y-%m-%d %H:%M')" >> BATU/SON_DURUM.txt
  echo "commit: $(git log --oneline -1 2>/dev/null || echo '-')" >> BATU/SON_DURUM.txt
fi

echo "   belgeler : $(ls -1 BATU/belgeler | wc -l) dosya"
echo "   denetim  : $(ls -1 BATU/denetim | wc -l) dosya"
echo "   gorseller: $(ls -1 BATU/gorseller | wc -l) dosya"
echo "   toplam   : $(du -sh BATU | cut -f1)"
echo "✅ BATU guncel"
