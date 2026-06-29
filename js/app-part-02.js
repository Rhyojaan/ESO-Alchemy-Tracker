function renderProfiles(){
 let box=document.getElementById("profileButtons");
 let current=document.getElementById("currentArchiveBox");
 let p=profile();
 if(current&&p)current.innerHTML=`<b>${p.name}</b><br><span class=small>Aldren is currently keeping this archive open.</span>`;
 if(!box)return;
 box.innerHTML=archive.profiles.map(p=>`<button class="${p.id===archive.activeProfile?'good':'secondary'}" onclick="switchProfile('${p.id}')">${p.name}</button>`).join("");
}

function ensureReady(){
 if(!archive.profiles.length){
  setup.style.display="block";
  app.style.display="none";
  return false;
 }
 setup.style.display="none";
 app.style.display="block";
 return true;
}

function snapshot(){return JSON.stringify({archive})}
function restore(s){archive=JSON.parse(s).archive}

function common(c){
 let m={};
 c.forEach(r=>[...new Set(R[r])].forEach(t=>m[t]=(m[t]||0)+1));
 return Object.keys(m).filter(t=>m[t]>1);
}

function combos(){
 let a=Object.keys(R),o=[];
 for(let i=0;i<a.length;i++)
  for(let j=i+1;j<a.length;j++){
   o.push([a[i],a[j]]);
   for(let k=j+1;k<a.length;k++)o.push([a[i],a[j],a[k]]);
  }
 return o;
}
const ALL=combos();

function scoreCombo(c,state=data(),invOnly=inventoryOnly){
 if(invOnly&&c.some(r=>Number(state[r].qty||0)<1))return null;
 let sh=common(c),disc=[];
 c.forEach(r=>R[r].forEach((t,i)=>{
  if(sh.includes(t)&&!state[r].learned[i])disc.push([r,t,i]);
 }));
 if(!disc.length)return null;
 let ownedBonus=c.reduce((a,r)=>a+Math.min(Number(state[r].qty||0),3),0)/10;
 let favBonus=c.reduce((a,r)=>a+(state[r].fav?.15:0),0);
 return{c,sh,disc,score:disc.length+ownedBonus+favBonus};
}

function ranked(state=data(),invOnly=inventoryOnly){
 return ALL.map(c=>scoreCombo(c,state,invOnly)).filter(Boolean).sort((a,b)=>b.score-a.score);
}

function cloneState(x){return JSON.parse(JSON.stringify(x))}
function applyCraftToState(state,craft){
 craft.disc.forEach(d=>state[d[0]].learned[d[2]]=true);
 craft.c.forEach(r=>state[r].qty=Math.max(0,Number(state[r].qty||0)-1));
}

function countKnown(){return Object.values(data()).reduce((a,x)=>a+x.learned.filter(Boolean).length,0)}
function countComplete(){return Object.keys(R).filter(r=>data()[r].learned.filter(Boolean).length==4).length}
function esc(s){return s.replaceAll("'","\\'")}
function setQty(r,n){data()[r].qty=Math.max(0,Number(data()[r].qty||0)+n);save()}

function chooseGreeting(name,known,total,low){
 let pct=Math.round(known/total*100),hour=new Date().getHours(),o=[];
 if(known===0){
  o.push(`Welcome, ${name}. The archives stand ready. Together, we shall begin recording Tamriel's alchemical secrets.`);
  o.push(`Welcome, ${name}. I have prepared a fresh ledger. The first discovery awaits.`);
  o.push(`The workshop is quiet, ${name}. A fine time to begin our archive.`);
 }
 if(pct>=100){
  o.push(`Welcome back, ${name}. Every known reagent has yielded its secrets.`);
  o.push(`There is no unfinished report today, ${name}. The archives stand complete.`);
 }
 if(low>0){
  o.push(`Welcome back, ${name}. Before today's research begins, ${low} reagent reserve${low>1?"s have":" has"} fallen below your preferred limit.`);
  o.push(`${name}, I have reviewed your satchel. ${low} reserve${low>1?"s need":" needs"} attention.`);
  o.push(`A brief note before we begin: your supplies are running light in ${low} place${low>1?"s":""}.`);
 }
 if(pct>0&&pct<50){
  o.push(`Welcome back, ${name}. The archives grow stronger with every discovery.`);
  o.push(`Good to see you, ${name}. Several mysteries remain, but our records are improving.`);
  o.push(`The early work is often the most important. Let us continue.`);
 }
 if(pct>=50&&pct<90){
  o.push(`Welcome back, ${name}. Few alchemists keep records this carefully. Let us continue.`);
  o.push(`Your archive has passed the halfway mark. Aldren approves of this diligence.`);
  o.push(`The shelves grow heavy with knowledge, ${name}. There is still work to do.`);
 }
 if(pct>=90&&pct<100){
  o.push(`Welcome back, ${name}. Only a handful of mysteries remain.`);
  o.push(`We are close now, ${name}. The remaining secrets will not hide forever.`);
  o.push(`The archive is nearly complete. Let us finish with care.`);
 }
 if(hour<5)o.push(`A late hour for research, ${name}. Still, the workshop is ready.`);
 else if(hour<12)o.push(`Good morning, ${name}. The reagents are sorted and today's notes are ready.`);
 else if(hour<18)o.push(`Good afternoon, ${name}. Aldren has prepared your report.`);
 else o.push(`Good evening, ${name}. The workshop lanterns are lit.`);
 o.push(`Good to see you, ${name}. Aldren the Archivist has prepared your report.`);
 o.push(`The workshop is ready. Let us see what the archives require today.`);
 o.push(`Welcome back, ${name}. Your records have been preserved.`);
 return o[Math.floor(Math.random()*o.length)];
}

function gatherAdvice(){
 let theoretical=ALL.map(c=>scoreCombo(c,data(),false)).filter(Boolean).sort((a,b)=>b.score-a.score)[0];
 if(!theoretical)return "The archives may be complete, or no useful experiment remains.";
 let missing=theoretical.c.filter(r=>Number(data()[r].qty||0)<1);
 return `Aldren found no useful discovery you can craft with your current reagents.<br><br><span class=small>To pursue the strongest next experiment, gather:</span><br>${missing.map(x=>`<span class=pill>${x}</span>`).join("")}`;
}

function buildPlan(){
 let state=cloneState(data()),steps=[],safety=0;
 while(safety++<80){
  let r=ranked(state,inventoryOnly)[0];
  if(!r)break;
  steps.push(r);
  applyCraftToState(state,r);
 }
 planSummary.innerHTML=steps.length?`Plan found: <b>${steps.length}</b> experiments. Estimated new traits: <b>${steps.reduce((a,s)=>a+s.disc.length,0)}</b>.`:"No useful plan found. Try turning inventory-only OFF.";
 planList.innerHTML=steps.slice(0,30).map((s,i)=>`<div class=planStep><b>Experiment #${i+1}</b><br>${s.c.join(" + ")}<br><span class=small>${s.disc.length} discoveries: ${s.disc.map(d=>d[1]).join(", ")}</span></div>`).join("");
}

function showTab(id,btn){
 document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
 btn.classList.add('active');
 renderBuilder();
}