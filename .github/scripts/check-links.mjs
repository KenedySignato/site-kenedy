// Falha o build se index.html referenciar arquivo local que não existe.
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
const local = refs.filter(r => !/^(https?:|mailto:|tel:|#|data:)/.test(r));

const missing = [...new Set(local)].filter(r => !existsSync(decodeURIComponent(r.split(/[?#]/)[0])));

if (missing.length) {
  console.error('Arquivos referenciados que não existem:');
  missing.forEach(m => console.error(`  - ${decodeURIComponent(m)}`));
  process.exit(1);
}
console.log(`OK: ${new Set(local).size} referências locais conferidas.`);
