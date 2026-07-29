#!/usr/bin/env node
const path=require("path");
try{ module.paths.push(path.join(__dirname,"..","..","..","node_modules")); }catch(e){}
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:8899/";
const C={r:"\x1b[31m", y:"\x1b[33m", g:"\x1b[32m", d:"\x1b[2m", B:"\x1b[1m", x:"\x1b[0m"};
(async()=>{
  console.log(`\n${C.B}🛡️  MARKA GÖZÜ${C.x} — STONEBREAKING marka denetimi\n${C.d}hedef: ${URL}${C.x}\n`);
  const browser=await chromium.launch();
  const pg=await browser.newPage({viewport:{width:430,height:860}});
  await pg.goto(URL,{waitUntil:"networkidle",timeout:60000});
  await pg.evaluate(()=>localStorage.clear());
  await pg.reload({waitUntil:"networkidle"});
  const sc=()=>pg.evaluate(()=> (document.querySelector(".screen.on")||{}).id);
  for(let i=0;i<14;i++){
    const x=await sc();
    if(x==="s-splash") break;
    if(x==="s-age") await pg.locator(".agebtn").nth(2).click();
    else if(x==="s-auth") await pg.locator("#authLocal").click().catch(()=>{});
    else if(x==="s-newprof") break;
    else if(x==="s-profiles"){ const a=pg.locator("#profAdd"); if(await a.count()) await a.click(); }
    else break;
    await pg.waitForTimeout(320);
  }
  let fails=0, passes=0;
  function ok(msg){ console.log(`  ${C.g}✓${C.x} ${msg}`); passes++; }
  function bad(msg){ console.log(`  ${C.r}✗${C.x} ${msg}`); fails++; }
  function warn(msg){ console.log(`  ${C.y}!${C.x} ${msg}`); }
  const ph = await pg.evaluate(()=> document.getElementById("npInput")?.getAttribute("placeholder"));
  if(ph==="STONEBREAKING") ok(`Placeholder doğru: "${ph}"`); else bad(`Placeholder "${ph}" STONEBREAKING olmalı`);
  const defName = await pg.evaluate(()=> { try{ return (typeof blankProfile==="function" ? blankProfile().name : "") }catch(e){ return "hata:"+e.message } });
  if(defName==="STONEBREAKING") ok(`Varsayılan profil ismi STONEBREAKING`); else bad(`Varsayılan profil "${defName}"`);
  const btInfo = await pg.evaluate(()=>{
    const svg = (typeof btTileSVG==="function"? btTileSVG() : "");
    return { hasMedallion: /btTile/.test(svg) && /radialGradient/.test(svg), hasQuadrant: /M50 50 L50 10/.test(svg), hasBT: />BT</.test(svg), viewBox: (svg.match(/viewBox="([^"]+)"/)||[])[1]||"" };
  });
  if(btInfo.hasMedallion && btInfo.hasQuadrant && btInfo.hasBT) ok(`BT Madalyon doğru: kuadrant + BT fırça + vb ${btInfo.viewBox}`); else bad(`BT Madalyon hatalı ${JSON.stringify(btInfo)}`);
  const avInfo = await pg.evaluate(()=>{
    const ag=document.getElementById("npAvatars"); const count = ag? ag.children.length:0;
    const hasDesc = ag ? [...ag.children].some(el=> el.innerHTML.includes("Kor") || el.innerHTML.includes("Ateş")) : false;
    const hasCards = ag ? [...ag.children].some(el=> el.className.includes("av-card")) : false;
    const heroes = document.getElementById("npHeroes"); const hCount = heroes? heroes.children.length:0;
    const hRich = heroes? [...heroes.children].some(el=> el.innerHTML.includes("small")) : false;
    return {count, hasDesc, hasCards, hCount, hRich};
  });
  if(avInfo.count===4 && avInfo.hasDesc && avInfo.hasCards) ok(`Ruh seçme zengin: 4 kart açıklamalı`); else bad(`Ruh seçme basit: ${JSON.stringify(avInfo)}`);
  if(avInfo.hCount===2 && avInfo.hRich) ok(`Kahraman seçimi zengin`); else warn(`Kahraman: ${JSON.stringify(avInfo)}`);
  const logoInfo = await pg.evaluate(()=>{ const hasFunc = typeof stonebreakingLogoSVG==="function"; let html=""; if(hasFunc){ try{ html=stonebreakingLogoSVG("fire"); }catch(e){ html=e.message } } return {hasFunc, hasElement: /fire|water/.test(html) || /#b3261a/.test(html)}; });
  if(logoInfo.hasFunc && logoInfo.hasElement) ok(`Dinamik logo var element renkli`); else bad(`Logo dinamik değil`);
  const storyInfo = await pg.evaluate(()=>{ try{ const first = STORY[0].panels[0].tr.c + " | " + STORY[0].panels[0].en.c; return {first, hasBolum: /BÖLÜM|CHAPTER/.test(first)}; }catch(e){ return {err:e.message} } });
  if(storyInfo.hasBolum) ok(`Story çizgi roman: "${storyInfo.first}"`); else bad(`Story hâlâ Perde: ${JSON.stringify(storyInfo)}`);
  console.log(`\n${C.B}SONUÇ:${C.x} ${C.g}${passes} geçti${C.x}, ${fails?C.r:C.d}${fails} hata${C.x}\n`);
  await browser.close(); process.exit(fails>0?1:0);
})();
