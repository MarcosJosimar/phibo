(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],hide=e=>e&&e.classList.add("ph-hide");
const link=document.createElement("link");link.rel="stylesheet";link.href="phibo-enxuto.css";document.head.append(link);
function el(tag,cls,txt){let n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function roll(n){let d=el("div","ph-roll");d.style.setProperty("--n",String(n));d.setAttribute("aria-label",n+" etiquetas por fileira");for(let i=0;i<n*3;i++)d.append(el("i"));return d}
const modal=el("dialog","ph-dialog"),example=el("dialog","ph-dialog");document.body.append(modal,example);
function head(d,title){const w=el("div","ph-dialog-head"),b=el("button","ph-x","×");b.type="button";b.setAttribute("aria-label","Fechar");b.onclick=()=>d.close();w.append(el("h3","",title),b);return w}
for(const d of [modal,example])d.addEventListener("click",e=>{if(e.target===d)d.close()});
function showExample(l,i){example.replaceChildren(head(example,l.size+" — Exemplo "+(i+1)),el("p","ph-note","Pré-visualização externa: caso não carregue, use o link para abrir o exemplo original."));
const f=el("iframe","ph-example-frame");f.src=l.examples[i][1];f.title="Exemplo de etiqueta "+l.size;example.append(f);
const c=el("div","ph-choices"),a=el("a","","Abrir referência original ↗");a.href=l.examples[i][1];a.target="_blank";a.rel="noopener noreferrer";c.append(a);example.append(c);example.showModal()}
function showLabel(l,updated){modal.replaceChildren(head(modal,l.size+" — "+l.title));if(updated&&l.img&&typeof PHOTOS!=="undefined"&&PHOTOS[l.img]){let img=el("img","ph-dialog-img");img.src=PHOTOS[l.img];img.alt=l.size+" "+l.title;modal.append(img)}else{let d=roll(l.cols);d.style.maxWidth="380px";modal.append(d)}
modal.append(el("p","",l.cols+" "+(l.cols===1?"etiqueta por fileira. ":"etiquetas por fileira. ")+(l.text||l.desc||"")));
if(l.size==="50 × 75 mm")modal.append(el("p","ph-note ph-gold","★ Layout exclusivo do Plano Ouro."));
const c=el("div","ph-choices");if(updated){(l.links||[]).forEach(x=>{let a=el("a","","Onde comprar etiqueta ↗");a.href=l.size==="33 × 21 mm"?"https://meli.la/2KMjWDX":x[1];a.target="_blank";a.rel="noopener noreferrer sponsored";c.append(a)})}
else(l.examples||[]).forEach((x,i)=>{let b=el("button","","Exemplo "+(i+1));b.type="button";b.onclick=()=>showExample(l,i);c.append(b)});
modal.append(c,el("p","ph-note","Confirme o material, o layout contratado e a compatibilidade do equipamento antes da compra."));modal.showModal()}
function menu(title,links){const d=el("details","ph-drop"),h=el("summary","",title+" ▾"),m=el("div","ph-menu");d.append(h,m);links.forEach((x,i)=>{let a=el("a","",links.length>1?"Onde comprar "+(i+1)+" ↗":"Onde comprar ↗");a.href=x.href;a.title=x.label||"";a.target="_blank";a.rel="noopener noreferrer sponsored";m.append(a)});return d}
function printers(){$$("#printerCards .printerCard").forEach(c=>{if(c.dataset.phReady)return;let area=$(".linksArea",c);if(!area)return;c.dataset.phReady="1";let links=$$(".marketLinks a",c).map(a=>({href:a.href,label:a.title||a.textContent}));area.replaceChildren();let a=el("div","ph-actions");a.append(menu("Links para compra",links));let b=el("a","ph-button","Modelos de etiqueta ↓");b.href="#etiquetas";b.onclick=()=>{selectCategory("etiquetas");setTimeout(()=>$("#etiquetas").scrollIntoView({behavior:"smooth"}),20)};a.append(b);area.append(a)})}
printers();$("#searchPrinters")?.addEventListener("input",()=>setTimeout(printers,0));
const current=$("#labelsCurrent");if(current&&typeof LABELS!=="undefined"){current.classList.add("ph-formatlist");current.replaceChildren(...LABELS.map(l=>{let b=el("button","ph-format");b.type="button";b.append(roll(l.cols),el("strong","",l.size),el("small","",l.title+" · visualizar"));b.onclick=()=>showLabel(l,false);return b}))}
const note=$("#etiquetas .compatNotice");if(note){note.replaceChildren(el("strong","","Modelos tradicionais: 50 × 70 mm, 33 × 21 mm e 95 × 12 mm."));let video=$("#etiquetas .videoCard");if(video)note.append(video)}
const intro=$("#visao-geral>div:first-child>p");if(intro)intro.textContent="Selecione uma marca para consultar os modelos e links de compra.";
$$(".overviewTags span").forEach(t=>{let b=el("button","ph-button",t.textContent);b.type="button";b.onclick=()=>{selectCategory("etiquetas");let q=$("#searchPrinters");q.value=t.textContent.trim();q.dispatchEvent(new Event("input",{bubbles:true}));setTimeout(()=>$("#modelos").scrollIntoView({behavior:"smooth"}),20)};t.replaceWith(b)});
if(typeof EVAL_LABELS!=="undefined"){const seq=["33 × 21 mm","40 × 25 mm","50 × 30 mm","50 × 75 mm"].map(sz=>EVAL_LABELS.find(l=>l.size===sz)).filter(Boolean);
$$("#evalPrinters .evalCard").forEach(c=>{const old=$$(".marketLinks a",c).map(a=>({href:a.href,label:a.title||a.textContent}));$(".marketLinks",c)?.remove();let a=el("div","ph-actions");a.append(menu("Onde comprar impressora",old));
let d=el("details","ph-drop"),s=el("summary","","Onde comprar etiqueta ▾"),m=el("div","ph-menu");d.append(s,m);
seq.forEach(l=>{let b=el("button",l.size==="50 × 75 mm"?"ph-gold":"",l.size+(l.size==="50 × 75 mm"?" ★ Plano Ouro":""));b.type="button";b.onclick=()=>{d.open=false;showLabel(l,true)};m.append(b)});a.append(d);c.append(a)})}
const legacy=$("#modelo-elgin-epl");if(legacy){let p=$("p",legacy);if(p)p.textContent="Modelo descontinuado. Quem já possui a Elgin L42 EPL pode consultar as etiquetas 33 × 21, 95 × 12 e 50 × 75 mm (esta última exclusiva do Plano Ouro).";$$("p:not(:first-of-type),.legacyNote",legacy).forEach(hide)}
const faq=$("#duvidas");if(faq){let f=el("details");f.innerHTML="<summary>Impressora de etiquetas também imprime cupons?</summary><p>Não. São categorias de impressoras diferentes. Utilize a aba específica para impressoras de cupom.</p>";faq.insertBefore(f,$("details",faq))}
const isolated=["#inicio","#visao-geral","#etiquetas","#suprimentos","#novidades","#modelo-elgin-epl","#duvidas"];
function selectCategory(category){isolated.forEach(s=>{$(s)?.classList.toggle("ph-hide",category!=="etiquetas")});$("#modelos")?.setAttribute("data-ph-mode",category);
let frame=$("#couponFrame");if(frame&&category==="cupons"&&frame.hasAttribute("srcdoc")){frame.removeAttribute("srcdoc");frame.removeAttribute("onload");frame.addEventListener("load",()=>{let doc;try{doc=frame.contentDocument}catch(e){}if(!doc)return;let adjust=()=>{let h=Math.max(doc.body.scrollHeight,doc.documentElement.scrollHeight,420);frame.style.height=(h+8)+"px"};adjust();try{new ResizeObserver(adjust).observe(doc.body)}catch(e){}});frame.src="impressoras-cupom-phibo.html?integrado=1"}}
$$(".tab").forEach(b=>b.addEventListener("click",()=>{selectCategory(b.dataset.tab);setTimeout(()=>$("#modelos").scrollIntoView({behavior:"smooth",block:"start"}),30)}));
function activateLabels(){const t=$("#tab-etiquetas");if(t?.getAttribute("aria-selected")!=="true")t.click();selectCategory("etiquetas")}
$$('a[href="#etiquetas"],a[href="#novidades"],a[href="#suprimentos"],a[href="#visao-geral"]').forEach(a=>a.addEventListener("click",activateLabels));
selectCategory("etiquetas");
})();