/* Test 5 — YENI OZELLIKLER
   profil silme/duzenleme/begeni · tac + siralama · enerji paneli ·
   reklam odulu · acilista hikaye · oyun ici kanca · perde girisi */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'http://localhost:8899/';
const SHOT = '/home/user/kanka/test/shots'; fs.mkdirSync(SHOT, { recursive: true });
let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log(`${c ? '✅' : '❌'} ${n}${d ? '  — ' + d : ''}`); };
const info = s => console.log('   ' + s);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // navigator.vibrate uyarisi headless'ta kullanici dokunusu olmadigi icin
  // cikar, gercek cihazda cikmaz -> gurultuyu filtrele
  page.on('console', m => { if (m.type() === 'error' && !/vibrate/i.test(m.text())) errors.push(m.text()); });
  const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(900);
  for (let i = 0; i < 12; i++) {
    const s = await screen(); if (s === 's-splash' || s === 's-story') break;
    if (s === 's-age') await page.locator('.agebtn').nth(2).click();
    else if (s === 's-auth') await page.locator('#authLocal').click().catch(() => { });
    else if (s === 's-newprof') { await page.locator('#npName').fill('Baba').catch(() => { }); await page.locator('#npSave').click(); }
    else if (s === 's-profiles') { const a = page.locator('#profAdd'); if (await a.count()) await a.click(); else await page.locator('.prof').first().click(); }
    else break;
    await page.waitForTimeout(500);
  }

  console.log('\n═══ A. ACILISTA HIKAYE ═══');
  await page.evaluate(() => { S.spirit = 'pyro'; S.sessions = 3; S.level = 1; S.acts = []; save(); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  const s1 = await screen();
  ok('sayfa yenilenince DIREKT hikaye acildi', s1 === 's-story', 'ekran: ' + s1);
  const intro = await page.evaluate(() => ({
    burst: document.getElementById('stBurst').className,
    badge: document.getElementById('stBadge').textContent,
    badgeOn: document.getElementById('stBadge').className
  }));
  info(`patlama:"${intro.burst}"  rozet:"${intro.badge}" (${intro.badgeOn})`);
  ok('perde girisi BUYUK ETKI (patlama + rozet)', intro.burst.includes('go') && intro.badgeOn.includes('go'), intro.badge);
  await page.screenshot({ path: SHOT + '/40_acilis_hikaye.png' });
  // perdeyi bitir
  for (let i = 0; i < 5; i++) { if (await screen() !== 's-story') break; await page.locator('#stNext').click(); await page.waitForTimeout(500); }
  ok('efsane bitince ana menu', await screen() === 's-splash', await screen());

  console.log('\n═══ B. TAC + SIRALAMA ═══');
  await page.evaluate(() => {
    // aile: 3 profil
    const mk = (n, av, lv) => { const p = blankProfile(n, av, 'family', 'male'); p.level = lv; p.sessions = lv * 2; p.likes = lv; return p; };
    DB.profiles = [mk('Baba', '🦊', 12), mk('Ayşe', '🐬', 27), mk('Dede', '🐼', 5)];
    DB.active = DB.profiles[0].id; loadProfile(DB.active); S.spirit = 'pyro'; save(); refreshSplash();
  });
  await page.waitForTimeout(600);
  const champ = await page.evaluate(() => document.getElementById('champBar').textContent.replace(/\s+/g, ' ').trim());
  info('şampiyon şeridi: "' + champ + '"');
  ok('ana ekranda TAC + en yuksek seviyeli kisi', champ.includes('👑') && champ.includes('Ayşe') && champ.includes('27'), champ);
  await page.screenshot({ path: SHOT + '/41_champ.png' });

  await page.locator('#champBar').click();
  await page.waitForTimeout(700);
  const lb = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.lbRow')];
    return { n: rows.length, first: rows[0].textContent.replace(/\s+/g, ' ').trim(), me: rows.filter(r => r.classList.contains('me')).length };
  });
  info(`sıralama satırı: ${lb.n}, 1.: "${lb.first}"`);
  ok('TOP10 siralama acildi', lb.n === 3 && lb.first.includes('Ayşe'), lb.first);
  ok('kendi profilin vurgulu', lb.me === 1);
  await page.screenshot({ path: SHOT + '/42_top10.png' });
  await page.locator('#modalBox .btn').last().click(); await page.waitForTimeout(400);

  console.log('\n═══ C. PROFIL: BEGENI / DUZENLE / SIL ═══');
  await page.locator('#profBtn').click(); await page.waitForTimeout(600);
  ok('profil ekrani acildi', await screen() === 's-profiles');
  const pv = await page.evaluate(() => ({
    n: document.querySelectorAll('.prof').length,
    like: document.querySelectorAll('.likeBtn').length,
    edit: document.querySelectorAll('.prof .edit').length,
    del: document.querySelectorAll('.prof .del').length,
    crown: document.querySelectorAll('.prof .nm').length && [...document.querySelectorAll('.prof .nm')].filter(e => e.textContent.includes('👑')).length
  }));
  info(`profil ${pv.n} · begeni ${pv.like} · duzenle ${pv.edit} · sil ${pv.del} · tac ${pv.crown}`);
  ok('SILME dugmesi her profilde var', pv.del === 3);
  ok('DUZENLE dugmesi her profilde var', pv.edit === 3);
  ok('BEGENI dugmesi her profilde var', pv.like === 3);
  ok('lider profilde tac isareti', pv.crown === 1);
  await page.screenshot({ path: SHOT + '/43_profiller.png' });

  // begeni
  const before = await page.evaluate(() => DB.profiles.find(p => p.name === 'Ayşe').likes);
  await page.evaluate(() => { const el = [...document.querySelectorAll('.likeBtn')].find((_, i) => i === 1); el.click(); });
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => DB.profiles.find(p => p.name === 'Ayşe').likes);
  ok('begeni calisiyor (+1)', after === before + 1, `${before} -> ${after}`);
  // kendine begeni
  await page.evaluate(() => { document.querySelectorAll('.likeBtn')[0].click(); });
  await page.waitForTimeout(400);
  const selfMsg = await page.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  ok('kendini begenemiyor', selfMsg.includes('Kendini'), selfMsg);

  // duzenleme
  await page.evaluate(() => document.querySelectorAll('.prof .edit')[0].click());
  await page.waitForTimeout(600);
  const hasEdit = await page.evaluate(() => !!document.getElementById('epName'));
  ok('duzenleme paneli acildi', hasEdit);
  if (hasEdit) {
    await page.fill('#epName', 'Kanka');
    await page.evaluate(() => epAv('🦁'));
    await page.evaluate(() => document.querySelector('#modalBox .btn.wide').click());
    await page.waitForTimeout(700);
    const nm = await page.evaluate(() => DB.profiles[0].name + '|' + DB.profiles[0].avatar);
    ok('isim + avatar kaydedildi', nm === 'Kanka|🦁', nm);
  }

  // silme
  page.on('dialog', d => d.accept());
  const cntBefore = await page.evaluate(() => DB.profiles.length);
  await page.evaluate(() => document.querySelectorAll('.prof .del')[2].click());
  await page.waitForTimeout(700);
  const cntAfter = await page.evaluate(() => DB.profiles.length);
  ok('profil SILINEBILIYOR', cntAfter === cntBefore - 1, `${cntBefore} -> ${cntAfter}`);

  console.log('\n═══ D. ENERJI PANELI + REKLAM ═══');
  await page.evaluate(() => { S.lives = 0; S.mode = 'family'; S.adCount = 0; S.adDay = null; save(); outOfLives(); });
  await page.waitForTimeout(800);
  const en = await page.evaluate(() => {
    const b = document.getElementById('modalBox');
    return {
      html: b.textContent.replace(/\s+/g, ' ').trim().slice(0, 150),
      clock: (document.getElementById('enClock') || {}).textContent || '',
      hasAd: b.textContent.includes('BT Taşı'),
      hasSub: b.textContent.includes('Aile Üyeliğini')
    };
  });
  info('panel: ' + en.html);
  info('sayaç: ' + en.clock);
  ok('enerji paneli acildi', en.hasAd && en.hasSub);
  ok('geri sayim sayaci calisiyor', /\d\d:\d\d/.test(en.clock), en.clock);
  await page.screenshot({ path: SHOT + '/44_enerji.png' });

  const livesBefore = await page.evaluate(() => S.lives);
  await page.evaluate(() => watchSeal());
  await page.waitForTimeout(6500);
  const adRes = await page.evaluate(() => ({ lives: S.lives, cnt: S.adCount }));
  ok('reklam izleyince +1 enerji', adRes.lives === livesBefore + 1, `${livesBefore} -> ${adRes.lives}`);
  ok('gunluk sayac artti', adRes.cnt === 1, 'adCount=' + adRes.cnt);

  await page.evaluate(() => showSubscribe());
  await page.waitForTimeout(600);
  const sub = await page.evaluate(() => document.getElementById('modalBox').textContent.replace(/\s+/g, ' ').trim());
  ok('abonelik paneli acildi', sub.includes('₺149') && sub.includes('AİLE'), sub.slice(0, 70));
  await page.screenshot({ path: SHOT + '/45_abonelik.png' });
  await page.evaluate(() => closeModal());

  console.log('\n═══ E. OYUN ICI HIKAYE KANCASI ═══');
  await page.evaluate(() => { S.level = 7; S.acts = [0]; S.lives = 3; save(); startLevel(); });
  await page.waitForTimeout(1200);
  const whisper = await page.evaluate(async () => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    let seen = '';
    for (let k = 0; k < 30; k++) {
      if (!G || G.over) break;
      if (G.busy) { await sl(60); continue; }
      const live = G.tiles.filter(t => !t.dead && !t.inTray);
      const free = live.filter(t => isFree(t));
      if (!free.length) break;
      const cnt = {}; G.tray.forEach(t => cnt[t.face.id] = (cnt[t.face.id] || 0) + 1);
      let pick = free.find(t => cnt[t.face.id] >= 1);
      if (!pick) { const fc = {}; free.forEach(t => (fc[t.face.id] = fc[t.face.id] || []).push(t)); const tr = Object.values(fc).find(a => a.length >= 3); pick = tr ? tr[0] : free[0]; }
      pickTile(pick.i); await sl(150);
      const tx = document.getElementById('sayTxt').textContent;
      if (tx.includes('Mühre') || tx.includes('seviye kaldı')) { seen = tx; break; }
    }
    return seen;
  });
  info('fısıltı: "' + whisper + '"');
  ok('oynanis sirasinda hikaye hedefi fisildaniyor', whisper.includes('Mühre') || whisper.includes('seviye kaldı'), whisper || 'yakalanamadi');
  await page.screenshot({ path: SHOT + '/46_kanca.png' });

  console.log('\n═══ F. GUNLUK ILERLEME + TAM OKUMA ═══');
  await page.evaluate(() => { S.level = 100; S.acts = STORY.map(a => a.act); save(); show('s-legend'); renderDiary(); });
  await page.waitForTimeout(600);
  const diary = await page.evaluate(() => {
    const t = document.getElementById('diaryList').textContent.replace(/\s+/g, ' ').trim();
    const bar = document.querySelector('#diaryList .stBar i');
    return { txt: t.slice(0, 60), bar: bar ? bar.style.width : 'yok' };
  });
  info('günlük: ' + diary.txt + ' | bar: ' + diary.bar);
  // 100 sahne sistemine gecince sayac 10/10 -> 100/100 oldu
  ok('gunlukte ilerleme sayaci (100/100)', diary.txt.includes('100/100') && diary.bar === '100%');
  await page.screenshot({ path: SHOT + '/47_gunluk.png' });

  await page.evaluate(() => {
    G = { level: 100, par: 100, left: 50, noTimer: false, tiles: [], tray: [], over: true };
    showResult(true, 5, null, false);
  });
  await page.waitForTimeout(600);
  const fin = await page.evaluate(() => {
    const t = document.querySelector('#modalBox .storyTease');
    return t ? t.textContent.replace(/\s+/g, ' ').trim() : 'yok';
  });
  info('final kartı: ' + fin);
  ok('efsane bitince "tamamini oku" dugmesi', fin.includes('Baştan Sona'), fin.slice(0, 60));

  console.log('\n═══ G. HATA ═══');
  ok('JS hatasi yok', errors.length === 0, errors.slice(0, 3).join(' | ') || 'temiz');

  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi ═══`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
