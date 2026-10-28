import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {pages} from '../site/content.mjs';
import {render,origin} from '../site/layout.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const check=process.argv.includes('--check');
const outputs=new Map();
for(const page of pages){
  if(!/^\/(?:[a-z-]+\/)*$/.test(page.route)) throw new Error('非法页面路由');
  const file=page.route.slice(1)+'index.html';
  outputs.set(file,render(page,page.body(page)));
}
outputs.set('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.map(p=>p.route),'/user-agreement/'].map(p=>`<url><loc>${origin+p}</loc></url>`).join('')}</urlset>\n`);
outputs.set('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
for(const [file,content] of outputs){
  const path=resolve(root,file);
  if(check){
    if(!existsSync(path)||readFileSync(path,'utf8').replaceAll('\r\n','\n')!==content.replaceAll('\r\n','\n')) throw new Error(`生成结果不同步：${file}`);
  }else{
    mkdirSync(dirname(path),{recursive:true});writeFileSync(path,content);
  }
}
console.log(`${check?'已核对':'已生成'} ${pages.length} 个页面及 sitemap/robots`);
