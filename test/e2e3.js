/* Test 3 — DERIN KONTROL
   1) B4 cok katmanli seviyede gercekten kademeleniyor mu?
   2) Sv9 -> Sv10 gecisinde Perde II GERCEK OYNANISTA tetikleniyor mu?
   3) Kadin Taskiran tum yayda kendi gorselini goruyor mu?
   4) Onbellek: sw.js eski surumu servis ediyor mu? */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'https://stonebreaking.github.io/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0; const log = [];
const ok = (n, c, d) => { c ? pass++ : fail++; const l = `${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`; console.log(l); log.push(l); };
const info = s => { console.log('   ' + s); log.push('   ' + s); };

async function boot(page) {
  const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);
  for (let i = 0; i < 12; i++) {
    const s = await screen();
    if (s === 's-splash') break;
    if (s === 's-age') await page.locator('.agebtn').nth(2).click();
    else if (s === 's-auth') await page.locator('#authLocal').click().catch(() => { });
    else if (s === 's-newprof') { await page.locator('#npName').fill('Kanka').catch(() => { }); await page.locator('#npSave').click(); }
    else if (s === 's-profiles') { const a = page.locator('#profAdd'); if (await a.count()) await a.click(); else await page.locator('.prof').first().click(); }
    else break;
    await page.waitForTimeout(500);
  }
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(900);
  await boot(page);

  console.log('\n═══ A. B4 DERINLIK — COK KATMANLI SEVIYE (Sv40) ═══');
  await page.evaluate(() => { S.spirit = 'pyro'; S.sessions = 3; S.level = 40; S.acts = [0, 1, 2, 3]; save(); });
  await page.evaluate(() => startLevel());
  await page.waitForTimeout(1200);
  const layers = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.tile')];
    const rows = els.map(e => ({
      dep: parseFloat(e.style.getPropertyValue('--dep')),
      dsc: parseFloat(e.style.getPropertyValue('--dsc')),
      dsh: parseFloat(e.style.getPropertyValue('--dsh')),
      z: +e.style.zIndex
    }));
    const uniq = {};
    rows.forEach(r => { uniq[r.dep] = { dsc: r.dsc, dsh: r.dsh }; });
    return { n: els.length, uniq, maxZ: Math.max(...rows.map(r => r.z)) };
  });
  info(`tas: ${layers.n}, katman sayisi: ${Object.keys(layers.uniq).length}`);
  Object.entries(layers.uniq).sort((a, b) => a[0] - b[0]).forEach(([d, v]) =>
    info(`  dep ${(+d).toFixed(2)} -> olcek ${v.dsc}  golge ${v.dsh}px`));
  const deps = Object.keys(layers.uniq).map(Number).sort((a, b) => a - b);
  const sc = deps.map(d => layers.uniq[d].dsc);
  ok('B4: birden fazla katman var', deps.length >= 2, deps.length + ' katman');
  ok('B4: ust katman DAHA BUYUK', sc[sc.length - 1] > sc[0], `${sc[0]} -> ${sc[sc.length - 1]}`);
  ok('B4: ust katman DAHA UZUN GOLGELI',
    layers.uniq[deps[deps.length - 1]].dsh > layers.uniq[deps[0]].dsh,
    `${layers.uniq[deps[0]].dsh}px -> ${layers.uniq[deps[deps.length - 1]].dsh}px`);
  await page.screenshot({ path: SHOT + '/20_sv40_katmanlar.png' });

  console.log('\n═══ B. Sv9 -> Sv10 GERCEK OYNANISTA PERDE II ═══');
  await page.evaluate(() => { closeModal && closeModal(); S.level = 9; S.acts = [0]; S.lives = 3; save(); });
  await page.evaluate(() => startLevel());
  await page.waitForTimeout(900);
  info('Sv9 basladi, oynanip bitiriliyor...');
  await page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let g = 0;
    while (g++ < 500) {
      if (!G || G.over || G.tiles.every(t => t.dead)) break;
      if (G.busy) { await sleep(50); continue; }
      const live = G.tiles.filter(t => !t.dead && !t.inTray);
      const freeT = live.filter(t => isFree(t));
      if (!freeT.length) break;
      const cnt = {}; G.tray.forEach(t => cnt[t.face.id] = (cnt[t.face.id] || 0) + 1);
      let pick = freeT.find(t => cnt[t.face.id] >= 1);
      if (!pick) { const fc = {}; freeT.forEach(t => (fc[t.face.id] = fc[t.face.id] || []).push(t)); const tr = Object.values(fc).find(a => a.length >= 3); pick = tr ? tr[0] : freeT[0]; }
      pickTile(pick.i); await sleep(130);
    }
  });
  await page.waitForTimeout(2500);
  const lvNow = await page.evaluate(() => S.level);
  info('seviye simdi: Sv' + lvNow);
  const teaseReady = await page.evaluate(() => {
    const t = document.querySelector('#modalBox .storyTease');
    return t ? { txt: t.textContent.replace(/\s+/g, ' ').trim(), ready: t.classList.contains('ready') } : null;
  });
  if (teaseReady) { info(`tease: "${teaseReady.txt}"`); }
  ok('Sv10 tease "Yeni perde acildi" diyor', !!teaseReady && teaseReady.ready, teaseReady ? teaseReady.txt.slice(0, 50) : 'kart yok');
  await page.screenshot({ path: SHOT + '/21_sv10_tease.png' });

  // "Sonraki Seviye" -> Perde II gelmeli
  const nextBtn = page.locator('#modalBox .btn').first();
  info('"Sonraki Seviye" butonuna basiliyor...');
  await nextBtn.click();
  await page.waitForTimeout(1300);
  const sAfter = await screen();
  ok('PERDE II GERCEK OYNANISTA TETIKLENDI', sAfter === 's-story', 'ekran: ' + sAfter);
  if (sAfter === 's-story') {
    const p = await page.evaluate(() => ({
      ch: document.getElementById('stChapter').textContent.trim(),
      ti: document.getElementById('stTitle').textContent.trim(),
      img: document.getElementById('stImg').getAttribute('src').split('/').pop(),
      loaded: (() => { const i = document.getElementById('stImg'); return i.complete && i.naturalWidth > 0; })()
    }));
    info(`${p.ch} | ${p.ti} | ${p.img} | yuklendi:${p.loaded ? '✓' : '✗'}`);
    ok('Perde II dogru icerik', p.ti.includes('Mühür') && p.loaded);
    await page.screenshot({ path: SHOT + '/22_perde2.png' });
    await page.locator('#stNext').click(); await page.waitForTimeout(900);
    ok('Perde II sonrasi Sv10 oyunu acildi', await screen() === 's-game', await screen());
  }

  console.log('\n═══ C. KADIN TASKIRAN — TUM YAY ═══');
  await page.evaluate(() => { S.sex = 'female'; S.level = 1; S.acts = []; save(); show('s-legend'); renderDiary(); });
  await page.waitForTimeout(500);
  await page.locator('#diaryList .btn.wide').first().click();
  await page.waitForTimeout(900);
  const fImgs = [];
  for (let i = 0; i < 15; i++) {
    if (await screen() !== 's-story') break;
    fImgs.push(await page.evaluate(() => {
      const im = document.getElementById('stImg');
      return { f: im.getAttribute('src').split('/').pop(), ok: im.complete && im.naturalWidth > 0 };
    }));
    await page.locator('#stNext').click(); await page.waitForTimeout(550);
  }
  info('kadin yay: ' + fImgs.map(x => x.f + (x.ok ? '' : '✗')).join(' → '));
  const hasF = fImgs.filter(x => x.f.includes('_f.')).length;
  ok('kadin varyantlari kullanildi', hasF === 3, hasF + ' adet _f gorseli');
  ok('kadin yayinda tum gorseller yuklendi', fImgs.every(x => x.ok));
  await page.screenshot({ path: SHOT + '/23_kadin.png' });

  console.log('\n═══ D. ONBELLEK / SERVICE WORKER ═══');
  const swInfo = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'destek yok';
    const regs = await navigator.serviceWorker.getRegistrations();
    const caches_ = ('caches' in window) ? await caches.keys() : [];
    return { kayitli: regs.length, cacheler: caches_ };
  });
  info('service worker kaydi: ' + JSON.stringify(swInfo));
  ok('eski SW/cache sayfayi kilitlemiyor', !swInfo.kayitli || swInfo.kayitli === 0 || swInfo.cacheler.length === 0,
    JSON.stringify(swInfo));

  console.log('\n═══ E. HATA ═══');
  ok('JS hatasi yok', errors.length === 0, errors.slice(0, 3).join(' | ') || 'temiz');

  fs.writeFileSync('/home/user/kanka/test/sonuc3.txt', log.join('\n'));
  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi ═══`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
