import {config} from '../config.js';
/** REST adapter boundary. Never used in mock mode; authenticate on the server, not in shipped config. */
export async function request(path,{method='GET',body,signal}={}) {
 const response=await fetch(config.apiBase+path,{method,credentials:'include',signal,headers:{'Accept':'application/json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 if(!response.ok) throw new Error('API request failed ('+response.status+')');
 return response.status===204?null:response.json();
}
export const restAPI={getState:()=>request('/workspace'),dispatch:(action,payload)=>request('/actions/'+encodeURIComponent(action),{method:'POST',body:payload||{}})};
