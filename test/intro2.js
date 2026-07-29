/* Perde I'i GORMUS oyuncu senaryosu — kullanicinin yasadigi durum.
   "Sitede degisiklik goremiyorum": acilis perdesi bir kez izlenince
   bir daha hic acilmiyordu. Artik menude "tekrar izle" butonu var. */
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:8899/";
let pass=0, fail=0;
const ok=(c,m)=>{ c?(pass++,console.log("  ✓ "+m)):(fail++,console.log("  ✗ "+m)); };
(async()=>{
  const b=await chromium.launch();
  const pg=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; pg.on("pageerror",e=>errs.push(e.message));
  await pg.goto(URL,{waitUntil:"networkidle"});
  await pg.evaluate(()=>localStorage.clear());
  await pg.reload({waitUntil:"networkidle"});
  await pg.waitForTimeout(900);
  const screen=()=>pg.evaluate(()=>(document.querySelector(".screen.on")||{}).id);
  for(let i=0;i<12;i++){ const s=await screen(); if(s==="s-splash")break;
    if(s==="s-age")await pg.locator(".agebtn").nth(2).click();
    else if(s==="s-auth")await pg.locator("#authLocal").click().catch(()=>{});
    else if(s==="s-newprof"){await pg.locator("#npName").fill("Kanka").catch(()=>{});await pg.locator("#npSave").click();}
    else if(s==="s-profiles"){const a=pg.locator("#profAdd");
      if(await a.count())await a.click(); else await pg.locator(".prof").first().click();}
    else break; await pg.waitForTimeout(450); }

  console.log("\nA. YENI OYUNCU");
  // Ikincil menu artik katlanir: once ac
  await pg.locator("#goMore").click(); await pg.waitForTimeout(350);
  const hidden = await pg.evaluate(()=>getComputedStyle(document.getElementById("goIntro")).display);
  ok(hidden==="none","acilisi gormemise 'tekrar izle' butonu gizli");
  ok(/Yolculuğa Başla/.test(await pg.textContent("#goStart")),"yeni oyuncuya 'Başla' yaziyor");
  ok(/Efsane seni bekliyor/.test(await pg.textContent("#journeyCard")),"yolculuk karti vaat gosteriyor");

  // Perde I'i gormus gibi isaretle (kullanicinin durumu)
  console.log("\nB. PERDE I'I GORMUS OYUNCU (kullanicinin durumu)");
  await pg.evaluate(()=>{ S.acts=[0]; S.spirit=S.spirit||"pyro"; S.sessions=3; S.level=7; save(); refreshSplash(); });
  await pg.waitForTimeout(300);
  ok(/Devam Et/.test(await pg.textContent("#goStart")),"donen oyuncuya 'Devam Et' yaziyor");
  ok(/sunak kaldı/.test(await pg.textContent("#journeyCard")),"yolculuk karti hedefi gosteriyor");
  if(await pg.evaluate(()=>document.getElementById("moreBox").style.display==="none"))
    { await pg.locator("#goMore").click(); await pg.waitForTimeout(350); }
  const shown = await pg.evaluate(()=>getComputedStyle(document.getElementById("goIntro")).display);
  ok(shown!=="none","'Efsanenin Başlangıcını İzle' butonu gorunur oldu");
  const label = await pg.textContent("#goIntro");
  ok(/Efsanenin/.test(label),"buton metni dogru: "+label.trim());

  await pg.click("#goIntro");
  await pg.waitForTimeout(600);
  ok(await screen()==="s-story","buton acilis perdesini oynatti");
  await pg.waitForTimeout(2200);
  const orbs=await pg.$$eval("#stOrbit .orb",n=>n.length);
  ok(orbs===4,"dort ruh uyaniyor ("+orbs+")");

  // son panele kadar ilerle, "devami icin oyna" sozlesmesi var mi
  console.log("\nC. HIKAYE SOZLESMESI");
  for(let i=0;i<3;i++){ await pg.click("#stNext"); await pg.waitForTimeout(700); }
  const txt=await pg.textContent("#stText");
  ok(/Her sunağı geçtiğinde/.test(txt),"son panel 'oynadikca acilir' diyor");
  ok(/onuncu sunakta/i.test(txt),"bir sonraki perdeye somut kanca var (Sv10)");
  const btn=await pg.textContent("#stNext");
  ok(/İlk Taşı Kır/.test(btn),"cikis butonu oyuna cagiriyor: "+btn.trim());

  // bitince MENUYE donmeli (oyuna degil) - tekrar izlemede
  await pg.click("#stNext");
  await pg.waitForTimeout(900);
  ok(await screen()==="s-splash","tekrar izleyince menuye donuyor, oyuna zorlamiyor");

  console.log("\nD. SURUM DAMGASI");
  const sv=await pg.evaluate(async()=>{ const r=await fetch("surum.json?t="+Date.now(),{cache:"no-store"});
    return r.ok?(await r.json()).build:null; });
  ok(!!sv,"surum.json okunuyor: "+sv);
  const bd=await pg.evaluate(()=>typeof BUILD!=="undefined"?BUILD:null);
  ok(bd===sv,"sayfa surumu = sunucu surumu ("+bd+")");

  ok(errs.length===0,"konsol hatasi yok"+(errs.length?" -> "+errs[0]:""));
  console.log(`\n${pass} gecti, ${fail} kaldi`);
  await b.close(); process.exit(fail?1:0);
})();
