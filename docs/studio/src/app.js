import {header,footer} from './components/layout.js';
import {publicPage,earlyAccess,notFound} from './pages/public.js';
import {home} from './pages/home.js';
import {docsPage} from './pages/docs.js';
import {consolePage} from './pages/console.js';
import {demoPage} from './pages/demo.js';
import {pages,docs} from './data/content.js';
import {consoleNav} from './config.js';
import {platform} from './services/platform.js';
import {usePlatform,startJobs} from './hooks/use-platform.js';
import {esc,table,badge,button,progress} from './components/ui.js';
const app=document.querySelector('#app'),dialog=document.querySelector('#detail-dialog');
let route='',toastTimer;
function currentRoute(){return location.hash.startsWith('#/')?location.hash.slice(2).replace(/\/$/,''):'';}
function render(){const next=currentRoute(),changed=next!==route;route=next;const search=document.querySelector('#table-search')?.value||'',filter=document.querySelector('#table-filter')?.value||'';
 let content,title;
 if(route.startsWith('console/')){const page=route.split('/')[1];content=consolePage(page);title=consoleNav.find(x=>x[1]===page)?.[0]||'Not found';}
 else {let body;if(!route){body=home();title='The Personal Computer for Physical AI';}else if(route==='demo'){body=demoPage();title='Interactive Demo';}else if(route==='early-access'){body=earlyAccess();title='Early Access';}else if(route.startsWith('docs/')){const slug=route.split('/')[1];body=docsPage(slug);title=docs.find(d=>d[0]===slug)?.[1]||'Documentation';}else if(pages[route]){body=publicPage(route);title=pages[route].label||route.replaceAll('-',' ');}else{body=notFound();title='Page not found';}content=header(route)+body+footer();}
 const active=document.activeElement;const focusId=active?.id;const selection=active?.selectionStart;
 app.innerHTML=content;document.title=title+' · AIROBOT';
 if(!changed){if(document.querySelector('#table-search'))document.querySelector('#table-search').value=search;if(document.querySelector('#table-filter'))document.querySelector('#table-filter').value=filter;filterTable();if(focusId){const target=document.getElementById(focusId);target?.focus({preventScroll:true});if(typeof selection==='number'&&target?.type==='search')target.setSelectionRange(selection,selection);}}
 if(changed){window.scrollTo(0,0);document.querySelector('#main')?.focus({preventScroll:true});}
}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4500);}
function openDialog(title,body){dialog.innerHTML=`<div class="dialog-head"><h2>${esc(title)}</h2><button data-action="close-dialog" class="icon-button" aria-label="Close dialog">×</button></div><div class="dialog-body">${body}</div>`;if(!dialog.open)dialog.showModal();}
function choices(items,field='name',predicate=()=>true){return items.filter(predicate).map(x=>`<option value="${esc(x.id)}">${esc(x[field]||x.id)} · ${esc(x.id)}</option>`).join('');}
function field(label,name,type,content){return `<label>${label}${type==='select'?`<select name="${name}" required>${content}</select>`:`<input name="${name}" required maxlength="80" value="${esc(content)}">`}</label>`;}
function formDialog(kind){const s=platform.store.get();let title,fields;
 switch(kind){case 'save':title='Save dataset snapshot';fields=field('Dataset name','name','input','My tabletop collection');break;
 case 'train':title='Start simulated training';fields=field('Dataset','datasetId','select',choices(s.datasets))+`<div class="notice">ACT policy · 10,000 simulated steps · approximately 13 seconds. No compute charges.</div>`;break;
 case 'sim':title='Run simulation';fields=field('Model','modelId','select',choices(s.models))+field('Environment','environment','select','<option>Tabletop / pick & place</option><option>Navigation arena</option>');break;
 case 'deploy':title='Deploy evaluated model';fields=field('Model','modelId','select',choices(s.models))+field('Target robot','robotId','select',choices(s.robots,'name',r=>r.status==='online'))+`<p class="note">A completed simulation for the selected model is required. This creates a local demo deployment.</p>`;break;
 case 'skill':title='Add a skill';fields=field('Skill name','name','input','My new skill')+field('Deployment','deploymentId','select',choices(s.deployments,'id'));break;
 }
 openDialog(title,`<form class="dialog-form" data-form="${kind}">${fields}<p class="form-error" role="alert"></p><button class="btn dark" type="submit">${title}</button></form>`);
}
function inspect(type,id){const s=platform.store.get(),record=s[type]?.find(x=>x.id===id);if(!record)throw new Error('Record no longer exists.');let extra='';if(type==='datasets'){const eps=s.episodes.filter(e=>e.datasetId===id);extra=`<h3>Split allocation</h3><div class="split-bar"><span style="width:80%">Train 80%</span><span style="width:10%">10%</span><span style="width:10%">10%</span></div><p class="note">Validation 10% · Test 10% · Proposed split, not a real partition</p><h3>Episodes (${eps.length})</h3>${table(['Episode','Duration','Frames'],eps.map(ep=>[ep.id,ep.duration+' s',ep.frames]))}<button class="btn small" data-action="export-dataset" data-id="${id}">Export metadata JSON</button>`;}else if(type==='episodes'){extra=`<h3>Episode timeline</h3>${progress(100)}<p class="note">${record.duration} seconds · ${record.frames} synthetic frames. No video frames are stored.</p>`;}openDialog(record.name||record.id,`<div class="notice">${badge('Simulated Data')} Metadata only</div><dl class="key-values">${Object.entries(record).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(typeof v==='object'?JSON.stringify(v):v)}</dd>`).join('')}</dl>${extra}`);}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function filterTable(){const input=document.querySelector('#table-search');if(!input)return;const panel=input.closest('.panel'),q=input.value.toLowerCase(),status=document.querySelector('#table-filter')?.value||'';let count=0;panel.querySelectorAll('tbody tr:not(.filter-empty)').forEach(row=>{const show=row.textContent.toLowerCase().includes(q)&&(!status||Array.from(row.querySelectorAll('.badge')).some(b=>b.textContent===status));row.hidden=!show;if(show)count++;});panel.querySelector('.filter-empty')?.remove();if(!count){const row=document.createElement('tr');row.className='filter-empty';const td=document.createElement('td');td.colSpan=panel.querySelectorAll('th').length;td.textContent='No matching records. Clear the search or status filter.';td.className='empty';row.append(td);panel.querySelector('tbody')?.append(row);}}
document.addEventListener('click',async event=>{const scroll=event.target.closest('[data-scroll]');if(scroll){event.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'});return;}const el=event.target.closest('[data-action]');if(!el)return;const action=el.dataset.action;try{
 switch(action){case 'menu':{const nav=document.querySelector('.mobile-nav');nav.hidden=!nav.hidden;el.setAttribute('aria-expanded',String(!nav.hidden));break;}
 case 'copy':{const code=el.closest('.code-block').querySelector('code').textContent;try{await navigator.clipboard.writeText(code);el.textContent='Copied';toast('Code copied. SDK examples are interface previews.');}catch{openDialog('Copy code',`<textarea class="copy-fallback" readonly aria-label="Code to copy">${esc(code)}</textarea><p>Select the code and copy it manually.</p>`);dialog.querySelector('textarea').select();}break;}
 case 'close-dialog':dialog.close();break;
 case 'reset':openDialog('Reset demo workspace?',`<p>This removes the simulated records created in this browser and restores the sample workspace.</p><div class="row-actions">${button('Cancel','close-dialog')}${button('Reset local demo','confirm-reset','danger')}</div>`);break;
 case 'confirm-reset':platform.reset();dialog.close();toast('Demo workspace restored.');break;
 case 'inspect':inspect(el.dataset.type,el.dataset.id);break;
 case 'save-form':case 'train-form':case 'sim-form':case 'deploy-form':case 'skill-form':formDialog(action.split('-')[0]);break;
 case 'export-logs':download('airobot-demo-logs.json',{simulated:true,events:platform.store.get().activity});break;
 case 'export-dataset':{const s=platform.store.get();download('airobot-demo-dataset.json',{simulated:true,dataset:s.datasets.find(d=>d.id===el.dataset.id),episodes:s.episodes.filter(e=>e.datasetId===el.dataset.id)});break;}
 case 'connect':platform.dispatch('connect',{robotId:document.querySelector('#robot-select')?.value});toast('Connected to simulated robot.');break;
 case 'camera':platform.dispatch('camera');break;
 case 'record':platform.dispatch('record');toast('Recording simulated episode.');break;
 case 'finish-record':platform.dispatch('finish-record');toast('Episode captured. Save it to a dataset.');break;
 case 'stop':platform.dispatch('stop');toast('Emergency stop: simulated commands and recording stopped.');break;
 case 'demo-train':platform.dispatch('train');break;
 case 'demo-sim':platform.dispatch('simulate');break;
 case 'demo-deploy':platform.dispatch('deploy');break;
 case 'simulate-model':platform.dispatch('simulate',{modelId:el.dataset.id});location.hash='/console/simulation';toast('Simulation started.');break;
 case 'start-queued':case 'cancel-run':platform.dispatch(action,{id:el.dataset.id});break;
 case 'run-skill':platform.dispatch('run-skill',{id:el.dataset.id});toast('Simulated skill execution completed. See Activity & Logs.');break;
 }
 }catch(error){toast(error.message);}});
document.addEventListener('input',event=>{const el=event.target;if(el.id==='table-search')filterTable();if(el.id==='docs-search'){let matches=0;document.querySelectorAll('#docs-nav a').forEach(a=>{a.hidden=!a.textContent.toLowerCase().includes(el.value.toLowerCase());if(!a.hidden)matches++;});document.querySelector('#docs-no-results').hidden=matches>0;}if(el.matches('[data-joint]'))document.querySelector('#joint-value-'+el.dataset.joint).textContent=el.value+'°';});
document.addEventListener('change',event=>{const el=event.target;if(el.id==='table-filter')filterTable();if(el.matches('[data-joint]'))try{platform.dispatch('move',{joint:Number(el.dataset.joint),value:Number(el.value)});}catch(error){toast(error.message);}});
document.addEventListener('submit',event=>{const form=event.target;if(!form.matches('[data-form],#access-form,#demo-skill-form'))return;event.preventDefault();const data=Object.fromEntries(new FormData(form));try{
 if(form.id==='access-form'){download('airobot-interest-brief.json',{...data,createdAt:new Date().toISOString(),notice:'Local interest brief only. Not submitted to AIROBOT.'});document.querySelector('#form-result').textContent='Brief downloaded. Nothing was transmitted or registered.';return;}
 if(form.id==='demo-skill-form'){platform.dispatch('skill',data);return;}
 const action={save:'save-dataset',train:'train',sim:'simulate',deploy:'deploy',skill:'skill'}[form.dataset.form];platform.dispatch(action,data);dialog.close();toast('Saved to your simulated workspace.');
 }catch(error){const target=form.querySelector('.form-error');if(target)target.textContent=error.message;else toast(error.message);}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
window.addEventListener('hashchange',()=>{dialog.close();render();});
usePlatform(()=>render());startJobs();
