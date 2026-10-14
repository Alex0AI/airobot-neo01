import {createSeed} from '../data/mock.js';
import {config} from '../config.js';
export function createStore(storage=globalThis.localStorage) {
 let state=createSeed(), persistence=true;
 try {const saved=JSON.parse(storage?.getItem(config.storageKey)||'null');if(saved?.schema===1 && Array.isArray(saved.robots)&&Array.isArray(saved.datasets)&&saved.demo&&saved.control) state=saved;} catch {persistence=false;}
 // Reload never leaves a command stream or recording active.
 state.control.connected=false;state.control.camera=false;state.control.recording=false;
 const listeners=new Set();
 return {get:()=>structuredClone(state),update(fn){fn(state);try{storage?.setItem(config.storageKey,JSON.stringify(state));}catch{persistence=false;}listeners.forEach(fn=>fn());},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},reset(){state=createSeed();this.update(()=>{});},get persistent(){return persistence;}};
}
