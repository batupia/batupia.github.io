#!/usr/bin/env node
/* ==================================================================
   PATRON — dört gözle tek denetim
   ==================================================================
   Kullanıcı: "oyun motorunuza hem patron hem finansmancı hem oyun
   tasarımcısı hem grafik tasarımcı gözüyle her işlemden sonra tek tek
   kontrolünü sağlayacak, eksikleri söyleyecek bir kod mu yapsak"

   NEDEN: 11 ayrı test dosyası vardı (1477 satır). Her biri kendi
   dilinde konuşuyor, hiçbiri "bu iş yayına hazır mı?" sorusuna
   cevap vermiyordu. Bu dosya o soruyu cevaplar.

   DÖRT GÖZ:
     🎩 PATRON      — yayına hazır mı? kırıcı hata var mı?
     💰 FİNANSMANCI — para kazandırır mı? dönüşümü ne bozuyor?
     🎮 TASARIMCI   — oynanır mı? hissi doğru mu? dengeli mi?
     🎨 GRAFİKER    — görünüyor mu? taşan/kayan/çakışan var mı?

   KULLANIM:
     node test/PATRON.js                 → yerel (localhost:8899)
     URL=https://... node test/PATRON.js → canlı
     node test/PATRON.js --hizli         → görsel taramayı atla

   ÇIKTI: her göz kendi notunu verir, sonunda TEK KARAR.
   Çıkış kodu: 0 = yayınlanabilir, 1 = engel var
   ================================================================== */
const { chromium } = require("playwright");
const fs = require("fs");

const URL   = process.env.URL || "http://localhost:8899/";
const HIZLI = process.argv.includes("--hizli");
const SHOT  = __dirname + "/shots/patron";

const C = { r:"\x1b[31m", y:"\x1b[33m", g:"\x1b[32m", b:"\x1b[36m",
            d:"\x1b[2m", B:"\x1b[1m", x:"\x1b[0m" };

/* Her bulgu: kim söyledi, ne kadar ciddi, ne yapmalı */
const bulgular = [];
const KRITIK = "KRITIK", UYARI = "UYARI", NOT = "NOT";

function bul(goz, seviye, baslik, detay, oneri) {
  bulgular.push({ goz, seviye, baslik, detay, oneri });
}
function ok(goz, baslik, detay) {
  bulgular.push({ goz, seviye: "OK", baslik, detay });
}

const say = (n, tek, cok) => `${n} ${n === 1 ? tek : (cok || tek)}`;

async function kurulum(pg) {
  await pg.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await pg.evaluate(() => localStorage.clear());
  await pg.reload({ waitUntil: "networkidle" });
  const sc = () => pg.evaluate(() => (document.querySelector(".screen.on") || {}).id);
  for (let i = 0; i < 14; i++) {
    const x = await sc();
    if (x === "s-splash") return true;
    if (x === "s-age") await pg.locator(".agebtn").nth(2).click();
    else if (x === "s-auth") await pg.locator("#authLocal").click().catch(() => {});
    else if (x === "s-newprof") await pg.locator("#npSave").click();
    else if (x === "s-profiles") {
      const a = pg.locator("#profAdd");
      if (await a.count()) await a.click(); else await pg.locator(".prof").first().click();
    } else break;
    await pg.waitForTimeout(320);
  }
  return (await sc()) === "s-splash";
}

(async () => {
  fs.mkdirSync(SHOT, { recursive: true });
  console.log(`\n${C.B}╔══════════════════════════════════════════════════════════════╗${C.x}`);
  console.log(`${C.B}║  PATRON — STONEBREAKING dört gözle denetim                   ║${C.x}`);
  console.log(`${C.B}╚══════════════════════════════════════════════════════════════╝${C.x}`);
  console.log(`${C.d}hedef: ${URL}${C.x}\n`);

  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 2 });
  const jsErr = [], net404 = [];
  pg.on("pageerror", e => jsErr.push(e.message));
  pg.on("response", r => { if (r.status() === 404) net404.push(r.url().split("/").pop()); });

  /* ============ 🎩 PATRON: yayına hazır mı? ============ */
  console.log(`${C.B}🎩 PATRON${C.x} ${C.d}— yayına hazır mı?${C.x}`);
  const t0 = Date.now();
  const acildi = await kurulum(pg);
  const acilisMs = Date.now() - t0;

  if (!acildi) bul("🎩", KRITIK, "Oyun açılmıyor", "Ana menüye ulaşılamadı",
                   "Onboarding akışı kırık — hiçbir şey satılamaz");
  else ok("🎩", "Oyun açılıyor", `${(acilisMs/1000).toFixed(1)}s içinde ana menü`);

  if (jsErr.length) bul("🎩", KRITIK, "JavaScript hatası", jsErr[0].slice(0, 90),
                        "Hata oyunu kilitleyebilir, önce bu");
  else ok("🎩", "Konsol temiz", "JS hatası yok");

  if (net404.length) bul("🎩", KRITIK, "Eksik dosya",
                         [...new Set(net404)].slice(0,3).join(", "),
                         "404 = kırık görsel/ses, oyuncu bozuk sanır");
  else ok("🎩", "Tüm dosyalar yerinde", "404 yok");

  // sürüm damgası
  const surum = await pg.evaluate(async () => {
    try { const r = await fetch("surum.json?t=" + Date.now(), { cache: "no-store" });
      const j = await r.json();
      return { dosya: j.build, sayfa: typeof BUILD !== "undefined" ? BUILD : null };
    } catch (e) { return null; }
  });
  if (!surum) bul("🎩", UYARI, "Sürüm damgası okunamadı", "surum.json yok/bozuk",
                  "Oyuncu eski sürümde kalır, düzeltmeler ulaşmaz");
  else if (surum.dosya !== surum.sayfa)
    bul("🎩", UYARI, "Sürüm uyuşmazlığı", `sayfa=${surum.sayfa} dosya=${surum.dosya}`,
        "Yayın yarım kalmış olabilir");
  else ok("🎩", "Sürüm damgası", surum.dosya);

  /* ============ 🎮 TASARIMCI: oynanır mı? ============ */
  console.log(`${C.B}🎮 TASARIMCI${C.x} ${C.d}— oynanır mı, hissi doğru mu?${C.x}`);

  // TTF: ilk taşa kadar
  const ttf = await pg.evaluate(async () => {
    const t = Date.now();
    S.spirit = "fire"; S.sessions = 5; S.level = 3; S.acts = [0]; save();
    startLevel();
    for (let i = 0; i < 100; i++) {
      if (document.querySelectorAll(".tile").length) break;
      await new Promise(r => setTimeout(r, 40));
    }
    return { ms: Date.now() - t, tas: document.querySelectorAll(".tile").length };
  });
  if (ttf.ms > 3000) bul("🎮", UYARI, "Tahta geç açılıyor", `${ttf.ms}ms`,
                         "1sn üstü bekleme oyuncuyu kaçırır");
  else ok("🎮", "Tahta hızlı açılıyor", `${ttf.ms}ms · ${say(ttf.tas,"taş")}`);

  // dokunma tepkisi
  const tepki = await pg.evaluate(() => new Promise(res => {
    const f = document.querySelector(".tile.free");
    if (!f) return res(-1);
    const t = performance.now();
    f.click();
    const iv = setInterval(() => {
      if (document.querySelectorAll(".ttile").length) { clearInterval(iv); res(Math.round(performance.now()-t)); }
      if (performance.now()-t > 3000) { clearInterval(iv); res(-2); }
    }, 8);
  }));
  if (tepki < 0) bul("🎮", KRITIK, "Taşa basılamıyor", "tepsiye taş gitmedi",
                     "Oynanışın kalbi çalışmıyor");
  else if (tepki > 150) bul("🎮", UYARI, "Dokunma tepkisi yavaş", `${tepki}ms`,
                            "100ms üstü 'kasıyor' hissi verir");
  else ok("🎮", "Dokunma tepkisi", `${tepki}ms`);

  // bot bir seviye bitirebiliyor mu
  const oyun = await pg.evaluate(async () => {
    for (let s = 0; s < 400; s++) {
      if (!G || G.over) break;
      const r = await new Promise(res => {
        if (G.busy) return res("b");
        const live = G.tiles.filter(t => !t.dead && !t.inTray);
        const free = live.filter(t => isFree(t));
        if (!free.length) return res("yok");
        const c = {}; G.tray.forEach(t => c[t.face.id] = (c[t.face.id]||0)+1);
        let p = free.find(t => c[t.face.id] === 2) || free.find(t => c[t.face.id] === 1);
        if (!p) { const fc={}; free.forEach(t=>fc[t.face.id]=(fc[t.face.id]||0)+1);
                  p = free.sort((a,b)=>(fc[b.face.id]||0)-(fc[a.face.id]||0))[0]; }
        pickTile(p.i); res("ok");
      });
      if (r === "yok") break;
      await new Promise(r => setTimeout(r, 55));
    }
    return { kalan: G ? G.tiles.filter(t=>!t.dead).length : -1,
             uclu: G ? G.ok : 0, kombo: G ? G.bestCombo : 0,
             domSenkron: G ? (document.querySelectorAll(".tile").length ===
                              G.tiles.filter(t=>!t.dead&&!t.inTray).length) : false };
  });
  if (oyun.kalan !== 0) bul("🎮", KRITIK, "Seviye bitirilemiyor", `${oyun.kalan} taş kaldı`,
                            "Bot çözemiyorsa oyuncu da çözemez");
  else ok("🎮", "Seviye bitirilebiliyor", `${say(oyun.uclu,"üçlü")} · en iyi zincir ${oyun.kombo}`);
  if (!oyun.domSenkron) bul("🎮", UYARI, "DOM/veri uyuşmazlığı", "ekrandaki taş sayısı veriyle tutmuyor",
                            "Hayalet taş görünür");

  // denge cezası — oyunun tezi
  const denge = await pg.evaluate(() => {
    const esit = chiTotal({speed:1100,logic:1100,memory:1100,pattern:1100});
    const tek  = chiTotal({speed:2000,logic:800,memory:800,pattern:800});
    return { esit: Math.round(esit), tek: Math.round(tek) };
  });
  if (denge.tek >= denge.esit)
    bul("🎮", KRITIK, "Denge cezası çalışmıyor",
        `tek dal ${denge.tek} ≥ dengeli ${denge.esit}`,
        "Oyunun TEZİ çöker: uzmanlaşma cezalandırılmalı");
  else ok("🎮", "Denge cezası çalışıyor", `dengeli ${denge.esit} > tek dal ${denge.tek}`);

  // hikaye kapsamı
  const hik = await pg.evaluate(() => {
    let bos = [];
    for (let lv = 1; lv <= 100; lv++)
      if (!STORY.find(a=>a.at===lv) && !sceneAt(lv)) bos.push(lv);
    const pr = storyProgress();
    return { bos, toplam: pr.total, perde: STORY.length,
             ruhAni: Object.keys(SPIRIT_PATH.fire||{}).length };
  });
  if (hik.bos.length) bul("🎮", UYARI, "Hikayede boşluk",
                          `${say(hik.bos.length,"seviye")} boş: ${hik.bos.slice(0,6).join(",")}`,
                          "Oyuncu ödülsüz kalır, kanca kopar");
  else ok("🎮", "Hikaye kapsamı tam", `${hik.toplam} an · ${hik.perde} perde · ruh başına ${hik.ruhAni} an`);

  /* ============ 🎨 GRAFİKER: görünüyor mu? ============ */
  console.log(`${C.B}🎨 GRAFİKER${C.x} ${C.d}— taşan, kayan, çakışan var mı?${C.x}`);

  await pg.evaluate(() => { backHome(); });
  await pg.waitForTimeout(500);

  // ana menü çakışma
  const menu = await pg.evaluate(() => {
    const logo = document.querySelector(".logoWrap .logo");
    if (!logo) return null;
    const lr = logo.getBoundingClientRect();
    let cak = 0;
    document.querySelectorAll(".logoWrap .em").forEach(e => {
      const r = e.getBoundingClientRect();
      const ix = Math.max(0, Math.min(r.right,lr.right) - Math.max(r.left,lr.left));
      const iy = Math.max(0, Math.min(r.bottom,lr.bottom) - Math.max(r.top,lr.top));
      cak += ix * iy;
    });
    // ekran dışına taşan öğe var mı
    const W = innerWidth;
    let tasan = [];
    document.querySelectorAll("#s-splash .btn, #journeyCard, .logoWrap").forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.left < -2 || r.right > W + 2) tasan.push(e.id || e.className);
    });
    return { cak: Math.round(cak), tasan };
  });
  if (menu && menu.cak > 200)
    bul("🎨", UYARI, "Logo üstüne binen öğe", `${menu.cak}px² çakışma`,
        "Marka adı okunmuyor");
  else ok("🎨", "Ana menü düzeni", "logo temiz, çakışma yok");
  if (menu && menu.tasan.length)
    bul("🎨", UYARI, "Ekran dışına taşma", menu.tasan.join(", "), "Yatayda kayma var");

  /* ESTETIK DENETIMI — "cakisma yok" demek "guzel" demek degildir.
     Kullanici: "kolyede ve logoda simgeler kopyalayip yapistirilmis gibi,
     hicbir estetik yok" dedi ve HAKLIYDI - denetci bunu goremedi cunku
     sadece piksel cakismasi oluyordu. Uc yeni olcut: */
  const estetik = await pg.evaluate(async () => {
    const sonuc = {};
    // 1) SAYDAMLIK: gorsel kare kutu gibi mi duruyor?
    //    Kosesi opak ve koyu ise arka plandan kopuk demektir.
    const kontrolEt = async (src) => {
      try {
        const im = new Image(); im.crossOrigin = "anonymous"; im.src = src;
        await im.decode();
        const c = document.createElement("canvas");
        c.width = im.naturalWidth; c.height = im.naturalHeight;
        const x = c.getContext("2d"); x.drawImage(im, 0, 0);
        const kose = [[2,2],[c.width-3,2],[2,c.height-3],[c.width-3,c.height-3]];
        let opak = 0;
        for (const [px,py] of kose) {
          const d = x.getImageData(px,py,1,1).data;
          if (d[3] > 200) opak++;
        }
        return { opakKose: opak, boyut: c.width+"x"+c.height };
      } catch(e) { return null; }
    };
    const logo = document.querySelector(".logoWrap .logo");
    if (logo) sonuc.logo = await kontrolEt(logo.src);
    // 2) TEKRAR: ayni sembol ekranda kac kez var?
    const emSayisi = document.querySelectorAll(".logoWrap .em").length;
    sonuc.logoEtrafiSembol = emSayisi;
    // 3) BINDIRME: kolye karakterin yuzune giriyor mu?
    const hero = document.getElementById("heroImg");
    const am = document.querySelector(".heroAmulet");
    if (hero && am) {
      const hr = hero.getBoundingClientRect(), ar = am.getBoundingClientRect();
      const merkezY = (ar.top + ar.height/2 - hr.top) / hr.height;
      sonuc.kolyeYuzde = Math.round(merkezY * 100);   // %35 ustu = yuze giriyor
      sonuc.kolyeGenislik = Math.round(ar.width / hr.width * 100);
    }
    return sonuc;
  });

  if (estetik.logo && estetik.logo.opakKose >= 3)
    bul("🎨", UYARI, "Logo kare kutu gibi duruyor",
        `4 köşenin ${estetik.logo.opakKose}'ü opak (${estetik.logo.boyut})`,
        "Saydamlık yok → arka plandan kopuk, yapıştırılmış görünür");
  else ok("🎨", "Logo arka plana karışıyor", "köşeler saydam");

  if (estetik.logoEtrafiSembol > 0)
    bul("🎨", UYARI, "Logo etrafında ek sembol",
        `${estetik.logoEtrafiSembol} adet`,
        "Logo zaten elementleri içeriyorsa bu TEKRAR olur");
  else ok("🎨", "Logo tekrarsız", "etrafında ek sembol yok");

  if (estetik.kolyeYuzde !== undefined) {
    if (estetik.kolyeYuzde < 36)
      bul("🎨", UYARI, "Kolye yüze giriyor", `%${estetik.kolyeYuzde} yükseklikte`,
          "Göğse oturmalı (~%45)");
    else if (estetik.kolyeGenislik > 26)
      bul("🎨", UYARI, "Kolye orantısız büyük", `%${estetik.kolyeGenislik} genişlik`,
          "Karakteri eziyor");
    else ok("🎨", "Kolye oturmuş",
            `y%${estetik.kolyeYuzde} · genişlik %${estetik.kolyeGenislik}`);
  }

  // font yüklendi mi
  const font = await pg.evaluate(async () => {
    try { await document.fonts.ready;
      return document.fonts.check("16px STONEBREAKING"); } catch(e) { return null; }
  });
  if (font === false) bul("🎨", UYARI, "Marka fontu yüklenmedi",
                          "STONEBREAKING fontu bulunamadı", "Yedek fonta düşüyor");
  else ok("🎨", "Marka fontu yüklü", "STONEBREAKING");

  // perde taraması
  if (!HIZLI) {
    const nAct = await pg.evaluate(() => STORY.length);
    let sorunlu = 0, toplam = 0;
    for (let ai = 0; ai < nAct; ai++) {
      const nP = await pg.evaluate(i => STORY[i].panels.length, ai);
      for (let pi = 0; pi < nP; pi++) {
        await pg.evaluate(([i,j]) => {
          ST = { act: STORY[i], i: j, done: null, queue: null };
          show("s-story"); paintPanel();
        }, [ai, pi]);
        await pg.waitForTimeout(2200);
        const m = await pg.evaluate(() => {
          const sec = document.getElementById("s-story");
          const img = document.getElementById("stImg");
          const body = document.getElementById("stBody");
          const txt = document.getElementById("stText");
          const br = body.getBoundingClientRect();
          return { yuklu: img.naturalWidth > 0,
                   pay: Math.round(br.height / sec.clientHeight * 100),
                   tasma: txt.scrollHeight > txt.clientHeight + 12,
                   img: img.getAttribute("src").split("/").pop() };
        });
        toplam++;
        const s = [];
        if (!m.yuklu) s.push("görsel yok");
        if (m.tasma) s.push("metin taşıyor");
        if (m.pay > 52) s.push(`blok %${m.pay}`);
        if (s.length) { sorunlu++;
          bul("🎨", UYARI, `Perde ${ai}.${pi} (${m.img})`, s.join(" · "),
              "Sahne çerçevesi bozuk"); }
      }
    }
    if (!sorunlu) ok("🎨", "Perdeler temiz", `${say(toplam,"panel")} tarandı, sorun yok`);
  }

  // üç ekran boyutunda taşma
  for (const [w,h,ad] of [[360,640,"küçük"],[430,860,"orta"],[768,1024,"tablet"]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.evaluate(() => { backHome(); });
    await pg.waitForTimeout(400);
    const t = await pg.evaluate(() => {
      const W = innerWidth; let n = 0;
      document.querySelectorAll("#s-splash *").forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width && (r.left < -3 || r.right > W + 3)) n++;
      });
      return n;
    });
    if (t > 0) bul("🎨", UYARI, `Taşma: ${ad} ekran (${w}px)`, say(t,"öğe"), "Yatay kayma");
    else ok("🎨", `Düzen: ${ad} ekran`, `${w}×${h} temiz`);
  }
  await pg.setViewportSize({ width: 430, height: 860 });

  /* ============ 💰 FİNANSMANCI: para kazandırır mı? ============ */
  console.log(`${C.B}💰 FİNANSMANCI${C.x} ${C.d}— dönüşümü ne bozuyor?${C.x}`);

  // yükleme ağırlığı
  const agirlik = await pg.evaluate(() => {
    const r = performance.getEntriesByType("resource");
    let b = 0; r.forEach(x => b += (x.transferSize || x.encodedBodySize || 0));
    return { kb: Math.round(b/1024), adet: r.length };
  });
  if (agirlik.kb > 3000) bul("💰", UYARI, "İlk yükleme ağır", `${agirlik.kb} KB`,
                             "3MB üstü kurulum bırakma oranını artırır");
  else ok("💰", "Yükleme ağırlığı", `${agirlik.kb} KB · ${say(agirlik.adet,"dosya")}`);

  // para kapıları
  const gelir = await pg.evaluate(() => ({
    enerjiPaneli: typeof openEnergyPanel === "function",
    abonelik: typeof t === "function" && !!t("subTitle"),
    meydanOkuma: typeof challengeLink === "function",
    olcumSinavi: typeof startExam === "function",
    bilgelikPaylas: typeof showWisdom === "function",
    bulutKayit: typeof firebase !== "undefined"
  }));
  const eksikGelir = Object.entries(gelir).filter(([k,v]) => !v).map(([k]) => k);
  if (eksikGelir.includes("bulutKayit"))
    bul("💰", KRITIK, "Bulut kayıt yok", "firebase tanımlı değil",
        "Telefon değişince ilerleme gider → ABONELİK SATILAMAZ");
  const digerEksik = eksikGelir.filter(k => k !== "bulutKayit");
  if (digerEksik.length) bul("💰", UYARI, "Gelir kapısı eksik", digerEksik.join(", "), "");
  ok("💰", "Çalışan gelir kapıları",
     Object.entries(gelir).filter(([k,v])=>v).map(([k])=>k).join(", "));

  // viral: paylaşım noktaları
  const viral = await pg.evaluate(() => ({
    sozPaylas: typeof shareExam === "function" || typeof showWisdom === "function",
    meydanLink: typeof challengeLink === "function",
    aileKarnesi: typeof shareFamily === "function" || typeof renderFamily === "function"
  }));
  const vSayi = Object.values(viral).filter(Boolean).length;
  if (vSayi < 2) bul("💰", UYARI, "Viral motor zayıf", `${vSayi}/3 paylaşım noktası`,
                     "Organik büyüme yavaşlar");
  else ok("💰", "Viral motor", `${vSayi}/3 paylaşım noktası aktif`);

  // ilk seans ödülü — oyuncu ilk oturumda ne kazanıyor?
  const odul = await pg.evaluate(() => {
    const ilk = [];
    if (sceneAt(1)) ilk.push("Sv1 hikaye anı");
    if (STORY.find(a => a.at === 1)) ilk.push("açılış perdesi");
    if (typeof maybeWisdom === "function") ilk.push("bilgelik sözü");
    return ilk;
  });
  if (odul.length < 2) bul("💰", UYARI, "İlk seans ödülü zayıf", odul.join(", "),
                           "İkinci oturuma dönüş düşer");
  else ok("💰", "İlk seans ödülü", odul.join(" + "));

  await pg.screenshot({ path: `${SHOT}/son.png` });
  await browser.close();

  /* ============ RAPOR ============ */
  console.log(`\n${C.B}══════════════════════ RAPOR ══════════════════════${C.x}`);
  const kritik = bulgular.filter(b => b.seviye === KRITIK);
  const uyari  = bulgular.filter(b => b.seviye === UYARI);
  const gecen  = bulgular.filter(b => b.seviye === "OK");

  for (const g of ["🎩","💰","🎮","🎨"]) {
    const mine = bulgular.filter(b => b.goz === g);
    if (!mine.length) continue;
    const ad = {"🎩":"PATRON","💰":"FİNANSMANCI","🎮":"TASARIMCI","🎨":"GRAFİKER"}[g];
    const k = mine.filter(b=>b.seviye===KRITIK).length;
    const u = mine.filter(b=>b.seviye===UYARI).length;
    const durum = k ? `${C.r}${k} KRİTİK${C.x}` : u ? `${C.y}${u} uyarı${C.x}` : `${C.g}temiz${C.x}`;
    console.log(`\n${g} ${C.B}${ad}${C.x} — ${durum}`);
    mine.filter(b=>b.seviye!=="OK").forEach(b => {
      const im = b.seviye===KRITIK ? `${C.r}✗${C.x}` : `${C.y}!${C.x}`;
      console.log(`   ${im} ${b.baslik}: ${C.d}${b.detay}${C.x}`);
      if (b.oneri) console.log(`     ${C.d}→ ${b.oneri}${C.x}`);
    });
    mine.filter(b=>b.seviye==="OK").forEach(b =>
      console.log(`   ${C.g}✓${C.x} ${b.baslik} ${C.d}${b.detay}${C.x}`));
  }

  console.log(`\n${C.B}───────────────────────────────────────────────────${C.x}`);
  console.log(`geçen ${C.g}${gecen.length}${C.x} · uyarı ${C.y}${uyari.length}${C.x} · kritik ${C.r}${kritik.length}${C.x}`);

  if (kritik.length) {
    console.log(`\n${C.r}${C.B}🎩 PATRON KARARI: YAYINLAMA.${C.x}`);
    console.log(`${C.r}   ${say(kritik.length,"kırıcı sorun")} var:${C.x}`);
    kritik.forEach(b => console.log(`${C.r}   • ${b.baslik}${C.x}`));
  } else if (uyari.length > 3) {
    console.log(`\n${C.y}${C.B}🎩 PATRON KARARI: YAYINLA ama ${say(uyari.length,"eksik")} not düş.${C.x}`);
  } else {
    console.log(`\n${C.g}${C.B}🎩 PATRON KARARI: YAYINLANABİLİR.${C.x}`);
    if (uyari.length) console.log(`${C.d}   (${say(uyari.length,"küçük uyarı")} var, engel değil)${C.x}`);
  }
  console.log("");

  fs.writeFileSync(__dirname + "/patron_rapor.json",
    JSON.stringify({ tarih:new Date().toISOString(), url:URL, bulgular }, null, 1));
  process.exit(kritik.length ? 1 : 0);
})();
