#!/usr/bin/env node
/* ==================================================================
   SAHNE GÖZÜ — her sahneyi gerçek gözle kontrol eder
   ==================================================================
   Kullanıcı: "bu sahneleri gerçek gözle kontrol edecek programı"

   PATRON.js "yayına hazır mı?" sorusunu cevaplar.
   SAHNE_GOZU.js ise "GÖRÜNTÜ DOĞRU MU?" sorusunu cevaplar.

   FARKI: Bu program sadece hata aramaz — her sahnenin KARESİNİ alır,
   yan yana bir GALERİ üretir. İnsan gözüyle bakılacak tek bir HTML
   dosyası çıkarır. Çünkü bazı hatalar sayıyla yakalanamaz:
   "görsel kaymış", "yazı boğuk", "renk tutmuyor" gibi.

   ÖLÇTÜKLERİ (sayısal):
     · Görsel yüklendi mi, doğal boyutu, ekranda görünen oranı
     · Metin bloğu ne kadar yer kaplıyor
     · Metin/blok taşması
     · Kahraman katmanı metne giriyor mu, ekran dışına çıkıyor mu
     · Görselin ilgi merkezi ile odak ayarı uyuşuyor mu  ← kayma dedektörü

   ÇIKTI:
     batu/arsiv/galeri.html   → tarayıcıda aç, hepsini yan yana gör
     batu/arsiv/sahne/*.png   → tek tek kareler
     batu/arsiv/sahne_rapor.json

   KULLANIM:
     node batu/kontrol/SAHNE_GOZU.js
     URL=https://stonebreaking.github.io/ node batu/kontrol/SAHNE_GOZU.js
   ================================================================== */
/* playwright kok dizinde kurulu; alt klasorden calisirken bulunsun */
const path = require("path");
try { module.paths.push(path.join(__dirname, "..", "..", "..", "node_modules")); } catch(e){}
const { chromium } = require("playwright");
const fs = require("fs");

const URL = process.env.URL || "http://localhost:8899/";
const KOK = path.join(__dirname, "..", "arsiv");
const KARE = path.join(KOK, "sahne");

const C = { r:"\x1b[31m", y:"\x1b[33m", g:"\x1b[32m", d:"\x1b[2m", B:"\x1b[1m", x:"\x1b[0m" };

/* Görselin ilgi merkezi ile odak ayarı uyuşuyor mu?
   Kayma hatasının kök sebebi buydu: görseller 720x1290, ekranda
   sadece %61'i görünüyor. Odak yanlışsa kahramanın kafası kesiliyor. */
function kaymaKontrol(dogalW, dogalH, alanW, alanH, focusYuzde) {
  const oranEkran = alanW / alanH;
  const oranGorsel = dogalW / dogalH;
  if (oranGorsel >= oranEkran) return { kirpma: 0, guvenli: [0, 100] };
  const gorunen = (dogalW / oranEkran) / dogalH * 100;   // dikeyde yüzde kaçı
  const yari = gorunen / 2;
  return {
    kirpma: Math.round(100 - gorunen),
    gorunen: Math.round(gorunen),
    guvenli: [Math.round(yari), Math.round(100 - yari)],
    uygun: focusYuzde >= yari - 1 && focusYuzde <= 100 - yari + 1
  };
}

(async () => {
  fs.mkdirSync(KARE, { recursive: true });
  console.log(`\n${C.B}👁  SAHNE GÖZÜ${C.x} ${C.d}— her sahne gerçek gözle${C.x}`);
  console.log(`${C.d}hedef: ${URL}${C.x}\n`);

  const browser = await chromium.launch();
  /* deviceScaleFactor 1: kareler galeri icin, depoyu sismesin
     (2x PNG'de 30 MB tutuyordu, 1x JPEG'de 1.3 MB) */
  const pg = await browser.newPage({ viewport: { width: 430, height: 860 } });
  const errs = [];
  pg.on("pageerror", e => errs.push(e.message));

  await pg.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await pg.evaluate(() => localStorage.clear());
  await pg.reload({ waitUntil: "networkidle" });
  const sc = () => pg.evaluate(() => (document.querySelector(".screen.on") || {}).id);
  for (let i = 0; i < 14; i++) {
    const x = await sc();
    if (x === "s-splash") break;
    if (x === "s-age") await pg.locator(".agebtn").nth(2).click();
    else if (x === "s-auth") await pg.locator("#authLocal").click().catch(() => {});
    else if (x === "s-newprof") await pg.locator("#npSave").click();
    else if (x === "s-profiles") { const a = pg.locator("#profAdd");
      if (await a.count()) await a.click(); }
    else break;
    await pg.waitForTimeout(320);
  }
  await pg.evaluate(() => { S.spirit = "fire"; S.sessions = 30; S.level = 42; save(); });

  const kayit = [];

  /* ---------- A) PERDELER ---------- */
  console.log(`${C.B}PERDELER${C.x}`);
  const nAct = await pg.evaluate(() => STORY.length);
  for (let ai = 0; ai < nAct; ai++) {
    const nP = await pg.evaluate(i => STORY[i].panels.length, ai);
    for (let pi = 0; pi < nP; pi++) {
      await pg.evaluate(([i, j]) => {
        ST = { act: STORY[i], i: j, done: null, queue: null };
        show("s-story"); paintPanel();
      }, [ai, pi]);
      await pg.waitForTimeout(2300);

      const m = await pg.evaluate(() => {
        const sec = document.getElementById("s-story");
        const img = document.getElementById("stImg");
        const wrap = document.getElementById("stImgWrap");
        const body = document.getElementById("stBody");
        const txt = document.getElementById("stText");
        const hw = document.getElementById("stHeroWrap");
        const core = document.getElementById("stCore");
        const br = body.getBoundingClientRect();
        const wr = wrap.getBoundingClientRect();
        const fo = getComputedStyle(sec).getPropertyValue("--focus").trim();
        const hr = hw && hw.classList.contains("on") ? hw.getBoundingClientRect() : null;
        return {
          img: img.getAttribute("src").split("/").pop(),
          yuklu: img.naturalWidth > 0,
          dw: img.naturalWidth, dh: img.naturalHeight,
          alanW: Math.round(wr.width), alanH: Math.round(wr.height),
          focus: fo,
          pay: Math.round(br.height / sec.clientHeight * 100),
          metinTasma: txt.scrollHeight > txt.clientHeight + 12,
          avatar: !!hr,
          avatarMetne: hr ? (hr.y + hr.height) > br.top + 8 : false,
          avatarDisi: hr ? (hr.x < -4 || hr.x + hr.width > sec.clientWidth + 4) : false,
          logo: core.classList.contains("on"),
          baslik: document.getElementById("stTitle").textContent.trim(),
          bolum: document.getElementById("stChapter").textContent.trim()
        };
      });

      const fy = parseFloat((m.focus.match(/(\d+(?:\.\d+)?)%/) || [0, 50])[1]);
      const k = kaymaKontrol(m.dw, m.dh, m.alanW, m.alanH, fy);

      const ad = `perde_${ai}_${pi}`;
      await pg.screenshot({ path: path.join(KARE, ad + ".jpg"), quality: 72 });

      const sorun = [];
      if (!m.yuklu) sorun.push("görsel yüklenmedi");
      if (m.metinTasma) sorun.push("metin taşıyor");
      if (m.pay > 52) sorun.push(`metin bloğu %${m.pay}`);
      if (m.avatarMetne) sorun.push("avatar metne giriyor");
      if (m.avatarDisi) sorun.push("avatar ekran dışı");
      if (k.uygun === false) sorun.push(`odak %${fy} güvenli değil (${k.guvenli[0]}-${k.guvenli[1]})`);

      kayit.push({ tip: "perde", ad, ...m, kirpma: k.kirpma, guvenli: k.guvenli, sorun });
      console.log(`  ${sorun.length ? C.y + "!" : C.g + "✓"}${C.x} P${ai}.${pi} ` +
        `${m.img.replace(".webp","").padEnd(13)} ${C.d}odak ${m.focus} · kırpma %${k.kirpma} · ` +
        `blok %${m.pay}${C.x}${sorun.length ? "  " + C.y + sorun.join(" · ") + C.x : ""}`);
    }
  }

  /* ---------- B) GÜNLÜK SAHNELERİ (örneklem) ---------- */
  console.log(`\n${C.B}GÜNLÜK SAHNELERİ${C.x} ${C.d}(örneklem)${C.x}`);
  for (const lv of [1, 8, 26, 44, 62, 80, 92, 99]) {
    const var_ = await pg.evaluate(l => !!sceneAt(l), lv);
    if (!var_) { console.log(`  ${C.y}!${C.x} Sv${lv} sahne yok`); continue; }
    await pg.evaluate(l => { const sc2 = document.getElementById("scene");
      sc2.classList.remove("on"); playScene(l, () => {}); }, lv);
    await pg.waitForTimeout(1700);
    const m = await pg.evaluate(() => {
      const card = document.getElementById("sceneCard");
      const img = document.getElementById("sceneImg");
      const body = document.getElementById("sceneBody");
      const hw = document.getElementById("sceneHeroWrap");
      const sp = document.getElementById("sceneSpirit");
      const br = body.getBoundingClientRect();
      const hr = hw ? hw.getBoundingClientRect() : null;
      return {
        img: img.getAttribute("src").split("/").pop(),
        yuklu: img.naturalWidth > 0,
        dw: img.naturalWidth, dh: img.naturalHeight,
        pay: Math.round(br.height / innerHeight * 100),
        kahraman: !!hr && hr.height > 10,
        kahramanMetne: hr ? (hr.y + hr.height) > br.top + 10 : false,
        ruh: sp ? sp.classList.contains("on") : false,
        arc: document.getElementById("sceneArc").textContent.trim(),
        marka: !!document.getElementById("sceneBrand")
      };
    });
    const ad = `sahne_sv${lv}`;
    await pg.screenshot({ path: path.join(KARE, ad + ".jpg"), quality: 72 });
    const sorun = [];
    if (!m.yuklu) sorun.push("görsel yüklenmedi");
    if (!m.kahraman) sorun.push("kahraman yok");
    if (m.kahramanMetne) sorun.push("kahraman metne giriyor");
    if (!m.marka) sorun.push("marka imzası yok");
    kayit.push({ tip: "sahne", ad, lv, ...m, sorun });
    console.log(`  ${sorun.length ? C.y + "!" : C.g + "✓"}${C.x} Sv${String(lv).padEnd(3)} ` +
      `${m.img.replace(".webp","").padEnd(10)} ${C.d}${m.arc} · blok %${m.pay}` +
      `${m.ruh ? " · ruh anı" : ""}${C.x}${sorun.length ? "  " + C.y + sorun.join(" · ") + C.x : ""}`);
    await pg.evaluate(() => document.getElementById("scene").classList.remove("on"));
  }

  /* ---------- C) DİĞER EKRANLAR ---------- */
  console.log(`\n${C.B}DİĞER EKRANLAR${C.x}`);
  const ekranlar = [
    ["menu",    () => { backHome(); }],
    ["bilgelik",() => { showWisdom(S.spirit); }],
    ["golge",   () => { shadowMirror(() => {}); }],
    ["lobi",    () => { duelLobby({ level:24, seed:424242, score:915, name:"Rakip" },
                                   Date.now() + 47000); }],
    ["tahta",   () => { const w=document.getElementById("wisdom");
                        if(w) w.classList.remove("on"); startLevel(); }]
  ];
  for (const [ad, fn] of ekranlar) {
    try {
      await pg.evaluate(fn);
      await pg.waitForTimeout(1300);
      await pg.screenshot({ path: path.join(KARE, "ekran_" + ad + ".jpg"), quality: 72 });
      const tasma = await pg.evaluate(() => {
        const W = innerWidth; let n = 0;
        document.querySelectorAll(".screen.on *, #wisdom.on *").forEach(e => {
          const r = e.getBoundingClientRect();
          if (r.width > 0 && (r.left < -3 || r.right > W + 3)) n++;
        });
        return n;
      });
      const sorun = tasma ? [`${tasma} öğe taşıyor`] : [];
      kayit.push({ tip: "ekran", ad, tasma, sorun });
      console.log(`  ${sorun.length ? C.y+"!" : C.g+"✓"}${C.x} ${ad.padEnd(10)}` +
        `${sorun.length ? " " + C.y + sorun[0] + C.x : ""}`);
    } catch (e) {
      console.log(`  ${C.r}✗${C.x} ${ad}: ${e.message.slice(0, 50)}`);
      kayit.push({ tip: "ekran", ad, sorun: ["açılamadı"] });
    }
  }

  await browser.close();

  /* ---------- GALERİ ---------- */
  const grup = { perde: [], sahne: [], ekran: [] };
  kayit.forEach(k => { if (grup[k.tip]) grup[k.tip].push(k); });
  const kart = k => `
    <figure class="${k.sorun.length ? 'kotu' : 'iyi'}">
      <img src="sahne/${k.ad}.jpg" loading="lazy">
      <figcaption>
        <b>${k.ad}</b>
        ${k.baslik ? `<span class="t">${k.baslik}</span>` : ""}
        ${k.arc ? `<span class="t">${k.arc}</span>` : ""}
        ${k.img ? `<span class="d">${k.img}${k.kirpma !== undefined ? ` · kırpma %${k.kirpma}` : ""}</span>` : ""}
        ${k.focus ? `<span class="d">odak ${k.focus} · blok %${k.pay}</span>` : ""}
        ${k.sorun.length ? `<span class="s">⚠ ${k.sorun.join(" · ")}</span>` : `<span class="o">✓ temiz</span>`}
      </figcaption>
    </figure>`;

  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<title>STONEBREAKING — Sahne Galerisi</title><style>
*{box-sizing:border-box}
body{background:#0e0b1e;color:#eee;font:14px/1.5 system-ui;margin:0;padding:22px}
h1{font-size:21px;margin:0 0 4px}
h2{font-size:15px;letter-spacing:2px;text-transform:uppercase;color:#ffcf5c;
   margin:26px 0 10px;border-bottom:1px solid #2a2350;padding-bottom:6px}
.ust{color:#9a91c0;font-size:12.5px;margin-bottom:6px}
.ozet{display:flex;gap:10px;margin:12px 0 4px;flex-wrap:wrap}
.ozet div{background:#1a1538;border:1px solid #2f2760;border-radius:10px;
  padding:7px 13px;font-size:12.5px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:14px}
figure{margin:0;background:#171331;border:1px solid #2b2456;border-radius:12px;
  overflow:hidden}
figure.kotu{border-color:#8a5a1e;box-shadow:0 0 0 1px #8a5a1e inset}
figure img{width:100%;display:block;background:#000}
figcaption{padding:8px 10px;font-size:11.5px}
figcaption b{display:block;color:#ffcf5c;margin-bottom:2px}
.t{display:block;color:#fff;font-size:12px}
.d{display:block;color:#8f86b8;font-size:10.5px;margin-top:2px}
.s{display:block;color:#ffb14d;margin-top:5px;font-size:11px}
.o{display:block;color:#4ade80;margin-top:5px;font-size:11px}
</style></head><body>
<h1>👁 STONEBREAKING — Sahne Galerisi</h1>
<div class="ust">${new Date().toLocaleString("tr-TR")} · ${URL}</div>
<div class="ozet">
  <div>📸 ${kayit.length} kare</div>
  <div style="color:#4ade80">✓ ${kayit.filter(k=>!k.sorun.length).length} temiz</div>
  <div style="color:#ffb14d">⚠ ${kayit.filter(k=>k.sorun.length).length} dikkat</div>
</div>
<h2>Perdeler (${grup.perde.length})</h2><div class="grid">${grup.perde.map(kart).join("")}</div>
<h2>Günlük Sahneleri (${grup.sahne.length})</h2><div class="grid">${grup.sahne.map(kart).join("")}</div>
<h2>Ekranlar (${grup.ekran.length})</h2><div class="grid">${grup.ekran.map(kart).join("")}</div>
</body></html>`;

  fs.writeFileSync(path.join(KOK, "galeri.html"), html);
  fs.writeFileSync(path.join(KOK, "sahne_rapor.json"),
    JSON.stringify({ tarih: new Date().toISOString(), url: URL, kayit }, null, 1));

  const kotu = kayit.filter(k => k.sorun.length);
  console.log(`\n${C.B}────────────────────────────────────────${C.x}`);
  console.log(`${kayit.length} kare · ${C.g}${kayit.length - kotu.length} temiz${C.x} · ` +
    `${kotu.length ? C.y : C.g}${kotu.length} dikkat${C.x}`);
  if (errs.length) console.log(`${C.r}JS hatası: ${errs[0].slice(0,70)}${C.x}`);
  console.log(`\n${C.B}👁 GÖZLE BAK:${C.x} batu/arsiv/galeri.html`);
  console.log(`${C.d}   Tarayıcıda aç, hepsini yan yana gör.${C.x}\n`);
  process.exit(0);
})();
