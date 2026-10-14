/** Integration seams. Implement behind an authenticated gateway before enabling live mode. */
export class RobotWebSocketTransport {
 constructor(url){this.url=url;this.socket=null;this.listeners=new Set();}
 connect(robotId){return new Promise((resolve,reject)=>{this.socket=new WebSocket(this.url+'?robot='+encodeURIComponent(robotId));this.socket.onopen=()=>resolve();this.socket.onerror=()=>reject(new Error('Robot transport unavailable'));this.socket.onmessage=event=>{try{const data=JSON.parse(event.data);if(data.type==='telemetry'&&Array.isArray(data.joints))this.listeners.forEach(fn=>fn(data));}catch{/* Ignore malformed telemetry. */}};});}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 async command(joints){if(this.socket?.readyState!==WebSocket.OPEN)throw new Error('Robot disconnected');this.socket.send(JSON.stringify({type:'joint-target',joints}));}
 async emergencyStop(){if(this.socket?.readyState===WebSocket.OPEN)this.socket.send(JSON.stringify({type:'emergency-stop'}));}
 disconnect(){this.socket?.close();this.listeners.clear();}
}
export class WebRTCCameraTransport {
 async connect(){throw new Error('Preview: implement authenticated SDP/ICE signaling and camera authorization before enabling WebRTC.');}
 disconnect(){this.peer?.close();this.stream?.getTracks().forEach(track=>track.stop());}
}
export const mockAuth={session:async()=>({userId:'demo-user',workspaceId:'local-workspace',organizationId:'demo-org'}),signIn:async()=>{throw new Error('Authentication is Coming Soon. This is a browser-local demo.');},signOut:async()=>{}};
