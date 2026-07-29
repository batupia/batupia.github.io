/* Test 4 — YERLESIM DENETIMI
   Her panelde: gorsel metnin arkasinda kaliyor mu? Tasma var mi?
   Ayrica farkli ekran boyutlarinda kontrol. */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'http://localhost:8899/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log(`${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`); };
const info = s => console.log('   ' + s);

const SIZES = [
  { name: 'Pixel5   393x851', w: 393, h: 851 },
  { name: 'iPhoneSE 375x667', w: 375, h: 667 },   // en dar/kisa: en riskli
  { name: 'Tablet   768x1024', w: 768, h: 1024 },
];

(async () => {
  const browser = await chromium.launch();
  for (const sz of SIZES) {
    console.log(`\n═══ ${sz.name} ═══`);
    const ctx = await browser.newContext({ viewport: { width: sz.w, height: sz.h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(800);
    const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);
    for (let i = 0; i < 12; i++) {
      const s = await screen(); if (s === 's-splash') break;
      if (s === 's-age') await page.locator('.agebtn').nth(2).click();
      else if (s === 's-auth') await page.locator('#authLocal').click().catch(() => { });
      else if (s === 's-newprof') { await page.locator('#npName').fill('T').catch(() => { }); await page.locator('#npSave').click(); }
      else if (s === 's-profiles') { const a = page.locator('#profAdd'); if (await a.count()) await a.click(); else await page.locator('.prof').first().click(); }
      else break;
      await page.waitForTimeout(450);
    }
    await page.evaluate(() => { S.spirit = 'pyro'; S.level = 1; S.acts = []; save(); show('s-legend'); renderDiary(); });
    await page.waitForTimeout(400);
    await page.locator('#diaryList .btn.wide').first().click();
    await page.waitForTimeout(800);

    const results = [];
    for (let i = 0; i < 14; i++) {
      if (await screen() !== 's-story') break;
      const m = await page.evaluate(() => {
        const body = document.getElementById('stBody');
        const wrap = document.getElementById('stImgWrap');
        const title = document.getElementById('stTitle');
        const txt = document.getElementById('stText');
        const next = document.getElementById('stNext');
        const bR = body.getBoundingClientRect(), wR = wrap.getBoundingClientRect();
        const nR = next.getBoundingClientRect();
        const sec = document.getElementById('s-story');
        return {
          ti: title.textContent.trim(),
          sh: getComputedStyle(sec).getPropertyValue('--sh').trim(),
          focus: getComputedStyle(sec).getPropertyValue('--focus').trim(),
          imgBottom: Math.round(wR.bottom), bodyTop: Math.round(bR.top),
          overlap: Math.round(wR.bottom - bR.top),          // >0 ise gorsel metnin altina giriyor
          scrollable: body.scrollHeight > body.clientHeight + 2,
          overflow: body.scrollHeight - body.clientHeight,
          btnVisible: nR.bottom <= window.innerHeight + 1 && nR.top >= 0,
          txtCut: txt.scrollHeight > txt.clientHeight + 2
        };
      });
      results.push(m);
      if (i < 2 || m.ti.includes('Mühür')) await page.screenshot({ path: `${SHOT}/30_${sz.w}_${String(i + 1).padStart(2, '0')}.png` });
      await page.locator('#stNext').click();
      await page.waitForTimeout(500);
    }
    results.forEach((r, i) => info(`${String(i + 1).padStart(2)}. ${r.ti.padEnd(24)} sh=${r.sh.padStart(4)} ort=${String(r.overlap).padStart(4)}px  btn:${r.btnVisible ? '✓' : '✗'} kaydir:${r.scrollable ? '+' + r.overflow : 'yok'}`));
    ok(`${sz.name}: gorsel metnin arkasinda kalmiyor`, results.every(r => r.overlap <= 2), 'max ortusme: ' + Math.max(...results.map(r => r.overlap)) + 'px');
    ok(`${sz.name}: buton her panelde gorunur`, results.every(r => r.btnVisible));
    ok(`${sz.name}: metin kesilmiyor`, results.every(r => !r.txtCut || r.scrollable));
    ok(`${sz.name}: 13 panel gezildi`, results.length === 13, results.length + '');
    await ctx.close();
  }
  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi ═══`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
