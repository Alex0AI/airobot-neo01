export type Status = 'online' | 'offline' | 'running' | 'queued' | 'completed' | 'ready' | 'failed' | 'deployed';
export interface Robot { id:string; name:string; status:'online'|'offline'; battery:number; cpu:number; gpu:number; latency:number; firmware:string; task:string; }
export interface Episode { id:string; datasetId:string; duration:number; frames:number; status:string; createdAt:string; }
export interface Dataset { id:string; name:string; version:string; episodes:number; frames:number; size:string; task:string; split:number[]; }
export interface TrainingRun { id:string; name:string; datasetId:string; status:Status; progress:number; loss:number; gpu:string; checkpoint:string; }
export interface Model { id:string; name:string; version:string; runId:string; loss:number; status:Status; }
export interface Deployment { id:string; modelId:string; robotId:string; status:Status; target:string; }
export interface Telemetry { timestamp:number; joints:number[]; battery:number; cpu:number; gpu:number; latency:number; }
export interface RobotTransport { connect(id:string):Promise<void>; disconnect():void; subscribe(listener:(value:Telemetry)=>void):()=>void; command(joints:number[]):Promise<void>; emergencyStop():Promise<void>; }
export interface CameraTransport { connect(robotId:string, video:HTMLVideoElement):Promise<void>; disconnect():void; }
export interface AuthProvider { session():Promise<{userId:string; workspaceId:string; organizationId:string}|null>; signIn():Promise<void>; signOut():Promise<void>; }
export interface PlatformAPI { getState():Promise<unknown>; dispatch(action:string,payload?:Record<string,unknown>):Promise<unknown>; }
