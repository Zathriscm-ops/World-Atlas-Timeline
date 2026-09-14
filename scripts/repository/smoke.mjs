import fs from 'node:fs';
import assert from 'node:assert/strict';
import { z } from 'zod';

const manifest = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  private: z.literal(true),
  type: z.literal('module'),
});
for (const file of ['package.json', 'apps/web/package.json', 'apps/api/package.json', 'packages/contracts/package.json']) {
  manifest.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
}
assert.equal(manifest.safeParse({name:'unsafe-public-package',version:'0.0.0',private:false,type:'module'}).success, false);
for (const dir of ['apps','packages','database','data','infra','docs','scripts','tests']) assert.ok(fs.statSync(dir).isDirectory());
process.stdout.write('PASS workspace manifests, directory boundaries and installed Zod validation\n');
