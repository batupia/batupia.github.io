/* 100 SEVIYE = 100 AN denetimi.
   Kullanici: "1.leveli bitirince 2.levele geciyor, hikayeyi 100 levele
   kadar entegre etmedik mi?" -> Sv1 gercekten bostu (sahneler 2-99'du).
   Bu test her seviyede bir an oldugunu ve gorsellerin var oldugunu dogrular. */
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:8899/";
let pass=0, fail=0;
const ok=(c,m)=>{ c?(pass++,console.log("  ✓ "+m)):(fail++,console.log("  ✗ "+m)); };
(async()=>{
  const b=await chromium.launch();
  const pg=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; pg.on("pageerror",e=>errs.push(e.message));
  const miss404=[]; pg.on("response",r=>{ if(r.status()===404) miss404.push(r.url()); });
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
    else break; await pg.waitForTimeout(400); }

  console.log("\nA. HER SEVIYEDE BIR AN VAR MI?");
  const rep = await pg.evaluate(()=>{
    const acts={}, scenes={}, bos=[], bg={};
    for(let lv=1; lv<=100; lv++){
      const a=STORY.find(x=>x.at===lv);
      const s=sceneAt(lv);
      if(a) acts[lv]=1;
      if(s){ scenes[lv]=1; bg[lv]=s.bg; }
      if(!a && !s) bos.push(lv);
    }
    return {nAct:Object.keys(acts).length, nScene:Object.keys(scenes).length,
            bos, bgs:bg, prog:storyProgress()};
  });
  ok(rep.bos.length===0, "1-100 arasi bos seviye yok"+(rep.bos.length?" -> "+rep.bos.join(","):""));
  ok(rep.nAct===10, "10 perde yerinde ("+rep.nAct+")");
  ok(rep.nScene===91, "91 sahne yerinde ("+rep.nScene+")");
  ok(rep.prog.total===100, "sayac toplami 100 (marka sozu) -> "+rep.prog.total);

  console.log("\nB. SV1 — ILK ZAFER (kullanicinin bildirdigi hata)");
  const s1=await pg.evaluate(()=>{const x=sceneAt(1);return x?{t:x.txt,bg:x.bg}:null});
  ok(!!s1, "Sv1 bitince sahne geliyor" + (s1?": \""+s1.t.slice(0,42)+"...\"":""));
  ok(s1 && s1.bg!=="ch1_denge" && s1.bg!=="ch3_cagri",
     "Sv1 sahnesi acilis perdesiyle ayni gorseli kullanmiyor ("+(s1&&s1.bg)+")");

  console.log("\nC. GORSELLER GERCEKTEN VAR MI?");
  const bgs=[...new Set(Object.values(rep.bgs))];
  const bad=[];
  for(const g of bgs){
    const r=await pg.evaluate(async u=>{ const x=await fetch(u,{method:"HEAD"}); return x.status; },
      "assets/story/"+g+".webp");
    if(r!==200) bad.push(g+"="+r);
  }
  ok(bad.length===0, bgs.length+" benzersiz sahne gorseli, hepsi yerinde"+(bad.length?" -> "+bad:""));

  console.log("\nD. GERCEK OYNANIS: Sv1 ve Sv2 bitirilince sahne aciliyor mu?");
  await pg.evaluate(()=>{ S.spirit="pyro"; S.sessions=1; S.acts=[0]; S.level=1; S.scenes=[]; save(); });
  for(const lv of [1,2]){
    await pg.evaluate(()=>{ const m=document.getElementById("modal"); if(m)m.classList.remove("on");
                            const sc=document.getElementById("scene"); if(sc)sc.classList.remove("on"); });
    await pg.evaluate(()=>startLevel());
    await pg.waitForTimeout(800);
    await pg.evaluate(()=>endLevel(true,"test"));
    await pg.waitForTimeout(2200);
    const on=await pg.evaluate(()=>document.getElementById("scene").classList.contains("on"));
    const txt=on?(await pg.textContent("#sceneTxt")).slice(0,38):"";
    ok(on, "Sv"+lv+" bitti -> gunluk sayfasi acildi"+(on?": \""+txt+"...\"":""));
    if(on) await pg.click("#sceneNext");
    await pg.waitForTimeout(600);
  }

  console.log("\nE. SAGLIK");
  ok(errs.length===0,"konsol hatasi yok"+(errs.length?" -> "+errs[0]:""));
  ok(miss404.length===0,"404 yok"+(miss404.length?" -> "+miss404[0]:""));
  console.log(`\n${pass} gecti, ${fail} kaldi`);
  await b.close(); process.exit(fail?1:0);
})();
