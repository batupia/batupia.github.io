/* STONEBREAKING — uctan uca gercek tarayici testi
   Telefon boyutunda (Pixel 5 / 393x851), CANLI siteye karsi calisir.
   Amac: kullanicinin gerdugu her adimi tekrarlamak. */
const { chromium, devices } = require('playwright');
const fs = require('fs');

const URL = process.env.URL || 'https://stonebreaking.github.io/';
const SHOT = '/home/user/kanka/test/shots';
fs.mkdirSync(SHOT, { recursive: true });

let pass = 0, fail = 0;
const log = [];
function ok(name, cond, detail) {
  (cond ? pass++ : fail++);
  const line = `${cond ? '✅' : '❌'} ${name}${detail ? '  — ' + detail : ''}`;
  console.log(line); log.push(line);
}
function info(s) { console.log('   ' + s); log.push('   ' + s); }

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();

  const errors = [], failed404 = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('response', r => { if (r.status() >= 400) failed404.push(r.status() + ' ' + r.url()); });

  console.log('\n═══ 1. SAYFA ACILISI ═══');
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  info(`yuklendi: ${Date.now() - t0} ms`);
  await page.waitForTimeout(1200);

  const screen = () => page.evaluate(() => (document.querySelector('.screen.on') || {}).id);
  ok('sayfa acildi', await page.title() !== '');
  info('ilk ekran: ' + await screen());

  // --- Yas / auth / profil akisini gec ---
  console.log('\n═══ 2. ILK GIRIS AKISI ═══');
  async function passOnboarding() {
    for (let i = 0; i < 14; i++) {
      const s = await screen();
      if (s === 's-splash') return true;
      if (s === 's-age') {
        await page.locator('.agebtn').nth(2).click();      // 18+
      } else if (s === 's-auth') {
        await page.locator('#authLocal').click().catch(() => {});
      } else if (s === 's-newprof') {
        await page.locator('#npName').fill('Kanka').catch(() => {});
        await page.locator('#npSave').click();
      } else if (s === 's-profiles') {
        const add = page.locator('#profAdd');
        if (await add.count()) await add.click(); else await page.locator('.prof').first().click();
      } else if (s === 's-story') {
        return 'story';
      } else break;
      await page.waitForTimeout(600);
      // modal varsa kapat
      const m = page.locator('#modal.on .btn').first();
      if (await m.count()) { await m.click().catch(() => {}); await page.waitForTimeout(400); }
    }
    return await screen();
  }
  const after = await passOnboarding();
  ok('ana menuye ulasildi', await screen() === 's-splash', 'ekran: ' + await screen());
  await page.screenshot({ path: SHOT + '/01_ana_menu.png' });

  // --- Menu butonlari dogru mu? ---
  console.log('\n═══ 3. MENU BUTONLARI ═══');
  const diaryBtn = await page.locator('#goLegend').textContent();
  ok('Gunluk butonu yeni isimde', diaryBtn.includes('Günlüğü'), `"${diaryBtn.trim()}"`);

  // --- GUNLUK: bastan sona izle ---
  console.log('\n═══ 4. GUNLUK EKRANI ═══');
  await page.locator('#goLegend').click();
  await page.waitForTimeout(700);
  ok('Gunluk acildi', await screen() === 's-legend');
  await page.screenshot({ path: SHOT + '/02_gunluk.png', fullPage: true });

  const allBtn = page.locator('#diaryList .btn.wide').first();
  ok('"Bastan Sona Izle" butonu var', await allBtn.count() > 0);
  const rows = await page.locator('#diaryList > *').count();
  // head = ilerleme karti + "bastan sona izle" butonu = 2 eleman
  info(`gunluk satir sayisi: ${rows} (2 baslik + ${rows - 2} perde)`);
  ok('10 perde listeleniyor', rows - 2 === 10, `${rows - 2} perde`);

  // --- BASTAN SONA IZLEME ZINCIRI ---
  console.log('\n═══ 5. BASTAN SONA IZLEME (10 PERDE) ═══');
  await allBtn.click();
  await page.waitForTimeout(900);
  ok('hikaye ekrani acildi', await screen() === 's-story');

  const seen = [];
  let guard = 0;
  while (guard++ < 40) {
    if (await screen() !== 's-story') break;
    const d = await page.evaluate(() => ({
      ch: document.getElementById('stChapter').textContent.trim(),
      ti: document.getElementById('stTitle').textContent.trim(),
      btn: document.getElementById('stNext').textContent.trim(),
      img: (document.getElementById('stImg').getAttribute('src') || '').split('/').pop(),
      // gorsel gercekten yuklendi mi?
      loaded: (() => { const i = document.getElementById('stImg'); return i.complete && i.naturalWidth > 0; })(),
      txtLen: document.getElementById('stText').textContent.trim().length,
      dots: document.getElementById('stDots').querySelectorAll('i').length,
    }));
    seen.push(d);
    if (seen.length <= 3 || d.btn.includes('Tamamlandı'))
      await page.screenshot({ path: `${SHOT}/03_perde_${String(seen.length).padStart(2, '0')}.png` });
    await page.locator('#stNext').click();
    await page.waitForTimeout(700);
  }

  info(`gezilen panel: ${seen.length}`);
  seen.forEach((d, i) => info(`  ${String(i + 1).padStart(2)}. ${d.ch.padEnd(30)} | ${d.ti.padEnd(24)} | ${d.img.padEnd(17)} | yuklendi:${d.loaded ? '✓' : '✗'} | ${d.txtLen}kr`));

  ok('13 panel gezildi (4+9)', seen.length === 13, `${seen.length} panel`);
  ok('TUM gorseller gercekten yuklendi', seen.every(d => d.loaded),
    seen.filter(d => !d.loaded).map(d => d.img).join(',') || 'hepsi ok');
  ok('tum panellerde metin var', seen.every(d => d.txtLen > 60));
  ok('son panel "Efsane Tamamlandı"', seen[seen.length - 1].btn.includes('Tamamlandı'), seen[seen.length - 1].btn);
  ok('Perde X finalde', seen[seen.length - 1].ti.includes('Yeniden Doğdu'), seen[seen.length - 1].ti);
  ok('zincir sayaci calisiyor', seen[0].ch.includes('1/10') && seen[seen.length - 1].ch.includes('10/10'),
    `ilk:"${seen[0].ch}" son:"${seen[seen.length - 1].ch}"`);
  ok('bitince Gunluge donuldu', await screen() === 's-legend', 'ekran: ' + await screen());

  // --- benzersiz gorsel sayisi ---
  const uniq = [...new Set(seen.map(d => d.img))];
  info('benzersiz gorsel: ' + uniq.length + ' -> ' + uniq.join(', '));
  ok('13 panelde 13 farkli sahne (ch3 iki kez bilincli)', uniq.length === 12, uniq.length + ' benzersiz');

  console.log('\n═══ 6. HATA KONTROLU ═══');
  ok('JS hatasi yok', errors.length === 0, errors.slice(0, 3).join(' | ') || 'temiz');
  ok('404 / kirik dosya yok', failed404.length === 0, failed404.slice(0, 3).join(' | ') || 'temiz');

  fs.writeFileSync('/home/user/kanka/test/sonuc.txt', log.join('\n'));
  console.log(`\n═══ SONUC: ${pass} gecti, ${fail} kaldi ═══`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
