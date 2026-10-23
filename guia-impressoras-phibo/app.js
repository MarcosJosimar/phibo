(() => {
'use strict';
const D=JSON.parse(document.getElementById('site-data').textContent);
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const create=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const ext=(a,url)=>{a.href=url;a.target='_blank';a.rel='noopener noreferrer sponsored';return a};
const DATA_ORDER=['33 × 21 mm','40 × 25 mm','50 × 30 mm','50 × 75 mm'];
let category='etiquetas';
function closeMenus(except=null){$$('details.buy[open]').forEach(x=>{if(x!==except)x.open=false})}
function categorySwitch(which,{scroll=false}={}){
  if(!['etiquetas','cupom','a4','leitores'].includes(which))return;
  category=which; closeMenus();
  $$('[data-tab]').forEach(b=>{
    const active=b.dataset.tab===which;
    b.classList.toggle('active',active);
    b.setAttribute('aria-selected',String(active));
    b.tabIndex=active?0:-1;
  });
  $$('[data-panel]').forEach(p=>{p.hidden=p.dataset.panel!==which});
  try{if(history.replaceState)history.replaceState(null,'','#'+which)}catch(_){/* sandboxed viewer may block History API */}
  if(scroll) $('#main').scrollIntoView({behavior:'smooth',block:'start'});
}
function groupSwitch(which){
  $$('[data-subtab]').forEach(b=>{let current=b.dataset.subtab===which;b.classList.toggle('active',current);b.setAttribute('aria-selected',String(current))});
  $$('[data-subpanel]').forEach(p=>p.hidden=p.dataset.subpanel!==which);
  closeMenus();
}
function imgBlock(key,name){
  const wrapper=create('div','photo');const src=D.photos[key];
  if(!src){wrapper.append(create('span','', '🖨️'));return wrapper}
  const btn=create('button','photo-trigger');btn.type='button';btn.setAttribute('aria-label','Ampliar imagem: '+name);btn.title='Clique para ampliar a imagem';
  const im=create('img');im.src=src;im.alt=name;im.loading='lazy';btn.append(im);btn.onclick=()=>openPhoto(key,name);wrapper.append(btn);return wrapper;
}
function openPhoto(key,name){
  const d=$('#photoModal');d.replaceChildren(dialogHead(name,'photoModal'));
  const im=create('img');im.src=D.photos[key];im.alt=name;d.append(im,create('p','photocaption','Imagem de referência. Confira o modelo anunciado antes de comprar.'));
  if(!d.open)d.showModal();
}
function tag(txt,cls=''){return create('span','tag '+cls,txt)}
function action(label,url){return ext(create('a','action',label+' ↗'),url)}
function buy(label,links){
  const valid=(links||[]).filter(x=>/^https:\/\//.test(x?.[1]||''));
  if(!valid.length)return null;
  if(valid.length===1)return action(label,valid[0][1]);
  const d=create('details','buy'),s=create('summary','action',label+' ▾'),options=create('div','buymenu');
  valid.forEach((x,i)=>options.append(ext(create('a','',`Onde comprar ${i+1} ↗`),x[1])));
  d.append(s,options);d.addEventListener('toggle',()=>{if(d.open)closeMenus(d)});return d;
}
function newLabelMenu(){
  const d=create('details','buy');const s=create('summary','action secondary','Onde comprar etiqueta ▾');
  const menu=create('div','buymenu new-format-menu');d.append(s,menu);
  for(const size of DATA_ORDER){
    const label=D.newLabels.find(x=>x.size===size);if(!label)continue;
    const b=create('button',size==='50 × 75 mm'?'gold':'',size+(size==='50 × 75 mm'?' · Plano Ouro':''));
    b.type='button';b.onclick=()=>{d.open=false;openLabel(label,true)};menu.append(b);
  }
  d.addEventListener('toggle',()=>{if(d.open)closeMenus(d)});
  return d;
}
function modelCard(p,type){
  const card=create('article','card');card.append(imgBlock(p.img||p.imgs?.[0],p.brand+' '+p.name));
  const info=create('div','info');info.append(create('span','brandname',p.brand),create('h3','',p.name));
  const m=create('div','meta');
  if(type==='coupon'){
    m.append(tag('Conexão: '+p.conn),tag('Bobina: 80 mm'));
    if(p.warning)m.append(tag('Não comprar MP-4200 ADV','alert'));
    if(p.id==='pos80')m.append(tag('Conferir modelo e driver','alert'));
  }
  if(type==='new')m.append(tag('Compatibilidade: confirmar com o suporte'));
  info.append(m);
  const actions=create('div','actions');
  const primary=buy(type==='coupon'?'Onde comprar':'Onde comprar impressora',p.links);
  if(primary)actions.append(primary);
  if(type==='traditional'){
    const b=create('button','action secondary','Modelo de etiqueta compatível ↓');b.type='button';
    b.onclick=()=>$('#formatos-trad').scrollIntoView({behavior:'smooth',block:'start'});actions.append(b);
  }
  if(type==='new')actions.append(newLabelMenu());
  info.append(actions);card.append(info);return card;
}
function lineRoll(n){const r=create('div','roll');for(let i=0;i<n;i++)r.append(create('i'));r.setAttribute('aria-label',n+' etiquetas por fileira');return r}
function labelCard(l,updated){
  const b=create('button','format'+(l.size==='50 × 75 mm'?' gold-format':''));b.type='button';b.setAttribute('aria-label','Visualizar etiqueta '+l.size);
  b.append(lineRoll(l.cols),create('strong','',l.size),create('small','',l.title));
  if(l.size==='50 × 75 mm')b.append(create('span','badge','Exclusivo Plano Ouro'));
  b.onclick=()=>openLabel(l,updated);return b;
}
function dialogHead(title,id){
  const h=create('div','modtop'),b=create('button','close','×');b.type='button';b.setAttribute('aria-label','Fechar');b.onclick=()=>$('#'+id).close();
  h.append(create('h2','',title),b);return h;
}
function openLabel(l,updated){
  const d=$('#labelModal');d.replaceChildren(dialogHead(l.size+' · '+l.title,'labelModal'));
  if(updated && l.img && D.photos[l.img]){const i=create('img');i.src=D.photos[l.img];i.alt='Etiqueta '+l.size;d.append(i)}
  else d.append(lineRoll(l.cols));
  d.append(create('p','moddesc',`${l.cols} ${l.cols===1?'etiqueta':'etiquetas'} por fileira. ${l.text||l.desc||''}`));
  if(l.size==='50 × 75 mm')d.append(create('span','badge','EXCLUSIVO DO PLANO OURO'));
  const group=create('div','modlinks');
  // One confirmed affiliate URL for the thermal 33×21 in the recently received request.
  for(const [_,url] of (l.links||[]))group.append(action('Onde comprar',l.size==='33 × 21 mm'?'https://meli.la/2KMjWDX':url));
  (l.examples||[]).forEach((ref,index)=>{const b=create('button','action secondary','Visualizar exemplo '+(index+1));b.type='button';b.onclick=()=>openExample(l,index);group.append(b)});
  d.append(group,create('p','modalnote','Links de referência. Confira o tamanho, a compatibilidade e o plano antes da compra.'));
  if(!d.open)d.showModal();
}
function openExample(l,index){
  const d=$('#exampleModal');d.replaceChildren(dialogHead(l.size+' · Exemplo '+(index+1),'exampleModal'));
  const ref=l.examples[index][1];
  d.append(create('p','modalnote','Se a pré-visualização externa não carregar, abra o exemplo original.'));
  const frame=create('iframe','modiframe');frame.src=ref;frame.loading='lazy';frame.title='Exemplo de '+l.size;d.append(frame);
  const buttons=create('div','modlinks');buttons.append(action('Abrir exemplo original',ref));d.append(buttons);
  if(!d.open)d.showModal();
}
function render(){
  const traditional=$('#trad-cards'),newer=$('#new-cards');
  D.printers.forEach(p=>traditional.append(modelCard(p,'traditional')));
  D.newPrinters.forEach(p=>newer.append(modelCard(p,'new')));
  D.labels.forEach(l=>$('#formatos-trad').append(labelCard(l,false)));

  D.coupons.forEach(p=>$('#cupom-cards').append(modelCard(p,'coupon')));
  D.readers.forEach(p=>{
    const card=create('article','card');let visual=create('div','photo'),glyph=create('span','reader-icon','▥');glyph.setAttribute('aria-hidden','true');visual.append(glyph);card.append(visual);
    const info=create('div','info');info.append(create('span','brandname',p.brand),create('h3','',p.name));
    const m=create('div','meta');m.append(tag(p.conn));info.append(m);
    const row=create('div','actions'),link=buy('Onde comprar',p.links);if(link)row.append(link);info.append(row);card.append(info);$('#reader-cards').append(card);
  });
}
function setup(){
  $$('[data-tab]').forEach(b=>{
    b.addEventListener('click',()=>categorySwitch(b.dataset.tab,{scroll:true}));
    b.addEventListener('keydown',e=>{
      const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();
      const tabs=$$('[data-tab]');let i=tabs.indexOf(b);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[i].focus();categorySwitch(tabs[i].dataset.tab);
    });
  });
  $$('[data-subtab]').forEach(b=>b.addEventListener('click',()=>groupSwitch(b.dataset.subtab)));
  for(const d of $$('.modal')) d.addEventListener('click',e=>{if(e.target===d)d.close()});
  document.addEventListener('click',e=>{if(!e.target.closest('details.buy'))closeMenus()});
  window.addEventListener('hashchange',()=>{const requested=location.hash.slice(1);if(['etiquetas','cupom','a4','leitores'].includes(requested))categorySwitch(requested)});
}
render();setup();groupSwitch('homologadas');
const initial=location.hash.slice(1);
categorySwitch(['etiquetas','cupom','a4','leitores'].includes(initial)?initial:'etiquetas');
})();