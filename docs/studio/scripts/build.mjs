import {mkdir,cp} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
await mkdir(path.join(root,'dist'),{recursive:true});
for(const file of ['index.html','favicon.svg','src'])await cp(path.join(root,file),path.join(root,'dist',file),{recursive:true});
console.log('Static build ready in dist/. Hash routes work on GitHub Pages without server rewrites.');
