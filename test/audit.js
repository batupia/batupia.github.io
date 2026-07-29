/* TAM DENETIM — canli siteye karsi uctan uca gozden gecirme */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'https://stonebreaking.github.io/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0, warn = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log(`${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`); };
const wr = (n, d) => { warn++; console.log(`⚠️  ${n}${d ? '  — ' + d : ''}`); };
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

  console.log('URL: ' + URL + '\n');
  const t0 = Date.now();
  await page.goto(URL + '?cb=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1000);

  console.log('═══ 1. YUKLEME ═══');
  info(`sure: ${loadMs} ms`);
  ok('sayfa 3sn altinda yuklendi', loadMs < 3000, loadMs + 'ms');
  const bytes = await page.evaluate(() => performance.getEntriesByType('resource')
    .reduce((a, r) => a + (r.transferSize || 0), 0));
  info(`ilk yukleme: ${(bytes / 1024).toFixed(0)} KB`);
  ok('ilk yukleme < 1.5 MB (E4 hedefi)', bytes < 1536000, (bytes / 1024).toFixed(0) + ' KB');

  for (let i = 0; i < 12; i++) {
    const s = await sc(); if (s === 's-splash' || s === 's-story') break;
    if (s === 's-age') await page.locator('.agebtn').nth(2).click();
    else if (s === 's-auth') await page.locator('#authLocal').click().catch(() => { });
    else if (s === 's-newprof') { await page.locator('#npName').fill('Ortak').catch(() => { }); await page.locator('#npSave').click(); }
    else if (s === 's-profiles') { const a = page.locator('#profAdd'); if (await a.count()) await a.click(); else await page.locator('.prof').first().click(); }
    else break;
    await page.waitForTimeout(420);
  }

  console.log('\n═══ 2. YUZ DAGILIMI (Sv20) ═══');
  await page.evaluate(() => { S.spirit = 'pyro'; S.sessions = 5; S.acts = [0, 1, 2]; S.level = 20; S.lives = 3; save(); startLevel(); });
  await page.waitForTimeout(1500);
  const dist = await page.evaluate(() => { const c = {}; G.tiles.forEach(t => c[t.face.k] = (c[t.face.k] || 0) + 1); return c; });
  info(JSON.stringify(dist));
  const vals = Object.values(dist);
  const spread = Math.max(...vals) / Math.min(...vals);
  ok('bes aile de tahtada var', Object.keys(dist).length === 5, Object.keys(dist).join(','));
  ok('dengeli dagilim (max/min < 2)', spread < 2, 'oran ' + spread.toFixed(2));
  await page.screenshot({ path: SHOT + '/A1_tahta.png' });

  console.log('\n═══ 3. RUH TEPKILERI + ZAMAN DONMA ═══');
  const play = await page.evaluate(async () => {
    const sl = m => new Promise(x => setTimeout(x, m));
    const shouts = []; let froze = null, freezeAt = null;
    const el = document.getElementById('sayTxt');
    const obs = new MutationObserver(() => {
      const t = el.textContent.trim();
      if (t && !shouts.includes(t)) shouts.push(t);
    });
    obs.observe(el, { childList: true, subtree: true, characterData: true });
    for (let k = 0; k < 60; k++) {
      if (!G || G.over) break;
      if (G.busy) { await sl(60); continue; }
      const live = G.tiles.filter(t => !t.dead && !t.inTray), free = live.filter(t => isFree(t));
      if (!free.length) break;
      const cnt = {}; G.tray.forEach(t => cnt[t.face.id] = (cnt[t.face.id] || 0) + 1);
      let p = free.find(t => cnt[t.face.id] >= 1);
      if (!p) { const fc = {}; free.forEach(t => (fc[t.face.id] = fc[t.face.id] || []).push(t)); const tr = Object.values(fc).find(a => a.length >= 3); p = tr ? tr[0] : free[0]; }
      pickTile(p.i); await sl(130);
      if (G.freeze > 0 && froze === null) { froze = G.freeze; freezeAt = G.left; }
      if (G.bestCombo >= 3 && froze !== null) break;
    }
    obs.disconnect();
    return { combo: G.bestCombo, froze, shouts: shouts.slice(0, 8), timerCls: document.getElementById('hTime').className };
  });
  info('en iyi kombo: ' + play.combo);
  play.shouts.forEach(x => info('  💬 ' + x.slice(0, 62)));
  ok('ruhlar bagiriyor', play.shouts.length >= 2, play.shouts.length + ' replik');
  ok('kombo zamani donduruyor', play.froze !== null, play.froze ? play.froze + 'sn' : 'tetiklenmedi');
  await page.screenshot({ path: SHOT + '/A2_shout.png' });

  console.log('\n═══ 4. HIKAYE + CEKIRDEK LOGO ═══');
  await page.evaluate(() => { S.level = 1; S.acts = []; S.lives = 3; save(); startLevelStoried(); });
  // shatter efekti (~1.8sn) bitip perde acilana kadar bekle
  await page.waitForFunction(() => (document.querySelector('.screen.on') || {}).id === 's-story', { timeout: 8000 }).catch(() => { });
  await page.waitForTimeout(900);
  const core = await page.evaluate(() => {
    const c = document.getElementById('stCore'), g = document.getElementById('stCoreGlow');
    const w = document.getElementById('stImgWrap').getBoundingClientRect(), r = c.getBoundingClientRect();
    return {
      on: c.classList.contains('on'), glow: g.classList.contains('on'), loaded: c.complete && c.naturalWidth > 0,
      x: ((r.left + r.width / 2 - w.left) / w.width * 100).toFixed(1),
      y: ((r.top + r.height / 2 - w.top) / w.height * 100).toFixed(1)
    };
  });
  info(`logo merkez: %${core.x} / %${core.y}`);
  ok('cekirdek logosu gorunuyor', core.on && core.loaded);
  ok('hale katmani aktif', core.glow);
  ok('yatay ortalanmis', Math.abs(+core.x - 50) < 2, '%' + core.x);
  await page.screenshot({ path: SHOT + '/A3_perde1.png' });

  const chain = [];
  for (let i = 0; i < 5; i++) {
    if (await sc() !== 's-story') break;
    chain.push(await page.evaluate(() => ({
      t: document.getElementById('stTitle').textContent.trim(),
      img: (document.getElementById('stImg').getAttribute('src') || '').split('/').pop(),
      ok: (() => { const im = document.getElementById('stImg'); return im.complete && im.naturalWidth > 0; })()
    })));
    await page.locator('#stNext').click(); await page.waitForTimeout(520);
  }
  chain.forEach(c => info(`  ${c.t.padEnd(24)} ${c.img.padEnd(18)} ${c.ok ? '✓' : '✗'}`));
  ok('Perde I 4 panel + gorseller', chain.length === 4 && chain.every(c => c.ok));
  ok('hikaye sonrasi oyun acildi', await sc() === 's-game', await sc());

  console.log('\n═══ 5. GERI NAVIGASYONU ═══');
  await page.evaluate(() => { show('s-splash'); refreshSplash(); });
  await page.waitForTimeout(400);
  await page.locator('#goLegend').click(); await page.waitForTimeout(600);
  const bk = await page.evaluate(() => document.getElementById('backBtn').classList.contains('on'));
  ok('gunlukte geri dugmesi var', bk);
  await page.goBack().catch(() => { }); await page.waitForTimeout(700);
  ok('donanim geri sayfadan cikarmiyor', await sc() === 's-splash', await sc());

  console.log('\n═══ 6. BT ENERJI + ABONELIK ═══');
  await page.evaluate(() => { S.lives = 1; S.mode = 'family'; save(); refreshSplash(); openEnergyPanel(false); });
  await page.waitForTimeout(800);
  const en = await page.evaluate(() => {
    const x = document.getElementById('modalBox');
    return { imgs: x.querySelectorAll('.btRow img').length, bt: x.textContent.includes('BT'), clock: (document.getElementById('enClock') || {}).textContent || '' };
  });
  ok('BT taslari panelde', en.imgs === 3, en.imgs + ' tas');
  ok('geri sayim calisiyor', /\d\d:\d\d/.test(en.clock), en.clock);
  await page.evaluate(() => closeModal());

  console.log('\n═══ 7. TAC / SIRALAMA ═══');
  await page.evaluate(() => {
    const mk = (n, a, lv) => { const p = blankProfile(n, a, 'family', 'male'); p.level = lv; p.sessions = lv * 2; return p; };
    DB.profiles = [mk('Ortak', '🦊', 12), mk('Ayşe', '🐬', 31)];
    DB.active = DB.profiles[0].id; loadProfile(DB.active); S.spirit = 'pyro'; save(); refreshSplash();
  });
  await page.waitForTimeout(600);
  const ch = await page.evaluate(() => document.getElementById('champBar').textContent.replace(/\s+/g, ' ').trim());
  info('şampiyon: ' + ch);
  ok('tac + lider gorunuyor', ch.includes('👑') && ch.includes('Ayşe'));

  console.log('\n═══ 8. IQ ESIGI ═══');
  const iq = await page.evaluate(() => {
    const out = [];
    for (const n of [19, 20]) {
      S.sessions = n; S.level = 12;
      G = { level: 12, par: 100, left: 50, noTimer: false, tiles: [], tray: [], over: true };
      showResult(true, 5, null, false);
      const m = document.getElementById('modalBox').innerHTML;
      out.push(n + ':' + ((m.match(/font-size:19px;color:var\(--gold\)">([^<]*)</) || [])[1] || '?'));
    }
    return out.join('  ');
  });
  info(iq);
  ok('IQ tam 20 oturumda aciliyor', iq.includes('19:—') && !iq.includes('20:—'), iq);
  await page.evaluate(() => closeModal());

  console.log('\n═══ 9. HATA ═══');
  ok('404 yok', bad.length === 0, bad.slice(0, 3).join('|') || 'temiz');
  ok('JS hatasi yok', errs.length === 0, errs.slice(0, 2).join('|') || 'temiz');

  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi, ${warn} uyari ═══`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
