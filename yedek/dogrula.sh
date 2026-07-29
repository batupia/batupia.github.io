#!/usr/bin/env bash
# Manifest ile karsilastirip bozulan/kaybolan dosyayi bulur.
cd "$(dirname "$0")/.."
if [ ! -f yedek/manifest.txt ]; then echo "manifest yok, once: bash yedek/al.sh"; exit 1; fi
if md5sum -c yedek/manifest.txt --quiet 2>/dev/null; then
  echo "✅ tum gorseller saglam ($(grep -c . yedek/manifest.txt) dosya)"
else
  echo "⚠️  sorunlu dosyalar yukarida — GitHub'dan geri al:"
  echo "    git checkout HEAD -- assets/"
fi
