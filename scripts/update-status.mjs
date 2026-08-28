#!/usr/bin/env node
/**
 * Update STATUS.yaml
 * Usage: node scripts/update-status.mjs --list
 *        node scripts/update-status.mjs --set <item_id> <status> [note]
 *
 * js-yaml is loaded via createRequire: the installed build ships CommonJS only
 * and has no ESM default export, so `import yaml from 'js-yaml'` throws
 * "does not provide an export named 'default'".
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const STATUS_FILE = path.join(process.cwd(), 'STATUS.yaml');
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'NEEDS_OWNER'];

function today() {
  return new Date().toISOString().split('T')[0];
}

function loadStatus() {
  if (!fs.existsSync(STATUS_FILE)) {
    return { last_updated: today(), open_items: [] };
  }
  const data = yaml.load(fs.readFileSync(STATUS_FILE, 'utf8')) ?? {};
  data.open_items ??= [];
  return data;
}

// yaml.dump() drops comments, so the file header is re-prepended on every write.
const HEADER = [
  '# STATUS.yaml — Living Status of Open Items',
  '# Update via: npm run status:set -- <id> <status> "note"',
  '# List via:   npm run status:list',
  '',
].join('\n');

function saveStatus(data) {
  const body = yaml.dump(data, { indent: 2, lineWidth: 100 });
  fs.writeFileSync(STATUS_FILE, HEADER + body, 'utf8');
  console.log(`STATUS.yaml updated (${data.open_items.length} items)`);
}

const ICONS = {
  DONE: '[done]',
  IN_PROGRESS: '[wip ]',
  BLOCKED: '[block]',
  NEEDS_OWNER: '[ownr]',
  TODO: '[todo]',
};

function listItems() {
  const data = loadStatus();
  console.log(`\nOpen Items Status (last updated ${data.last_updated}):`);
  console.log('='.repeat(60));
  if (data.open_items.length === 0) {
    console.log('(no items)');
    return;
  }
  for (const item of data.open_items) {
    console.log(`${ICONS[item.status] ?? '[????]'} ${item.id}: ${item.status}`);
    if (item.note) console.log(`        ${item.note}`);
  }
  const counts = data.open_items.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log('='.repeat(60));
  console.log(Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join('  |  '));
}

function setItem(itemId, status, note) {
  const data = loadStatus();
  const existing = data.open_items.find((i) => i.id === itemId);

  if (existing) {
    existing.status = status;
    if (note !== undefined) existing.note = note;
  } else {
    data.open_items.push({ id: itemId, status, note: note ?? '' });
  }

  data.last_updated = today();
  saveStatus(data);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) return listItems();

  if (args.includes('--set')) {
    const idx = args.indexOf('--set');
    const [itemId, status, note] = args.slice(idx + 1);

    if (!itemId || !status) {
      console.error('Usage: --set <item_id> <status> [note]');
      console.error(`Status options: ${VALID_STATUSES.join(', ')}`);
      process.exit(1);
    }
    if (!VALID_STATUSES.includes(status)) {
      console.error(`Invalid status "${status}". Expected one of: ${VALID_STATUSES.join(', ')}`);
      process.exit(1);
    }

    return setItem(itemId, status, note);
  }

  console.log('Usage:');
  console.log('  node scripts/update-status.mjs --list');
  console.log('  node scripts/update-status.mjs --set <item_id> <status> [note]');
  console.log(`\nStatus options: ${VALID_STATUSES.join(', ')}`);
}

main();
