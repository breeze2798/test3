import http from 'node:http';
import { readFile } from 'node:fs/promises';
const base = new URL('.', import.meta.url);
const port = Number(process.env.PORT || 8765);
const types = {'/index.html':'text/html', '/app.js':'text/javascript', '/style.css':'text/css'};
const server = http.createServer(async (req,res) => {
  try {
    const pathname = new URL(req.url,'http://localhost').pathname;
    const file = pathname === '/' ? '/index.html' : pathname;
    if (!types[file]) { res.writeHead(404); res.end('Not found'); return; }
    const body = await readFile(new URL(file.slice(1),base));
    res.writeHead(200, {'Content-Type': `${types[file]}; charset=utf-8`}); res.end(body);
  } catch { res.writeHead(500); res.end('Unable to load page'); }
});
server.on('error', e => { console.error(`Preview failed: ${e.code}`); process.exitCode=1; });
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
