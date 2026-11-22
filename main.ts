// news-image-20261122 — "Sum up 22 November's world news in one image".
//
// This is a program/v1 entry: the picture ships in this repository as
// entry.png, a 1024x1024 front-page collage of the day's five biggest
// stories under the date they happened, and this program's whole job is
// to place those exact bytes at /output/entry.png, identically on every
// run. The sandbox has no network and nothing to fetch, so a copy is
// all it takes. The stored file holds JPEG bytes under the entry.png
// name; the gate tells PNG from JPEG by the first bytes and takes
// either.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Fail loudly rather than ship an invalid entry: the gate takes a whole
// PNG or JPEG (told apart by its first bytes) of at most 1 MiB, so check
// the asset's size and magic before copying it.
const MAX_BYTES = 1_048_576;
const head = readFileSync(source).subarray(0, 3);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG');
}
const { size } = statSync(source);
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes, over the 1 MiB gate cap`);
}

// The grader provides /output, but a bare local run may not have one:
// create the directory rather than fail on the copy.
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`entry.png: ${size} bytes written to ${target}`);
