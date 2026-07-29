/* Acilis sinematigi testi: uc panelin de OLAY sahneledigini dogrular
   ve her panelden kare alir. URL=... ile canliya da vurabilir. */
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:8899/";
const out = __dirname + "/shots";
require("fs").mkdirSync(out, { recursive: true });

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ " + m)); };

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on("pageerror", e => errs.push(e.message));
  await pg.goto(URL, { waitUntil: "networkidle" });

  // profil olustur + hikayeyi baslat
  await pg.evaluate(() => localStorage.clear());
  await pg.reload({ waitUntil: "networkidle" });
  await pg.waitForTimeout(900);

  const screen = () => pg.evaluate(() => (document.querySelector(".screen.on") || {}).id);
  for (let i = 0; i < 12; i++) {
    const s = await screen();
    if (s === "s-splash") break;
    if (s === "s-age") await pg.locator(".agebtn").nth(2).click();
    else if (s === "s-auth") await pg.locator("#authLocal").click().catch(() => {});
    else if (s === "s-newprof") {
      await pg.locator("#npName").fill("Kanka").catch(() => {});
      await pg.locator("#npSave").click();
    } else if (s === "s-profiles") {
      const a = pg.locator("#profAdd");
      if (await a.count()) await a.click(); else await pg.locator(".prof").first().click();
    } else break;
    await pg.waitForTimeout(450);
  }
  ok(await screen() === "s-splash", "ana menuye ulasildi");

  console.log("\nACILIS SINEMATIGI");
  await pg.click("#goStart");
  await pg.waitForTimeout(500);
  // ruh secimi araya girerse gec
  if (await screen() === "s-pick") {
    await pg.locator("#spiritGrid > *").first().click();
    await pg.waitForTimeout(300);
    await pg.locator("#pickGo").click();
    await pg.waitForTimeout(700);
    const mb = pg.locator("#modal.on .btn").first();
    if (await mb.count()) { await mb.click(); await pg.waitForTimeout(800); }
  }

  // --- PANEL 1: dort ruh uyaniyor ---
  await pg.waitForFunction(() => (document.querySelector(".screen.on")||{}).id === "s-story",
    null, { timeout: 8000 });
  ok(true, "hikaye ekrani acildi");
  const cold = await pg.evaluate(() => document.getElementById("s-story").classList.contains("coldOpen"));
  ok(cold, "soguk acilis calisiyor (ekran karanliktan aciliyor)");
  await pg.waitForTimeout(2100);
  const orbs = await pg.$$eval("#stOrbit .orb", n => n.length);
  ok(orbs === 4, "panel 1: dort ruh isigi sahnede (" + orbs + ")");
  const lns = await pg.$$eval("#stText .ln", n => n.length);
  ok(lns >= 2, "metin satir satir akiyor (" + lns + " blok)");
  await pg.waitForTimeout(1800);
  const ring = await pg.evaluate(() => document.getElementById("stRing").classList.contains("go"));
  ok(ring, "cember kapandi (halka dalgasi gecti)");
  await pg.screenshot({ path: out + "/intro1_cember.png" });

  // --- PANEL 2: cekirdek catliyor ---
  await pg.click("#stNext");
  await pg.waitForTimeout(400);
  const crackPaths = await pg.$$eval("#stCrack path", n => n.length);
  ok(crackPaths === 7, "panel 2: yedi kirik hat cizildi (" + crackPaths + ")");
  await pg.waitForTimeout(500);
  const quake = await pg.evaluate(() => document.getElementById("s-story").classList.contains("fxCrack"));
  ok(quake, "sarsinti tetiklendi");
  const flash = await pg.evaluate(() => document.getElementById("stFlash").classList.contains("go"));
  ok(flash, "carpma flasi patladi");
  await pg.screenshot({ path: out + "/intro2_catlama.png" });
  await pg.waitForTimeout(700);
  const blow = await pg.evaluate(() => document.getElementById("stOrbit").classList.contains("blow"));
  ok(blow, "ruhlar dort uca savruldu");
  await pg.screenshot({ path: out + "/intro2b_savrulma.png" });

  // --- PANEL 3: kolye cagiriyor ---
  await pg.waitForTimeout(1600);
  await pg.click("#stNext");
  await pg.waitForTimeout(900);
  const amu = await pg.evaluate(() => document.getElementById("stAmulet").classList.contains("go"));
  ok(amu, "panel 3: kolye parliyor");
  const cleared = await pg.$$eval("#stOrbit .orb", n => n.length);
  ok(cleared === 0, "onceki panelin efektleri temizlendi");
  await pg.screenshot({ path: out + "/intro3_kolye.png" });

  // --- PANEL 4 + cikis: efekt sizintisi olmamali ---
  await pg.click("#stNext");
  await pg.waitForTimeout(600);
  const leak = await pg.evaluate(() => {
    const s = document.getElementById("s-story");
    return s.classList.contains("fxCrack") ||
      document.getElementById("stCrack").classList.contains("go");
  });
  ok(!leak, "panel 4'e efekt sizmadi");

  // ileri-geri hizli tiklama coldurmemeli
  for (let i = 0; i < 4; i++) {
    if (await pg.evaluate(() => (document.querySelector(".screen.on")||{}).id) !== "s-story") break;
    await pg.click("#stNext").catch(() => {}); await pg.waitForTimeout(200);
  }
  ok(errs.length === 0, "konsol hatasi yok" + (errs.length ? " -> " + errs[0] : ""));

  console.log(`\n${pass} gecti, ${fail} kaldi`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
