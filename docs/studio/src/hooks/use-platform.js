import {platform} from '../services/platform.js';
/** Framework-neutral subscription hook; return cleanup when a view unmounts. */
export function usePlatform(listener){listener(platform.store.get());return platform.store.subscribe(()=>listener(platform.store.get()));}
export function startJobs(){const id=setInterval(()=>platform.tick(),650);return()=>clearInterval(id);}
