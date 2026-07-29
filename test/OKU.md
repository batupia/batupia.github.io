# 🧪 Test Paketi

Gerçek tarayıcıda (Playwright + Chromium), telefon boyutunda, uçtan uca test.

```bash
npm install playwright && npx playwright install chromium
node test/e2e.js      # ana akış + baştan sona hikaye zinciri   (17 test)
node test/e2e2.js     # "Yolculuğa Başla" + oynanış + B2/B4     (13 test)
node test/e2e3.js     # derin kontrol: katmanlar, Sv10, kadın   (11 test)
node test/layout.js   # 3 ekran boyutunda yerleşim denetimi     (12 test)
```

Varsayılan olarak **canlı siteye** karşı çalışır.
Yerel test için: `URL=http://localhost:8899/ node test/e2e.js`

Ekran görüntüleri `test/shots/` altına düşer.
