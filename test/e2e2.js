/* Test 2 — KULLANICI SENARYOSU
   "Yolculuga Basla"ya basinca hikaye geliyor mu?
   Ve gercek oynanis: tas kirma, B2/B4 durumlari, seviye bitirme. */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'https://stonebreaking.github.io/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0; const log = [];
const ok = (n, c, d) => { c ? pass++ : fail++; const l = `${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`; console.log(l); log.push(l); };
const info = s => { console.log('   ' + s); log.push('   ' + s); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);

  console.log('\n═══ A. SIFIRDAN OYUNCU: "Yolculuga Basla" ═══');
  // onboarding
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
  ok('ana menu', await screen() === 's-splash');

  const st0 = await page.evaluate(() => ({ lv: S.level, acts: (S.acts || []).slice(), sp: S.spirit, ses: S.sessions }));
  info(`profil: Sv${st0.lv}, izlenen perde: [${st0.acts}], ruh: ${st0.sp}, oturum: ${st0.ses}`);

  await page.locator('#goStart').click();
  await page.waitForTimeout(900);
  let s1 = await screen();
  info('"Yolculuga Basla" -> ' + s1);

  // ruh secimi gelirse sec
  if (s1 === 's-pick') {
    info('ruh secim ekrani geldi, Pyro seciliyor');
    await page.locator('.spiritCard, .sp, [data-sp]').first().click().catch(async () => {
      await page.locator('#spiritGrid > *').first().click();
    });
    await page.waitForTimeout(400);
    await page.locator('#pickGo').click();
    await page.waitForTimeout(800);
    // hosgeldin modali
    const mb = page.locator('#modal.on .btn').first();
    if (await mb.count()) { await mb.click(); await page.waitForTimeout(900); }
    s1 = await screen();
    info('ruh secildikten sonra -> ' + s1);
  }

  ok('HIKAYE ACILDI (Perde I)', s1 === 's-story', 'ekran: ' + s1);
  if (s1 === 's-story') {
    const p1 = await page.evaluate(() => ({
      ch: document.getElementById('stChapter').textContent.trim(),
      ti: document.getElementById('stTitle').textContent.trim(),
      btn: document.getElementById('stNext').textContent.trim()
    }));
    info(`ilk panel: ${p1.ch} | ${p1.ti}`);
    ok('sayac YOK (tekil perde)', !p1.ch.includes('/'), p1.ch);
    await page.screenshot({ path: SHOT + '/10_yolculuk_hikaye.png' });
    // 4 paneli gec
    for (let i = 0; i < 4; i++) { await page.locator('#stNext').click(); await page.waitForTimeout(600); }
  }
  const sGame = await screen();
  ok('hikaye sonunda OYUN acildi', sGame === 's-game', 'ekran: ' + sGame);
  await page.screenshot({ path: SHOT + '/11_oyun.png' });

  console.log('\n═══ B. B2/B4 TAS DURUMLARI ═══');
  const tiles = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.tile')];
    const cs = e => getComputedStyle(e);
    return {
      n: els.length,
      free: els.filter(e => e.classList.contains('free')).length,
      locked: els.filter(e => e.classList.contains('locked')).length,
      deps: [...new Set(els.map(e => e.style.getPropertyValue('--dep')))].sort(),
      scales: [...new Set(els.map(e => e.style.getPropertyValue('--dsc')))].sort(),
      shadows: [...new Set(els.map(e => e.style.getPropertyValue('--dsh')))].sort(),
      transform: cs(els[0]).transform,
      hasBg: cs(els[0]).backgroundImage.includes('tile_stone')
    };
  });
  info(`tas: ${tiles.n} (serbest ${tiles.free}, kilitli ${tiles.locked})`);
  info(`--dep degerleri: ${tiles.deps.join(', ')}`);
  info(`--dsc olcekler : ${tiles.scales.join(', ')}`);
  info(`--dsh golgeler : ${tiles.shadows.join(', ')}`);
  ok('taslar olustu', tiles.n > 0, tiles.n + ' tas');
  ok('B4: katman derinligi uygulanmis', tiles.deps.length >= 1 && tiles.scales[0] !== '');
  ok('B2: serbest/kilitli ayrimi var', tiles.free > 0);
  ok('tas govdesi (kumtasi WebP) yuklu', tiles.hasBg);

  // kilitli tasa tikla -> nope animasyonu
  const lockedCount = tiles.locked;
  if (lockedCount > 0) {
    const nope = await page.evaluate(async () => {
      const el = document.querySelector('.tile.locked');
      el.click();
      await new Promise(r => setTimeout(r, 80));
      return el.classList.contains('nope');
    });
    ok('B2: kilitli tasa dokununca titriyor (nope)', nope);
  } else info('kilitli tas yok (Sv1 tek katman) — nope testi atlandi');

  // serbest tasa tikla -> sel sinifi
  const selWorks = await page.evaluate(async () => {
    const el = document.querySelector('.tile.free');
    if (!el) return 'yok';
    el.click();
    await new Promise(r => setTimeout(r, 40));
    return el.classList.contains('sel');
  });
  ok('B2: secilen tas altin hale aliyor (sel)', selWorks === true, String(selWorks));
  await page.waitForTimeout(600);

  console.log('\n═══ C. GERCEK OYNANIS: SEVIYE BITIRME ═══');
  // motoru kullanarak cozucuyle bitir: ayni yuzden 3'unu bul, tepsiye at
  const played = await page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let clicks = 0, guard = 0;
    while (guard++ < 400) {
      if (!G || G.over) break;
      if (G.tiles.every(t => t.dead)) break;
      const live = G.tiles.filter(t => !t.dead && !t.inTray);
      if (!live.length) break;
      const freeT = live.filter(t => isFree(t));
      // tepside 2 tane olan yuzu tamamla
      const cnt = {}; G.tray.forEach(t => cnt[t.face.id] = (cnt[t.face.id] || 0) + 1);
      let pick = freeT.find(t => cnt[t.face.id] >= 1);
      if (!pick) {
        // serbestler arasinda 3'lu olusturabilecek yuz
        const fc = {}; freeT.forEach(t => (fc[t.face.id] = fc[t.face.id] || []).push(t));
        const trip = Object.values(fc).find(a => a.length >= 3);
        pick = trip ? trip[0] : freeT[0];
      }
      if (!pick) break;
      if (G.busy) { await sleep(60); continue; }
      pickTile(pick.i); clicks++;
      await sleep(140);
    }
    return { clicks, over: G ? G.over : null, dead: G ? G.tiles.filter(t => t.dead).length : 0, total: G ? G.tiles.length : 0 };
  });
  info(`${played.clicks} tas secildi, ${played.dead}/${played.total} tas kirildi`);
  await page.waitForTimeout(1500);
  const modalOpen = await page.evaluate(() => document.getElementById('modal').classList.contains('on'));
  ok('seviye sonu ekrani acildi', modalOpen);
  await page.screenshot({ path: SHOT + '/12_seviye_sonu.png' });

  console.log('\n═══ D. HIKAYE KANCASI (tease karti) ═══');
  const tease = await page.evaluate(() => {
    const box = document.getElementById('modalBox');
    const t = box.querySelector('.storyTease');
    if (!t) return null;
    const bar = t.querySelector('.stBar i');
    return {
      txt: t.textContent.replace(/\s+/g, ' ').trim(),
      bar: bar ? bar.style.width : 'yok',
      ready: t.classList.contains('ready')
    };
  });
  ok('tease karti sonuc ekraninda VAR', !!tease);
  if (tease) { info(`metin: "${tease.txt}"`); info(`bar: ${tease.bar} | hazir: ${tease.ready}`); }

  console.log('\n═══ E. HATA KONTROLU ═══');
  ok('JS hatasi yok', errors.length === 0, errors.slice(0, 3).join(' | ') || 'temiz');

  fs.writeFileSync('/home/user/kanka/test/sonuc2.txt', log.join('\n'));
  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi ═══`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
