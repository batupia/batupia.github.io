/* ==================================================================
   PERDE DENETIMI — 13 panelin hepsi tek tek olculur ve kare alinir
   ------------------------------------------------------------------
   Kullanici: "perdeleri yeniden gozden gecir, her seyi tekrar uygula,
   bastan sona detayli eksiklikleri olc, gercek gozle kontrol et".

   Her panelde olculenler:
     1) Gorsel yuklendi mi, dogal boyutu ne
     2) Metin blogu gorselin ne kadarini yiyor
     3) Kahraman/logo katmani var mi, tasiyor mu
     4) Metin tasiyor mu (scroll gerekiyor mu)
     5) Konsol hatasi
   ================================================================== */
const { chromium } = require("playwright");
const fs = require("fs");
const URL = process.env.URL || "http://localhost:8899/";
const OUT = __dirname + "/shots/perde";
fs.mkdirSync(OUT, { recursive: true });

const rapor = [];

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on("pageerror", e => errs.push(e.message));
  const miss = [];
  pg.on("response", r => { if (r.status() === 404) miss.push(r.url().split("/").pop()); });

  await pg.goto(URL, { waitUntil: "networkidle" });
  await pg.evaluate(() => localStorage.clear());
  await pg.reload({ waitUntil: "networkidle" });
  const sc = () => pg.evaluate(() => (document.querySelector(".screen.on") || {}).id);
  for (let i = 0; i < 12; i++) {
    const x = await sc();
    if (x === "s-age") await pg.locator(".agebtn").nth(2).click();
    else if (x === "s-auth") await pg.locator("#authLocal").click().catch(() => {});
    else if (x === "s-newprof") await pg.locator("#npSave").click();
    else if (x === "s-profiles") { const a = pg.locator("#profAdd"); if (await a.count()) await a.click(); }
    else break;
    await pg.waitForTimeout(300);
  }
  // profil: orta rutbe, ruh secili
  await pg.evaluate(() => { S.spirit = "fire"; S.sessions = 30; S.level = 42; S.acts = []; save(); });

  const STORY_N = await pg.evaluate(() => STORY.length);

  for (let ai = 0; ai < STORY_N; ai++) {
    const nPanel = await pg.evaluate(i => STORY[i].panels.length, ai);
    for (let pi = 0; pi < nPanel; pi++) {
      // paneli dogrudan cizdir
      await pg.evaluate(([i, j]) => {
        ST = { act: STORY[i], i: j, done: null, queue: null };
        show("s-story");
        paintPanel();
      }, [ai, pi]);
      /* Animasyonlarin BITMESINI bekle. 1500ms yetmiyordu: lnIn
         animasyonu translateY(10px) ile basliyor ve olcum o sirada
         alininca sahte "10px tasma" raporlaniyordu. */
      await pg.waitForTimeout(2600);

      const m = await pg.evaluate(() => {
        const sec = document.getElementById("s-story");
        const img = document.getElementById("stImg");
        const body = document.getElementById("stBody");
        const txt = document.getElementById("stText");
        const core = document.getElementById("stCore");
        const hw = document.getElementById("stHeroWrap");
        const H = sec.clientHeight, W = sec.clientWidth;
        const br = body.getBoundingClientRect();
        const r = el => { if (!el) return null; const q = el.getBoundingClientRect();
          return { x: Math.round(q.left), y: Math.round(q.top),
                   w: Math.round(q.width), h: Math.round(q.height) }; };
        const hr = r(hw);
        return {
          img: img.getAttribute("src").split("/").pop(),
          yuklu: img.naturalWidth > 0,
          dogal: img.naturalWidth + "x" + img.naturalHeight,
          sh: getComputedStyle(sec).getPropertyValue("--sh").trim(),
          bodyPay: Math.round(br.height / H * 100),
          metinTasma: txt.scrollHeight > txt.clientHeight + 12,
          bodyTasma: body.scrollHeight > body.clientHeight + 2,
          logoAcik: core.classList.contains("on"),
          avatarAcik: hw ? hw.classList.contains("on") : false,
          // avatar metne giriyor mu?
          avatarMetne: hr ? (hr.y + hr.h) > br.top + 6 : false,
          // avatar ekran disina tasiyor mu?
          avatarTasma: hr ? (hr.x < -4 || hr.x + hr.w > W + 4 || hr.y < -4) : false,
          baslik: document.getElementById("stTitle").textContent.trim(),
          bolum: document.getElementById("stChapter").textContent.trim()
        };
      });

      const ad = `p${ai}_${pi}_${m.img.replace(".webp", "")}`;
      await pg.screenshot({ path: `${OUT}/${ad}.png` });

      const sorun = [];
      if (!m.yuklu) sorun.push("GORSEL YUKLENMEDI");
      if (m.metinTasma) sorun.push("metin tasiyor");
      if (m.bodyTasma) sorun.push("blok tasiyor");
      if (m.avatarMetne) sorun.push("avatar metne giriyor");
      if (m.avatarTasma) sorun.push("avatar ekran disi");
      if (m.bodyPay > 48) sorun.push(`metin blogu %${m.bodyPay} (fazla)`);

      rapor.push({ perde: ai, panel: pi, ...m, sorun });
      const dur = sorun.length ? "✗ " + sorun.join(" · ") : "✓";
      console.log(`P${ai}.${pi} ${m.img.replace(".webp","").padEnd(13)} ` +
        `blok%${String(m.bodyPay).padStart(2)} ${m.dogal.padEnd(9)} ` +
        `${m.logoAcik?"LOGO ":""}${m.avatarAcik?"AVATAR ":""}${dur}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  const kotu = rapor.filter(r => r.sorun.length);
  console.log(`TOPLAM ${rapor.length} panel · ${kotu.length} sorunlu`);
  if (miss.length) console.log("404:", [...new Set(miss)].join(", "));
  if (errs.length) console.log("JS hatasi:", errs[0]);
  fs.writeFileSync(__dirname + "/perde_rapor.json", JSON.stringify(rapor, null, 1));
  await b.close();
  process.exit(0);
})();
