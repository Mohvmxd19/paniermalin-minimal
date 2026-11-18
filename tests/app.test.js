/**
 * PanierMalin — Suite de tests automatisés (logique métier, validation et isolation)
 * Exécution : npm test
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function createMockStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: k => { map.delete(k); },
    clear: () => { map.clear(); }
  };
}

function loadAppContext() {
  const storage = createMockStorage();
  const noopEl = () => ({
    style: {},
    value: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {},
    setAttribute() {},
    querySelectorAll() { return []; }
  });

  const ctx = {
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Array,
    Object,
    RegExp,
    parseInt,
    parseFloat,
    isNaN,
    setTimeout: () => 0,
    clearTimeout: () => {},
    localStorage: storage,
    navigator: { clipboard: { writeText: async () => {} } },
    window: { scrollTo() {}, addEventListener() {} },
    document: {
      getElementById: () => noopEl(),
      querySelector: () => noopEl(),
      querySelectorAll: () => [],
      addEventListener() {}
    }
  };
  vm.createContext(ctx);
  const src = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  vm.runInContext(src, ctx, { filename: 'app.js' });
  return ctx;
}

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  [OK] ${name}`);
}

console.log('\n[TESTS] Démarrage de la suite PanierMalin...\n');

const ctx = loadAppContext();

test('Données initiales : 3 comptes pré-remplis au format CI +225 (10 chiffres)', () => {
  const users = ctx.getUsers();
  assert.strictEqual(users.length, 3);
  users.forEach(u => assert(/^\+225(01|05|07|21|25|27)\d{8}$/.test(u.telephone)));
});

test('Catalogue initial : 5 paniers actifs avec prix réduit cohérent', () => {
  const paniers = ctx.getPaniers();
  assert(paniers.length >= 5);
  paniers.forEach(p => {
    assert(p.prix_remise < p.prix_initial);
    assert(p.stock > 0);
  });
});

test('Validation téléphone : accepte un numéro Côte d\'Ivoire (+225) à 10 chiffres', () => {
  const res = ctx.validatePhone('+225', '07 12 34 56 78');
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.fullNumber, '+2250712345678');
});

test('Validation téléphone : rejette un numéro CI incomplet (8 chiffres)', () => {
  const res = ctx.validatePhone('+225', '07 12 34 56');
  assert.strictEqual(res.valid, false);
});

test('Validation téléphone : supporte plusieurs indicatifs (+221 Sénégal, +33 France)', () => {
  assert.strictEqual(ctx.validatePhone('+221', '77 123 45 67').valid, true);
  assert.strictEqual(ctx.validatePhone('+33', '06 12 34 56 78').fullNumber, '+33612345678');
});

test('Isolation des favoris : chaque compte possède sa propre clé localStorage', () => {
  const keyUser3 = ctx.getFavKey({ id: 3 });
  const keyUser4 = ctx.getFavKey({ id: 4 });
  assert.notStrictEqual(keyUser3, keyUser4);
  assert.strictEqual(ctx.getFavKey(null), null);
});

test('Persistance locale : ajout, modification et désactivation d\'un panier commerçant', () => {
  const list = ctx.getPaniers();
  const nouveau = {
    id: 99,
    commercant_id: 1,
    commercant_nom: 'Le Fournil Cocody',
    titre: 'Panier Test Soir',
    prix_initial: 3000,
    remise: 50,
    prix_remise: 1500,
    stock: 3,
    quartier: 'Cocody',
    categorie: 'Boulangerie',
    actif: 1
  };
  list.push(nouveau);
  ctx.savePaniers(list);

  const reloaded = ctx.getPaniers();
  const found = reloaded.find(p => p.id === 99);
  assert(found && found.titre === 'Panier Test Soir');

  found.titre = 'Panier Test Modifié';
  found.actif = 0;
  ctx.savePaniers(reloaded);

  const afterEdit = ctx.getPaniers().find(p => p.id === 99);
  assert.strictEqual(afterEdit.titre, 'Panier Test Modifié');
  assert.strictEqual(afterEdit.actif, 0);
});

test('Structure HTML : les 8 vues principales et le bloc pro masquable sont présents', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const id of ['page-home', 'page-auth', 'page-catalog', 'page-detail', 'page-confirm', 'page-client', 'page-merchant', 'page-publish', 'hero-pro-note']) {
    assert(html.includes(`id="${id}"`), `Section manquante dans index.html : ${id}`);
  }
});

console.log(`\n[TESTS] SUCCÈS — ${passed} / ${passed} tests passés.\n`);
