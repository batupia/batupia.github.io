/* Test 6 — LOGO / BT TASI / MUZIK / SEMBOLLER
   Varsayilan olarak CANLI siteye vurur ki kullanici ayni anda gorebilsin. */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'https://stonebreaking.github.io/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log(`${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`); };
const info = s => console.log('   ' + s);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const errs = [], bad = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/vibrate/i.test(m.text())) errs.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().split('/').pop()); });
  const sc = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);

  console.log('URL: ' + URL);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  for (let i = 0; i < 12; i++) {
    const s = await sc(); if (s === 's-splash' || s === 's-story') break;
    if (s === 's-age') await page.locator('.agebtn').nth(2).click();
    else if (s === 's-auth') await page.locator('#authLocal').click().catch(() => { });
    else if (s === 's-newprof') { await page.locator('#npName').fill('Kanka').catch(() => { }); await page.locator('#npSave').click(); }
    else if (s === 's-profiles') { const a = page.locator('#profAdd'); if (await a.count()) await a.click(); else await page.locator('.prof').first().click(); }
    else break;
    await page.waitForTimeout(450);
  }
  await page.evaluate(() => { S.spirit = 'pyro'; S.sessions = 5; S.acts = [0, 1, 2]; S.level = 12; S.lives = 2; save(); show('s-splash'); refreshSplash(); });
  await page.waitForTimeout(700);

  console.log('\n=== A. LOGO ===');
  const logo = await page.evaluate(() => {
    const i = document.querySelector('#s-splash img.logo');
    return { src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight, ok: i.complete && i.naturalWidth > 0 };
  });
  info(`${logo.src} · ${logo.w}x${logo.h}`);
  ok('firca imzasi logosu yuklendi', logo.ok && logo.src.includes('logo.webp'));
  await page.screenshot({ path: SHOT + '/50_logo.png' });

  console.log('\n=== B. BT TASI ===');
  const bt = await page.evaluate(() => {
    const r = document.querySelector('#saveInfo .btRow');
    if (!r) return null;
    const imgs = [...r.querySelectorAll('img')];
    return { n: imgs.length, srcs: imgs.map(i => i.getAttribute('src').split('/').pop()), loaded: imgs.every(i => i.complete && i.naturalWidth > 0) };
  });
  info(bt ? `${bt.n} tas: ${bt.srcs.join(', ')}` : 'yok');
  ok('ana ekranda BT taslari', !!bt && bt.n === 3);
  ok('BT gorselleri yuklendi', !!bt && bt.loaded);
  ok('dolu/bos ayrimi (2 dolu 1 bos)', !!bt && bt.srcs.filter(x => x === 'bt_stone.webp').length === 2);

  await page.evaluate(() => openEnergyPanel(false));
  await page.waitForTimeout(900);
  const panel = await page.evaluate(() => {
    const x = document.getElementById('modalBox');
    return { txt: x.textContent.replace(/\s+/g, ' ').trim().slice(0, 100), imgs: x.querySelectorAll('.btRow img').length };
  });
  info('panel: ' + panel.txt);
  ok('BT paneli buyuk taslarla', panel.imgs === 3);
  ok('metinler BT diline gecti', panel.txt.includes('BT'));
  await page.screenshot({ path: SHOT + '/51_bt_panel.png' });
  await page.evaluate(() => closeModal());

  console.log('\n=== C. MUZIK ===');
  const mus = await page.evaluate(async () => {
    S.acts = []; S.level = 1; save();
    playAct(actAt(1), () => { });
    await new Promise(r => setTimeout(r, 900));
    return { on: MUSIC.on, hasGain: !!MUSIC.gain, screen: (document.querySelector('.screen.on') || {}).id };
  });
  info(`calisiyor:${mus.on} · ekran:${mus.screen}`);
  ok('hikaye acilinca muzik basladi', mus.on === true && mus.hasGain);
  const moods = await page.evaluate(() => [0, 3, 6, 9].map(id =>
    id + ':' + Object.keys(MOODS).find(k => MOODS[k] === moodForAct(id))).join(' '));
  info('perde tonlari -> ' + moods);
  ok('perdeye gore ton degisiyor', moods.includes('0:calm') && moods.includes('6:dark') && moods.includes('9:hope'));
  ok('muzik durdurulabiliyor',
    await page.evaluate(async () => { musicStop(0.2); await new Promise(r => setTimeout(r, 400)); return !MUSIC.on; }));
  ok('ses kapaliyken muzik baslamiyor',
    await page.evaluate(async () => { SOUND = false; musicStart(MOODS.calm); await new Promise(r => setTimeout(r, 300)); const v = MUSIC.on; SOUND = true; return !v; }));

  console.log('\n=== D. SEMBOLLER ===');
  await page.evaluate(() => { S.level = 22; S.lives = 3; save(); startLevel(); });
  await page.waitForTimeout(1600);
  ok('oyuna girince muzik susuyor', await page.evaluate(() => !MUSIC.on));
  const cols = await page.evaluate(() => {
    const set = new Set();
    document.querySelectorAll('.tile svg *').forEach(e => {
      const f = e.getAttribute('fill'), st = e.getAttribute('stroke');
      if (f && f !== 'none' && !f.startsWith('#fff')) set.add(f);
      if (st && st !== 'none' && !st.startsWith('#fff')) set.add(st);
    });
    return [...set];
  });
  info('renkler: ' + cols.join(' '));
  ok('semboller renkli', cols.length >= 5, cols.length + ' renk');
  await page.screenshot({ path: SHOT + '/52_tahta.png' });

  await page.evaluate(() => {
    const box = document.createElement('div'); box.id = 'probe';
    box.style.cssText = 'position:absolute;inset:0;z-index:999;background:#1a1430;display:flex;flex-wrap:wrap;align-content:flex-start;gap:6px;padding:12px;overflow:auto';
    [...ALLFACES.slice(0, 4), ...ALLFACES.slice(13, 22)].forEach(f => {
      const d = document.createElement('div');
      d.style.cssText = 'width:62px;height:84px;background:url(assets/tile_stone.webp) center/100% 100% no-repeat;display:flex;align-items:center;justify-content:center';
      d.innerHTML = faceSVG(f);
      const sv = d.querySelector('svg'); if (sv) { sv.style.width = '64%'; sv.style.height = '64%'; }
      box.appendChild(d);
    });
    const r = document.createElement('div');
    r.style.cssText = 'display:flex;gap:8px;align-items:flex-end;margin-top:10px;width:100%';
    r.innerHTML = btStone(true, 62) + btStone(false, 62) + btStone(true, 34) + btStone(false, 22);
    box.appendChild(r);
    document.getElementById('app').appendChild(box);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: SHOT + '/53_semboller.png' });
  await page.evaluate(() => { const p = document.getElementById('probe'); if (p) p.remove(); });

  console.log('\n=== E. HATA ===');
  ok('404 yok', bad.length === 0, bad.slice(0, 3).join('|') || 'temiz');
  ok('JS hatasi yok', errs.length === 0, errs.slice(0, 2).join('|') || 'temiz');
  console.log(`\n=== SONUC: ${pass} gecti, ${fail} kaldi ===`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
