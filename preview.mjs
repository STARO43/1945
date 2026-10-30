import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=fileURLToPath(new URL('.',import.meta.url));
let root=resolve(here,'dist');try{await stat(root)}catch{root=here;}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf','.webm':'video/webm','.mp4':'video/mp4','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Файл не найден');}});
server.listen(8767,'127.0.0.1',()=>console.log('История Великой Отечественной: http://127.0.0.1:8767/\nДля остановки нажмите Ctrl+C.'));
