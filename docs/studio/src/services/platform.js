import {createStore} from './store.js';
export function createPlatform(storage) {
 const store=createStore(storage);let sequence=0;
 const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+(++sequence);
 function log(s,text,level='info'){s.activity.unshift({id:uid('log'),time:new Date().toISOString().slice(11,19),text,level});s.activity=s.activity.slice(0,100);}
 function require(value,message){if(!value)throw new Error(message);}
 function dispatch(action,p={}) {
  let result;
  store.update(s=>{
   const c=s.control,d=s.demo;
   switch(action){
    case 'connect': {const r=s.robots.find(r=>r.id===(p.robotId||c.robotId));require(r?.status==='online','Select an online robot.');c.robotId=r.id;c.connected=true;c.emergency=false;d.step=Math.max(d.step,1);log(s,r.id+' · simulated transport connected');break;}
    case 'camera': require(c.connected,'Connect a robot first.');c.camera=true;d.step=Math.max(d.step,2);break;
    case 'move': require(c.connected&&!c.emergency,'Connect and release the emergency stop first.');require(c.camera,'Enable the simulated camera first.');require(Number.isInteger(p.joint)&&p.joint>=0&&p.joint<6&&Number.isFinite(p.value),'Invalid joint command.');c.joints[p.joint]=Math.max(-90,Math.min(90,p.value));c.motionCount++;d.step=Math.max(d.step,3);break;
    case 'stop': c.emergency=true;c.recording=false;c.connected=false;c.camera=false;log(s,'Emergency stop · commands disabled', 'warning');break;
    case 'record': require(c.connected&&!c.emergency&&c.camera,'Connect robot and enable camera before recording.');require(c.motionCount>0,'Move a joint before recording.');require(!c.recording,'Recording already active.');c.recording=true;c.recordStart=Date.now();log(s,'Episode recording started');break;
    case 'finish-record': {require(c.recording,'No active recording.');const duration=Math.max(1,Math.round((Date.now()-c.recordStart)/1000));result={id:uid('ep'),datasetId:null,duration,frames:duration*30,status:'Unsaved',createdAt:new Date().toISOString()};s.episodes.unshift(result);c.recording=false;d.episodeId=result.id;d.step=Math.max(d.step,4);log(s,result.id+' · episode captured');break;}
    case 'save-dataset': {const ep=s.episodes.find(e=>e.id===d.episodeId);require(ep&&!ep.datasetId,'Record a new episode first.');result={id:uid('ds'),name:(p.name||'Tabletop collection').trim().slice(0,80)||'Tabletop collection',version:'v0.1',episodes:1,frames:ep.frames,size:Math.max(0.01,ep.frames*0.00002).toFixed(2)+' GB',task:'Manipulation',split:[80,10,10]};s.datasets.unshift(result);ep.datasetId=result.id;ep.status='Validated';d.datasetId=result.id;d.step=Math.max(d.step,5);log(s,result.id+' · immutable demo snapshot saved','success');break;}
    case 'train': {const ds=s.datasets.find(x=>x.id===(p.datasetId||d.datasetId));require(ds?.episodes>0,'Choose a dataset with episodes.');require(!s.runs.some(r=>r.status==='running'),'A demo run is already active.');result={id:uid('run'),name:ds.name+' · ACT',datasetId:ds.id,status:'running',progress:0,loss:0.94,gpu:'A10G · simulated',checkpoint:'Pending'};s.runs.unshift(result);d.runId=result.id;d.modelId=null;d.simulationId=null;d.deploymentId=null;d.skillId=null;d.step=6;log(s,result.id+' · demo training started');break;}
    case 'start-queued': {const r=s.runs.find(r=>r.id===p.id);require(r?.status==='queued','Run is not queued.');require(!s.runs.some(r=>r.status==='running'),'A demo run is already active.');r.status='running';r.gpu='A10G · simulated';d.runId=r.id;d.step=6;break;}
    case 'cancel-run': {const r=s.runs.find(r=>r.id===p.id);require(r&&['running','queued'].includes(r.status),'Run is not active.');r.status='failed';log(s,r.id+' · cancelled by user','warning');break;}
    case 'simulate': {const model=s.models.find(m=>m.id===(p.modelId||d.modelId));require(model,'Complete training or select a model first.');require(!s.simulations.some(x=>x.status==='running'),'A simulation is already running.');result={id:uid('sim'),environment:p.environment||'Tabletop / pick & place',status:'running',progress:0,modelId:model.id,episodes:20,score:null};s.simulations.unshift(result);d.simulationId=result.id;d.modelId=model.id;log(s,result.id+' · simulation queued');break;}
    case 'deploy': {const model=s.models.find(m=>m.id===(p.modelId||d.modelId));const robot=s.robots.find(r=>r.id===(p.robotId||c.robotId));require(model,'Select a model.');require(robot?.status==='online','Deployment requires an online simulated robot.');require(s.simulations.some(x=>x.modelId===model.id&&x.status==='completed'),'Test this model in simulation before deploying.');result={id:uid('dep'),modelId:model.id,robotId:robot.id,status:'deployed',target:'Simulated edge'};s.deployments.unshift(result);d.modelId=model.id;d.deploymentId=result.id;d.step=Math.max(d.step,9);log(s,result.id+' · validate → package → stage → activate (simulated)','success');break;}
    case 'skill': {const dep=s.deployments.find(x=>x.id===(p.deploymentId||d.deploymentId));require(dep,'Deploy a model before adding a skill.');result={id:uid('skill'),name:(p.name||'My tabletop skill').slice(0,80),description:'Collected, trained, evaluated and deployed in the demo workspace.',modelId:dep.modelId,tag:'Custom'};s.skills.unshift(result);d.skillId=result.id;d.step=10;log(s,result.id+' · skill added to library','success');break;}
    case 'run-skill': require(s.skills.some(x=>x.id===p.id),'Skill not found.');require(c.connected&&!c.emergency,'Connect a robot in Live Control first.');log(s,p.id+' · simulated skill execution completed','success');break;
    default: throw new Error('Unknown action: '+action);
   }
  });return result;
 }
 function tick(){const s=store.get();if(!s.runs.some(r=>r.status==='running')&&!s.simulations.some(x=>x.status==='running'))return;store.update(s=>{
  for(const r of s.runs.filter(r=>r.status==='running')){r.progress=Math.min(100,r.progress+5);r.loss=Number((0.86*Math.exp(-r.progress/24)+0.068).toFixed(4));r.checkpoint='step-'+r.progress*100;if(r.progress===100){r.status='completed';const model={id:uid('model'),name:r.name,version:'v0.1',runId:r.id,loss:r.loss,status:'ready'};s.models.unshift(model);s.demo.modelId=model.id;s.demo.step=Math.max(s.demo.step,7);log(s,r.id+' · model registered (simulated)','success');}}
  for(const j of s.simulations.filter(x=>x.status==='running')){j.progress=Math.min(100,j.progress+10);if(j.progress===100){j.status='completed';j.score=85;s.demo.step=Math.max(s.demo.step,8);log(s,j.id+' · 17/20 synthetic trials passed','success');}}
 });}
 return {store,dispatch,tick,reset:()=>store.reset()};
}
export const platform=createPlatform();
