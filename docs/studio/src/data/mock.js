export function createSeed() {
 return {schema:1, robots:[
 {id:'one-01',name:'AIROBOT One · 01',status:'online',battery:84,cpu:32,gpu:46,latency:18,firmware:'0.1.0-preview',task:'Pick & place'},
 {id:'one-02',name:'AIROBOT One · 02',status:'online',battery:67,cpu:28,gpu:39,latency:24,firmware:'0.1.0-preview',task:'Visual navigation'},
 {id:'one-03',name:'AIROBOT One · 03',status:'online',battery:92,cpu:14,gpu:12,latency:12,firmware:'0.1.0-preview',task:'Idle'},
 {id:'one-04',name:'AIROBOT One · 04',status:'offline',battery:0,cpu:0,gpu:0,latency:0,firmware:'0.1.0-preview',task:'Disconnected'}],
 datasets:[{id:'ds-01',name:'Pick & place',version:'v1.2',episodes:64,frames:115200,size:'2.4 GB',task:'Manipulation',split:[80,10,10]},{id:'ds-02',name:'Visual navigation',version:'v0.3',episodes:38,frames:68400,size:'1.6 GB',task:'Navigation',split:[80,10,10]},{id:'ds-03',name:'Object handover',version:'v1.0',episodes:24,frames:43200,size:'0.9 GB',task:'Interaction',split:[80,10,10]}],
 episodes:Array.from({length:126},(_,i)=>({id:'ep-'+String(i+1).padStart(4,'0'),datasetId:i<64?'ds-01':i<102?'ds-02':'ds-03',duration:30+(i%5)*7,frames:1800,status:'Validated',createdAt:'2026-10-14T08:'+String(i%60).padStart(2,'0')+':00Z'})),
 runs:[{id:'run-042',name:'Pick policy · ACT',datasetId:'ds-01',status:'completed',progress:100,loss:0.082,gpu:'A10G · simulated',checkpoint:'step-10000'},{id:'run-043',name:'Navigation · BC',datasetId:'ds-02',status:'queued',progress:0,loss:0.94,gpu:'Waiting for demo slot',checkpoint:'Pending'}],
 models:Array.from({length:5},(_,i)=>({id:'model-0'+(i+1),name:['Pick policy','Navigation policy','Handover policy','Vision encoder','Reach policy'][i],version:'v1.'+i,runId:'run-042',loss:0.082+i*0.015,status:'ready'})),
 deployments:Array.from({length:3},(_,i)=>({id:'dep-00'+(i+1),modelId:'model-0'+(i+1),robotId:'one-0'+(i+1),status:'deployed',target:'Simulated edge'})),
 skills:[{id:'skill-01',name:'Pick & place',description:'Locate, reach, grasp, transfer.',modelId:'model-01',tag:'Manipulation'},{id:'skill-02',name:'Navigate to target',description:'Follow a local waypoint trajectory.',modelId:'model-02',tag:'Navigation'},{id:'skill-03',name:'Object handover',description:'Approach and release on confirmation.',modelId:'model-03',tag:'Interaction'}],
 simulations:[{id:'sim-018',environment:'Tabletop / pick & place',status:'completed',progress:100,modelId:'model-01',episodes:20,score:85}],
 activity:[{id:'log-01',time:'08:42:16',text:'dep-003 · model staged on simulated edge',level:'info'},{id:'log-02',time:'08:40:02',text:'run-042 · checkpoint step-10000 registered',level:'success'},{id:'log-03',time:'08:38:24',text:'one-04 · robot disconnected',level:'warning'}],
 control:{robotId:'one-01',connected:false,camera:false,recording:false,emergency:false,joints:[0,24,-18,0,32,0],motionCount:0}, demo:{step:0,episodeId:null,datasetId:null,runId:null,modelId:null,simulationId:null,deploymentId:null,skillId:null}};
}
