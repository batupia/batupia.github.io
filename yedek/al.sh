#!/usr/bin/env bash
# Gorsellerin yedegini alir: hem ACIK KLASOR hem ARSIV + manifest.
#
# Iki katman neden?
#   yedek/gorseller/  -> GitHub'da dogrudan gorunur, telefondan bile acilir
#   *.tar.gz          -> tek dosyada tarihli anlik goruntu (son 3 tutulur)
# Biri bozulursa digeri ayakta kalir.
set -e
cd "$(dirname "$0")/.."
D=$(date +%Y%m%d)

# 1) Acik klasor yedegi: assets/ -> yedek/gorseller/ (aynen kopya)
rm -rf yedek/gorseller.tmp
mkdir -p yedek/gorseller.tmp
cp -r assets/. yedek/gorseller.tmp/
# OKU.md korunur (klasorun kendi aciklamasi)
[ -f yedek/gorseller/OKU.md ] && cp yedek/gorseller/OKU.md yedek/gorseller.tmp/OKU.md
rm -rf yedek/gorseller
mv yedek/gorseller.tmp yedek/gorseller

# 2) Arsiv yedegi
tar -czf "yedek/gorseller_$D.tar.gz" assets/

# 3) Parmak izleri
find assets -type f \( -name '*.webp' -o -name '*.png' -o -name '*.jpg' \) \
  -exec md5sum {} \; | sort -k2 > yedek/manifest.txt

# En yeni 3 arsivi tut, eskileri sil (depo sismesin)
ls -t yedek/gorseller_*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f

echo "acik klasor : yedek/gorseller/ ($(find yedek/gorseller -type f | wc -l) dosya)"
echo "arsiv       : yedek/gorseller_$D.tar.gz"
echo "manifest    : $(grep -c . yedek/manifest.txt) dosya damgalandi"
