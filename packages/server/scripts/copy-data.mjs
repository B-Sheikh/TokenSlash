import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcData = join(root, 'src', 'data');
const distData = join(root, 'dist', 'data');

mkdirSync(distData, { recursive: true });
cpSync(join(srcData, 'pricing-table.json'), join(distData, 'pricing-table.json'));
cpSync(join(srcData, 'mock-history.json'), join(distData, 'mock-history.json'));

console.log('Copied data files to dist/data/');
