/**
 * PanierMalin — Script de linting et contrôle qualité du code
 * Vérifie la syntaxe JS, les règles (.eslintrc.json) et la structure Starter Kit.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const errors = [];
const warnings = [];

function walkJs(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'docs'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, list);
    else if (entry.name.endsWith('.js')) list.push(full);
  }
  return list;
}

const requiredFiles = [
  '.env.example',
  '.eslintrc.json',
  '.editorconfig',
  '.gitignore',
  'README.md',
  'package.json',
  'index.html',
  'style.css',
  'app.js',
  'logo.png'
];

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(ROOT, rel))) {
    errors.push(`Fichier requis manquant : ${rel}`);
  }
}

for (const jf of ['.eslintrc.json', 'package.json']) {
  const full = path.join(ROOT, jf);
  if (fs.existsSync(full)) {
    try {
      JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      errors.push(`JSON invalide dans ${jf} : ${e.message}`);
    }
  }
}

const jsFiles = walkJs(ROOT);
for (const file of jsFiles) {
  const rel = path.relative(ROOT, file);
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (check.status !== 0) {
    errors.push(`Erreur de syntaxe dans ${rel} :\n${check.stderr.trim()}`);
  }

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (/^\s*debugger\b/.test(line)) {
      errors.push(`${rel}:${idx + 1} — Instruction interdite`);
    }
    if (/^\s*var\s+/.test(line)) {
      warnings.push(`${rel}:${idx + 1} — Préférez const/let à var`);
    }
  });
}

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (!/<html[^>]*lang="fr"/i.test(html)) {
  warnings.push('index.html — Attribut lang="fr" recommandé');
}
if (!/meta[^>]*name="viewport"/i.test(html)) {
  errors.push('index.html — Balise meta viewport manquante');
}

console.log(`\n[LINT] ${jsFiles.length} fichiers JS analysés · ${requiredFiles.length} fichiers Starter Kit vérifiés`);
if (warnings.length) {
  console.log(`\nAvertissements (${warnings.length}) :`);
  warnings.forEach(w => console.log(`  - ${w}`));
}
if (errors.length) {
  console.error(`\nErreurs (${errors.length}) :`);
  errors.forEach(e => console.error(`  x ${e}`));
  process.exit(1);
}

console.log('[LINT] OK — 0 erreur détectée.\n');
