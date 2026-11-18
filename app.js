/* PanierMalin - Script principal */
'use strict';

const QUARTIERS = ['Tous', 'Cocody', 'Marcory', 'Plateau', 'Yopougon', 'Adjamé', 'Abobo', 'Treichville', 'Koumassi'];
const CATEGORIES = ['Tous', 'Boulangerie', 'Restauration', 'Boissons', 'Épicerie', 'Divers'];

const QUARTIER_COORDS = {
  'Cocody':      { lat: 5.3599, lng: -3.9806 },
  'Marcory':     { lat: 5.3056, lng: -3.9877 },
  'Plateau':     { lat: 5.3261, lng: -4.0197 },
  'Yopougon':    { lat: 5.3421, lng: -4.0841 },
  'Adjamé':      { lat: 5.3582, lng: -4.0253 },
  'Abobo':       { lat: 5.4167, lng: -4.0167 },
  'Treichville': { lat: 5.3082, lng: -4.0112 },
  'Koumassi':    { lat: 5.2987, lng: -3.9482 }
};

// Règles téléphone strictes par indicatif
const PHONE_RULES = {
  '+225': {
    pays: "Côte d'Ivoire",
    digits: 10,
    placeholder: '07 00 00 00 00',
    regex: /^(01|05|07|21|25|27)\d{8}$/,
    hint: "Côte d'Ivoire (+225) : 10 chiffres commençant par 01, 05, 07, 21, 25 ou 27"
  },
  '+221': {
    pays: 'Sénégal',
    digits: 9,
    placeholder: '77 000 00 00',
    regex: /^(7[05678]|33)\d{7}$/,
    hint: 'Sénégal (+221) : 9 chiffres (ex. 77 000 00 00)'
  },
  '+223': {
    pays: 'Mali',
    digits: 8,
    placeholder: '70 00 00 00',
    regex: /^[256789]\d{7}$/,
    hint: 'Mali (+223) : 8 chiffres (ex. 70 00 00 00)'
  },
  '+226': {
    pays: 'Burkina Faso',
    digits: 8,
    placeholder: '70 00 00 00',
    regex: /^[02567]\d{7}$/,
    hint: 'Burkina Faso (+226) : 8 chiffres (ex. 70 00 00 00)'
  },
  '+228': {
    pays: 'Togo',
    digits: 8,
    placeholder: '90 00 00 00',
    regex: /^[279]\d{7}$/,
    hint: 'Togo (+228) : 8 chiffres (ex. 90 00 00 00)'
  },
  '+229': {
    pays: 'Bénin',
    digits: 10,
    placeholder: '01 97 00 00 00',
    regex: /^01\d{8}$/,
    hint: 'Bénin (+229) : 10 chiffres commençant par 01 (ex. 01 97 00 00 00)'
  },
  '+224': {
    pays: 'Guinée',
    digits: 9,
    placeholder: '620 00 00 00',
    regex: /^[36]\d{8}$/,
    hint: 'Guinée (+224) : 9 chiffres (ex. 620 00 00 00)'
  },
  '+233': {
    pays: 'Ghana',
    digits: 9,
    stripLeadingZero: true,
    placeholder: '24 000 0000',
    regex: /^[235]\d{8}$/,
    hint: 'Ghana (+233) : 9 chiffres sans le 0 initial (ex. 24 000 0000)'
  },
  '+237': {
    pays: 'Cameroun',
    digits: 9,
    placeholder: '6 70 00 00 00',
    regex: /^[26]\d{8}$/,
    hint: 'Cameroun (+237) : 9 chiffres (ex. 6 70 00 00 00)'
  },
  '+33': {
    pays: 'France',
    digits: 9,
    stripLeadingZero: true,
    placeholder: '6 12 34 56 78',
    regex: /^[1-9]\d{8}$/,
    hint: 'France (+33) : 9 chiffres sans le 0 initial (ex. 6 12 34 56 78)'
  },
  '+1': {
    pays: 'USA / Canada',
    digits: 10,
    placeholder: '514 555 0199',
    regex: /^[2-9]\d{9}$/,
    hint: 'USA / Canada (+1) : 10 chiffres (ex. 514 555 0199)'
  }
};

// Données initiales (format CI 10 chiffres)
const SEED_USERS = [
  { id: 1, nom: 'Le Fournil Cocody', telephone: '+2250700000001', mot_de_passe: 'demo1234', role: 'commercant', quartier: 'Cocody', adresse: 'Boulevard Latrille, Cocody Saint-Jean', lat: 5.3585, lng: -3.9820 },
  { id: 2, nom: 'Maquis Chez Tantie', telephone: '+2250700000002', mot_de_passe: 'demo1234', role: 'commercant', quartier: 'Marcory', adresse: 'Zone 4 Rue du Canal, Marcory', lat: 5.3045, lng: -3.9860 },
  { id: 3, nom: 'Awa Koné', telephone: '+2250700000003', mot_de_passe: 'demo1234', role: 'client', quartier: 'Cocody', adresse: 'Riviera 2, non loin de l\'école', lat: 5.3680, lng: -3.9740 }
];

const SEED_PANIERS = [
  { id: 1, commercant_id: 1, commercant_nom: 'Le Fournil Cocody', commercant_adresse: 'Boulevard Latrille, Cocody Saint-Jean', titre: 'Panier Viennoiseries', description: 'Croissants, pains au chocolat et brioches du jour.', categorie: 'Boulangerie', quartier: 'Cocody', prix_initial: 1200, remise: 60, prix_remise: 480, stock: 4, creneau_debut: '18:30', creneau_fin: '19:30', frais_livraison: 1000, lat: 5.3585, lng: -3.9820, actif: 1 },
  { id: 2, commercant_id: 1, commercant_nom: 'Le Fournil Cocody', commercant_adresse: 'Boulevard Latrille, Cocody Saint-Jean', titre: 'Plat du soir Capitaine', description: 'Riz sauce arachide avec filet de poisson capitaine braisé.', categorie: 'Restauration', quartier: 'Cocody', prix_initial: 1500, remise: 50, prix_remise: 750, stock: 3, creneau_debut: '20:00', creneau_fin: '21:00', frais_livraison: 1000, lat: 5.3585, lng: -3.9820, actif: 1 },
  { id: 3, commercant_id: 1, commercant_nom: 'Le Fournil Cocody', commercant_adresse: 'Boulevard Latrille, Cocody Saint-Jean', titre: 'Pain frais & baguettes', description: 'Baguettes tradition et pains de mie invendus du matin.', categorie: 'Boulangerie', quartier: 'Cocody', prix_initial: 600, remise: 60, prix_remise: 240, stock: 6, creneau_debut: '19:00', creneau_fin: '20:00', frais_livraison: 1000, lat: 5.3585, lng: -3.9820, actif: 1 },
  { id: 4, commercant_id: 2, commercant_nom: 'Maquis Chez Tantie', commercant_adresse: 'Zone 4 Rue du Canal, Marcory', titre: 'Attiéké Poisson Braisé', description: 'Portion généreuse d\'attiéké frais avec carpe braisée du jour.', categorie: 'Restauration', quartier: 'Marcory', prix_initial: 1800, remise: 50, prix_remise: 900, stock: 2, creneau_debut: '19:30', creneau_fin: '20:30', frais_livraison: 1200, lat: 5.3045, lng: -3.9860, actif: 1 },
  { id: 5, commercant_id: 2, commercant_nom: 'Maquis Chez Tantie', commercant_adresse: 'Zone 4 Rue du Canal, Marcory', titre: 'Jus Naturels Pressés', description: 'Bissap, gingembre et tamarin frais sans conservateur.', categorie: 'Boissons', quartier: 'Marcory', prix_initial: 800, remise: 70, prix_remise: 240, stock: 5, creneau_debut: '18:00', creneau_fin: '19:30', frais_livraison: 800, lat: 5.3045, lng: -3.9860, actif: 1 }
];

const SEED_ORDERS = [
  { id: 101, client_id: 3, commercant_id: 1, panier_id: 1, quantite: 1, titre: 'Panier Viennoiseries', commercant_nom: 'Le Fournil Cocody', quartier: 'Cocody', prix_initial: 1200, prix_remise: 480, frais_livraison: 0, mode_reception: 'retrait', adresse_livraison: '', moyen_paiement: 'Wave', creneau_debut: '18:30', creneau_fin: '19:30', code_retrait: 'PM-4821', statut: 'en_cours', client_nom: 'Awa Koné', client_telephone: '+2250700000003' }
];

const state = {
  user: null,
  page: 'home',
  history: [],
  quartier: 'Tous',
  categorie: 'Tous',
  search: '',
  sort: 'default',
  favOnly: false,
  favorites: [],
  currentPanier: null,
  editingPanierId: null,
  qty: 1,
  reception: 'retrait',
  payment: 'Wave',
  filteredPaniers: []
};

let globalMap = null;
let detailMap = null;

// ── Stockage local ──
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
  } catch (_) {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

function getUsers()   { return readStore('pm_min_users', SEED_USERS); }
function saveUsers(v) { writeStore('pm_min_users', v); }
function getPaniers()   { return readStore('pm_min_paniers', SEED_PANIERS); }
function savePaniers(v) { writeStore('pm_min_paniers', v); }
function getOrders()   { return readStore('pm_min_orders', SEED_ORDERS); }
function saveOrders(v) { writeStore('pm_min_orders', v); }

function getFavKey(user) {
  return user && user.id ? `pm_min_fav_${user.id}` : null;
}

function loadUserFavorites() {
  const key = getFavKey(state.user);
  state.favorites = key ? readStore(key, []) : [];
}

function cleanUser(u) {
  return {
    id: u.id,
    nom: u.nom,
    telephone: u.telephone,
    role: u.role,
    quartier: u.quartier || 'Cocody',
    adresse: u.adresse || '',
    lat: u.lat || 5.3484,
    lng: u.lng || -4.0189
  };
}

// ── Toast ──
let toastTimer = null;
function toast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = isError ? 'show error' : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = ''; }, 3400);
}

// ── Navigation ──
function showPage(id, skipHistory = false) {
  if (!skipHistory && state.page && state.page !== id) {
    state.history.push(state.page);
    if (state.history.length > 20) state.history.shift();
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (!el) return;
  el.classList.add('active');
  state.page = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  updateHeader();

  if (id === 'catalog')  renderCatalog();
  if (id === 'client')   renderClientSpace();
  if (id === 'merchant') renderMerchantSpace();
  if (id === 'publish')  preparePublish();
}

function goBack(fallback = 'home') {
  while (state.history.length > 0) {
    const prev = state.history.pop();
    if (prev && prev !== state.page) {
      showPage(prev, true);
      return;
    }
  }
  showPage(fallback, true);
}

function openCatalog() {
  state.favOnly = false;
  showPage('catalog');
}

function openCatalogWithMap() {
  state.favOnly = false;
  showPage('catalog');
  const wrap = document.getElementById('global-map-wrap');
  if (wrap && wrap.style.display === 'none') toggleGlobalMap();
}

function openFavorites() {
  if (!state.user) {
    toast('Connectez-vous ou créez un compte pour accéder à vos favoris.', true);
    openAuth('login');
    return;
  }
  state.favOnly = true;
  showPage('catalog');
}

function goToSpace() {
  if (!state.user) {
    openAuth('login');
    return;
  }
  showPage(state.user.role === 'commercant' ? 'merchant' : 'client');
}

function openAuth(tab = 'login', role = 'client') {
  if (state.user) {
    goToSpace();
    return;
  }
  switchAuthTab(tab);
  const roleSelect = document.getElementById('reg-role');
  if (roleSelect) roleSelect.value = role;
  showPage('auth');
}

function updateHeader() {
  const u = state.user;
  const userEl = document.getElementById('header-user');
  const loginBtn = document.getElementById('header-login');
  const logoutBtn = document.getElementById('header-logout');
  const spaceNav = document.getElementById('nav-space');
  const favCount = document.getElementById('nav-fav-count');
  const proNote = document.getElementById('hero-pro-note');

  if (u) {
    userEl.style.display = 'inline';
    userEl.textContent = u.nom.split(' ')[0];
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-flex';
    spaceNav.style.display = 'inline-block';
    spaceNav.textContent = u.role === 'commercant' ? 'Tableau de bord' : 'Mes commandes';
    if (proNote) proNote.style.display = 'none';
  } else {
    userEl.style.display = 'none';
    loginBtn.style.display = 'inline-flex';
    logoutBtn.style.display = 'none';
    spaceNav.style.display = 'none';
    if (proNote) proNote.style.display = 'block';
  }

  const count = u ? state.favorites.length : 0;
  favCount.textContent = String(count);
  favCount.style.display = count > 0 ? 'inline-block' : 'none';

  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  if (state.page === 'home') document.getElementById('nav-home')?.classList.add('active');
  else if (state.page === 'catalog' && state.favOnly) document.getElementById('nav-favorites')?.classList.add('active');
  else if (state.page === 'catalog' || state.page === 'detail') document.getElementById('nav-catalog')?.classList.add('active');
  else if (['client', 'merchant', 'publish'].includes(state.page)) document.getElementById('nav-space')?.classList.add('active');
}

// ── Validation téléphone & mot de passe ──
function validatePhone(code, raw) {
  const rule = PHONE_RULES[code] || PHONE_RULES['+225'];
  const cleaned = String(raw || '').replace(/[\s\-().]/g, '');
  const codeDigits = code.replace('+', '');
  let local = cleaned;

  if (local.startsWith(code)) local = local.slice(code.length);
  else if (local.startsWith('00' + codeDigits)) local = local.slice(2 + codeDigits.length);

  if (!/^\d+$/.test(local)) {
    return { valid: false, error: 'Le numéro ne doit contenir que des chiffres.' };
  }

  if (rule.stripLeadingZero && local.length === rule.digits + 1 && local.startsWith('0')) {
    local = local.slice(1);
  }

  if (local.length !== rule.digits) {
    return {
      valid: false,
      error: `Pour ${rule.pays} (${code}), saisissez exactement ${rule.digits} chiffres (${local.length} saisi${local.length > 1 ? 's' : ''}).`
    };
  }

  if (!rule.regex.test(local)) {
    return { valid: false, error: `Format invalide pour ${rule.pays} (${code}). ${rule.hint}.` };
  }

  return { valid: true, fullNumber: code + local };
}

function updatePhoneUI(prefix) {
  const code = document.getElementById(prefix + '-code').value;
  const input = document.getElementById(prefix + '-tel');
  const hint = document.getElementById(prefix + '-hint');
  const rule = PHONE_RULES[code] || PHONE_RULES['+225'];
  input.placeholder = rule.placeholder;

  if (input.value.trim()) {
    liveCheckPhone(prefix);
  } else {
    hint.textContent = rule.hint;
    hint.className = 'hint';
  }
}

function liveCheckPhone(prefix) {
  const code = document.getElementById(prefix + '-code').value;
  const input = document.getElementById(prefix + '-tel');
  const hint = document.getElementById(prefix + '-hint');
  const rule = PHONE_RULES[code] || PHONE_RULES['+225'];

  if (!input.value.trim()) {
    hint.textContent = rule.hint;
    hint.className = 'hint';
    return;
  }

  const res = validatePhone(code, input.value);
  if (res.valid) {
    hint.textContent = `Numéro valide (${res.fullNumber})`;
    hint.className = 'hint valid';
  } else {
    hint.textContent = res.error;
    hint.className = 'hint invalid';
  }
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  const hidden = input.type === 'password';
  input.type = hidden ? 'text' : 'password';
  if (btn) btn.textContent = hidden ? 'Masquer' : 'Voir';
}

// ── Connexion & Inscription ──
function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('auth-tab-login').classList.toggle('active', isLogin);
  document.getElementById('auth-tab-register').classList.toggle('active', !isLogin);
  document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
  document.getElementById('form-register').style.display = isLogin ? 'none' : 'block';
  document.getElementById('auth-title').textContent = isLogin ? 'Connexion' : 'Créer un compte';
}

function handleLogin(e) {
  e.preventDefault();
  const code = document.getElementById('login-code').value;
  const rawTel = document.getElementById('login-tel').value;
  const check = validatePhone(code, rawTel);

  if (!check.valid) {
    liveCheckPhone('login');
    toast(check.error, true);
    return;
  }

  const pass = document.getElementById('login-pass').value;
  const users = getUsers();
  const found = users.find(u => u.telephone === check.fullNumber && u.mot_de_passe === pass);

  if (!found) {
    toast('Numéro de téléphone ou mot de passe incorrect.', true);
    return;
  }

  state.user = cleanUser(found);
  writeStore('pm_min_session', state.user);
  loadUserFavorites();
  toast(`Bienvenue, ${state.user.nom}`);
  showPage(state.user.role === 'commercant' ? 'merchant' : 'catalog');
}

function handleRegister(e) {
  e.preventDefault();
  const code = document.getElementById('reg-code').value;
  const rawTel = document.getElementById('reg-tel').value;
  const check = validatePhone(code, rawTel);

  if (!check.valid) {
    liveCheckPhone('reg');
    toast(check.error, true);
    return;
  }

  const users = getUsers();
  if (users.some(u => u.telephone === check.fullNumber)) {
    toast('Ce numéro de téléphone est déjà inscrit.', true);
    return;
  }

  const quartier = document.getElementById('reg-quartier').value;
  const coords = QUARTIER_COORDS[quartier] || { lat: 5.3484, lng: -4.0189 };
  const nextId = users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;

  const newUser = {
    id: nextId,
    nom: document.getElementById('reg-name').value.trim(),
    telephone: check.fullNumber,
    mot_de_passe: document.getElementById('reg-pass').value,
    role: document.getElementById('reg-role').value === 'commercant' ? 'commercant' : 'client',
    quartier,
    adresse: document.getElementById('reg-address').value.trim(),
    lat: coords.lat + (Math.random() - 0.5) * 0.008,
    lng: coords.lng + (Math.random() - 0.5) * 0.008
  };

  users.push(newUser);
  saveUsers(users);

  state.user = cleanUser(newUser);
  writeStore('pm_min_session', state.user);
  loadUserFavorites();
  toast('Compte créé avec succès.');
  showPage(state.user.role === 'commercant' ? 'merchant' : 'catalog');
}

function logout() {
  state.user = null;
  state.favorites = [];
  state.favOnly = false;
  state.history = [];
  localStorage.removeItem('pm_min_session');
  toast('Déconnexion effectuée.');
  showPage('home', true);
}

// ── Favoris (compte requis, propres à chaque compte) ──
function isFav(id) {
  return Boolean(state.user && state.favorites.includes(id));
}

function toggleFav(id, ev) {
  if (ev) ev.stopPropagation();
  if (!state.user) {
    toast('Connectez-vous ou créez un compte pour enregistrer un favori.', true);
    openAuth('login');
    return;
  }

  const key = getFavKey(state.user);
  const idx = state.favorites.indexOf(id);
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
    toast('Retiré de vos favoris.');
  } else {
    state.favorites.push(id);
    toast('Ajouté à vos favoris.');
  }
  writeStore(key, state.favorites);
  updateHeader();

  if (state.page === 'catalog') renderCatalog();
  if (state.page === 'detail') updateDetailFavBtn();
}

function toggleDetailFav() {
  if (state.currentPanier) toggleFav(state.currentPanier.id);
}

function updateDetailFavBtn() {
  const btn = document.getElementById('detail-fav-btn');
  if (!btn || !state.currentPanier) return;
  const saved = isFav(state.currentPanier.id);
  btn.textContent = saved ? 'Enregistré' : 'Enregistrer';
  btn.className = saved ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm';
}

function toggleFavFilter() {
  if (!state.user) {
    toast('Connectez-vous ou créez un compte pour voir vos favoris.', true);
    openAuth('login');
    return;
  }
  state.favOnly = !state.favOnly;
  updateHeader();
  renderCatalog();
}

// ── Catalogue ──
function onSearch(v) { state.search = v.trim().toLowerCase(); renderCatalog(); }
function onSort(v)   { state.sort = v; renderCatalog(); }
function setQuartier(q) { state.quartier = q; renderCatalog(); }
function setCategorie(c) { state.categorie = c; renderCatalog(); }

function resetFilters() {
  state.quartier = 'Tous';
  state.categorie = 'Tous';
  state.search = '';
  state.sort = 'default';
  state.favOnly = false;
  document.getElementById('search-box').value = '';
  document.getElementById('sort-box').value = 'default';
  updateHeader();
  renderCatalog();
}

function renderCatalog() {
  if (state.favOnly && !state.user) state.favOnly = false;

  document.getElementById('quartier-chips').innerHTML = QUARTIERS.map(q =>
    `<button class="chip ${q === state.quartier ? 'active' : ''}" onclick="setQuartier('${q}')">${q}</button>`
  ).join('');

  document.getElementById('category-chips').innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${c === state.categorie ? 'active' : ''}" onclick="setCategorie('${c}')">${c}</button>`
  ).join('');

  const favBtn = document.getElementById('btn-fav-filter');
  favBtn.className = (state.user && state.favOnly) ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm';
  favBtn.textContent = (state.user && state.favOnly) ? 'Tous les paniers' : (state.user ? `Mes favoris (${state.favorites.length})` : 'Mes favoris');

  document.getElementById('catalog-heading').textContent = state.favOnly
    ? 'Mes paniers favoris'
    : (state.quartier === 'Tous' ? 'Paniers disponibles' : `Paniers — ${state.quartier}`);

  let list = getPaniers().filter(p => p.actif === 1 && p.stock > 0);
  if (state.quartier !== 'Tous') list = list.filter(p => p.quartier === state.quartier);
  if (state.categorie !== 'Tous') list = list.filter(p => p.categorie === state.categorie);
  if (state.favOnly) list = list.filter(p => isFav(p.id));
  if (state.search) {
    const q = state.search;
    list = list.filter(p =>
      (p.titre || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.commercant_nom || '').toLowerCase().includes(q) ||
      (p.quartier || '').toLowerCase().includes(q)
    );
  }

  if (state.sort === 'price-asc') list.sort((a, b) => a.prix_remise - b.prix_remise);
  if (state.sort === 'discount-desc') list.sort((a, b) => b.remise - a.remise);
  if (state.sort === 'stock-desc') list.sort((a, b) => b.stock - a.stock);

  state.filteredPaniers = list;

  const grid = document.getElementById('catalog-grid');
  if (!list.length) {
    grid.innerHTML = `
      <div class="box empty" style="grid-column:1/-1;">
        <p style="margin-bottom:12px;">${state.favOnly ? 'Aucun panier dans vos favoris.' : 'Aucun panier ne correspond à votre sélection.'}</p>
        <button class="btn btn-dark btn-sm" onclick="resetFilters()">Afficher tous les paniers</button>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const saved = isFav(p.id);
    return `
      <article class="item-card" onclick="openDetail(${p.id})">
        <div>
          <div class="item-top">
            <div style="display:flex; gap:6px;">
              <span class="tag">${esc(p.categorie)}</span>
              <span class="tag tag-discount">-${p.remise}%</span>
            </div>
            <button type="button" class="fav-toggle ${saved ? 'saved' : ''}" onclick="toggleFav(${p.id}, event)">
              ${saved ? 'Enregistré' : 'Favori'}
            </button>
          </div>
          <h3 class="item-title">${esc(p.titre)}</h3>
          <div class="item-meta">${esc(p.commercant_nom)} &middot; ${esc(p.quartier)}</div>
          <p class="item-desc">${esc(p.description)}</p>
        </div>

        <div class="item-bottom">
          <div>
            <span class="price">${fmt(p.prix_remise)} F</span>
            <span class="price-old">${fmt(p.prix_initial)} F</span>
          </div>
          <div class="slot-info">
            <div>${p.creneau_debut} - ${p.creneau_fin}</div>
            <div>${p.stock} dispo</div>
          </div>
        </div>
      </article>`;
  }).join('');

  if (document.getElementById('global-map-wrap').style.display !== 'none') {
    drawGlobalMap();
  }
}

// ── Carte globale ──
function toggleGlobalMap() {
  const wrap = document.getElementById('global-map-wrap');
  const hidden = wrap.style.display === 'none';
  wrap.style.display = hidden ? 'block' : 'none';
  document.getElementById('btn-map-toggle').textContent = hidden ? 'Masquer la carte' : 'Afficher la carte';
  if (hidden) setTimeout(drawGlobalMap, 120);
}

function drawGlobalMap() {
  if (typeof L === 'undefined') return;
  if (globalMap) { globalMap.remove(); globalMap = null; }

  globalMap = L.map('global-map').setView([5.3484, -4.0189], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(globalMap);

  if (state.user && state.user.lat && state.user.lng) {
    L.circleMarker([state.user.lat, state.user.lng], { color: '#ea580c', radius: 7 }).addTo(globalMap).bindPopup('Votre position');
  }

  state.filteredPaniers.forEach(p => {
    if (p.lat && p.lng) {
      L.marker([p.lat, p.lng]).addTo(globalMap).bindPopup(
        `<strong>${esc(p.titre)}</strong><br>${fmt(p.prix_remise)} FCFA (-${p.remise}%)<br><small>${esc(p.commercant_nom)}</small><br><button onclick="openDetail(${p.id})" style="margin-top:6px;background:#111315;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">Voir</button>`
      );
    }
  });
}

// ── Détail panier & commande ──
function openDetail(id) {
  const p = getPaniers().find(x => x.id === id);
  if (!p) { toast('Panier introuvable.', true); return; }

  state.currentPanier = p;
  state.qty = 1;
  state.reception = 'retrait';
  state.payment = 'Wave';

  showPage('detail');

  document.getElementById('detail-category').textContent = p.categorie;
  document.getElementById('detail-discount').textContent = `-${p.remise}%`;
  document.getElementById('detail-title').textContent = p.titre;
  document.getElementById('detail-merchant').textContent = `${p.commercant_nom} · ${p.commercant_adresse || p.quartier} · ${p.creneau_debut} - ${p.creneau_fin}`;
  document.getElementById('detail-price-new').textContent = `${fmt(p.prix_remise)} FCFA`;
  document.getElementById('detail-price-old').textContent = `${fmt(p.prix_initial)} FCFA`;
  document.getElementById('detail-desc').textContent = p.description;
  document.getElementById('detail-stock').textContent = `${p.stock} disponible${p.stock > 1 ? 's' : ''}`;
  document.getElementById('detail-qty').textContent = '1';
  document.getElementById('detail-delivery-fee').textContent = `+${fmt(p.frais_livraison || 1000)} FCFA`;
  document.getElementById('detail-itinerary').href = `https://www.google.com/maps/dir/?api=1&destination=${p.lat || 5.3585},${p.lng || -3.9820}`;

  document.getElementById('delivery-address').value = (state.user && state.user.adresse) ? state.user.adresse : '';

  setReception('retrait');
  setPayment('Wave');
  updateDetailFavBtn();
  setTimeout(() => drawDetailMap(p), 120);
}

function drawDetailMap(p) {
  if (typeof L === 'undefined') return;
  if (detailMap) { detailMap.remove(); detailMap = null; }

  const cLat = p.lat || 5.3585;
  const cLng = p.lng || -3.9820;
  const uLat = (state.user && state.user.lat) ? state.user.lat : 5.3484;
  const uLng = (state.user && state.user.lng) ? state.user.lng : -4.0189;

  detailMap = L.map('detail-map').setView([cLat, cLng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(detailMap);

  L.marker([cLat, cLng]).addTo(detailMap).bindPopup(`<strong>${esc(p.commercant_nom)}</strong>`).openPopup();
  L.circleMarker([uLat, uLng], { color: '#ea580c', radius: 7 }).addTo(detailMap).bindPopup('Votre position');

  const line = L.polyline([[cLat, cLng], [uLat, uLng]], { color: '#1f8a4c', dashArray: '4,6' }).addTo(detailMap);
  detailMap.fitBounds(line.getBounds(), { padding: [24, 24] });

  const km = distKm(cLat, cLng, uLat, uLng);
  document.getElementById('detail-distance').textContent = `Distance estimée : ${km.toFixed(1)} km (~${Math.max(5, Math.round(km * 4))} min)`;
}

function distKm(a1, o1, a2, o2) {
  const R = 6371;
  const dLat = (a2 - a1) * Math.PI / 180;
  const dLon = (o2 - o1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(a1 * Math.PI / 180) * Math.cos(a2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function changeQty(delta) {
  if (!state.currentPanier) return;
  const next = state.qty + delta;
  if (next < 1) return;
  if (next > state.currentPanier.stock) {
    toast(`Stock maximum : ${state.currentPanier.stock}.`, true);
    return;
  }
  state.qty = next;
  document.getElementById('detail-qty').textContent = String(state.qty);
  updateSummary();
}

function setReception(mode) {
  state.reception = mode;
  document.getElementById('mode-retrait').classList.toggle('active', mode === 'retrait');
  document.getElementById('mode-livraison').classList.toggle('active', mode === 'livraison');
  document.getElementById('delivery-address-wrap').style.display = mode === 'livraison' ? 'block' : 'none';
  updateSummary();
}

function setPayment(m) {
  state.payment = m;
  document.getElementById('pay-wave').classList.toggle('active', m === 'Wave');
  document.getElementById('pay-om').classList.toggle('active', m === 'Orange Money');
}

function updateSummary() {
  const p = state.currentPanier;
  if (!p) return;
  const sub = p.prix_remise * state.qty;
  const save = Math.max(0, (p.prix_initial - p.prix_remise) * state.qty);
  const del = state.reception === 'livraison' ? (p.frais_livraison || 1000) : 0;
  const total = sub + del;

  document.getElementById('sum-sub-lbl').textContent = `Panier (x${state.qty})`;
  document.getElementById('sum-sub-val').textContent = `${fmt(sub)} FCFA`;
  document.getElementById('sum-del-row').style.display = del > 0 ? 'flex' : 'none';
  document.getElementById('sum-del-val').textContent = `${fmt(del)} FCFA`;
  document.getElementById('sum-save-val').textContent = `-${fmt(save)} FCFA`;
  document.getElementById('sum-total-val').textContent = `${fmt(total)} FCFA`;
  document.getElementById('btn-order').textContent = `Confirmer la réservation (${fmt(total)} FCFA)`;
}

function submitOrder() {
  if (!state.user) {
    toast('Connectez-vous ou créez un compte pour réserver.', true);
    openAuth('login');
    return;
  }
  if (state.user.role !== 'client') {
    toast('Connectez-vous avec un compte Client pour commander.', true);
    return;
  }

  const address = document.getElementById('delivery-address').value.trim();
  if (state.reception === 'livraison' && !address) {
    toast('Indiquez votre adresse de livraison.', true);
    return;
  }

  const paniers = getPaniers();
  const p = paniers.find(x => x.id === state.currentPanier.id);
  if (!p || !p.actif || p.stock < state.qty) {
    toast('Stock insuffisant pour ce panier.', true);
    return;
  }

  p.stock -= state.qty;
  savePaniers(paniers);

  const orders = getOrders();
  const code = 'PM-' + Math.floor(1000 + Math.random() * 9000);
  orders.unshift({
    id: Date.now(),
    client_id: state.user.id,
    commercant_id: p.commercant_id,
    panier_id: p.id,
    quantite: state.qty,
    titre: p.titre,
    commercant_nom: p.commercant_nom,
    quartier: p.quartier,
    prix_initial: p.prix_initial,
    prix_remise: p.prix_remise,
    frais_livraison: state.reception === 'livraison' ? (p.frais_livraison || 1000) : 0,
    mode_reception: state.reception,
    adresse_livraison: address,
    moyen_paiement: state.payment,
    creneau_debut: p.creneau_debut,
    creneau_fin: p.creneau_fin,
    code_retrait: code,
    statut: state.reception === 'livraison' ? 'en_livraison' : 'en_cours',
    client_nom: state.user.nom,
    client_telephone: state.user.telephone
  });
  saveOrders(orders);

  document.getElementById('confirm-code').textContent = code;
  document.getElementById('confirm-sub').textContent = state.reception === 'livraison'
    ? 'Donnez ce code au livreur lors de la réception.'
    : 'Présentez ce code en boutique pour retirer votre panier.';
  document.getElementById('confirm-meta').textContent = state.reception === 'livraison'
    ? `${p.commercant_nom} (x${state.qty}) · Livraison : ${address}`
    : `${p.commercant_nom} (x${state.qty}) · Retrait : ${p.creneau_debut} - ${p.creneau_fin}`;

  showPage('confirm');
}

async function copyCode(custom) {
  const code = custom || document.getElementById('confirm-code').textContent;
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(code);
    toast(`Code ${code} copié.`);
  } catch (_) {
    toast(`Code : ${code}`);
  }
}

async function sharePanier() {
  const p = state.currentPanier;
  if (!p) return;
  const text = `PanierMalin : ${p.titre} chez ${p.commercant_nom} (${p.quartier}) à ${fmt(p.prix_remise)} FCFA (-${p.remise}%).`;
  try {
    if (navigator.share) await navigator.share({ title: 'PanierMalin', text });
    else if (navigator.clipboard) { await navigator.clipboard.writeText(text); toast('Lien / texte copié.'); }
  } catch (_) {}
}

// ── Espace Client (données propres au client connecté) ──
function renderClientSpace() {
  if (!state.user) { openAuth('login'); return; }
  if (state.user.role === 'commercant') { showPage('merchant', true); return; }

  document.getElementById('client-title').textContent = state.user.nom;
  document.getElementById('client-info').textContent = ['Client', state.user.telephone, state.user.quartier, state.user.adresse].filter(Boolean).join(' · ');

  const myOrders = getOrders().filter(o => o.client_id === state.user.id);
  const valid = myOrders.filter(o => o.statut !== 'annule');
  const count = valid.reduce((s, o) => s + (o.quantite || 1), 0);
  const saved = valid.reduce((s, o) => s + Math.max(0, (o.prix_initial - o.prix_remise) * (o.quantite || 1)), 0);

  document.getElementById('m-saved-count').textContent = String(count);
  document.getElementById('m-saved-fcfa').textContent = `${fmt(saved)} F`;
  document.getElementById('m-saved-co2').textContent = `${(count * 2.5).toFixed(1)} kg`;

  const box = document.getElementById('client-orders');
  if (!myOrders.length) {
    box.innerHTML = '<div class="empty">Aucune commande effectuée pour le moment.</div>';
    return;
  }

  box.innerHTML = myOrders.map(o => `
    <div class="list-row">
      <div>
        <strong>${esc(o.titre)} ${o.quantite > 1 ? `(x${o.quantite})` : ''}</strong>
        <div style="font-size:13px; color:var(--muted);">${esc(o.commercant_nom)} &middot; ${o.creneau_debut} - ${o.creneau_fin} &middot; ${esc(o.moyen_paiement)}</div>
        <div style="font-size:12px; color:#374151; margin-top:2px;">
          ${o.mode_reception === 'livraison' ? 'Livraison : ' + esc(o.adresse_livraison) : 'Retrait direct au commerce'}
        </div>
      </div>
      <div style="text-align:right;">
        <div class="code-inline" onclick="copyCode('${esc(o.code_retrait)}')" title="Cliquer pour copier">${esc(o.code_retrait)}</div>
        <div style="font-size:12px; color:var(--muted); margin-bottom:6px;">${statusText(o.statut)}</div>
        <div style="display:flex; gap:6px; justify-content:flex-end;">
          ${o.statut === 'en_livraison' ? `<button class="btn btn-green btn-sm" onclick="markReceived(${o.id})">Colis reçu</button>` : ''}
          ${o.statut === 'en_cours' ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${o.id})">Annuler</button>` : ''}
        </div>
      </div>
    </div>`).join('');
}

function markReceived(id) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id && x.client_id === state.user.id);
  if (!o) return;
  o.statut = 'livre';
  saveOrders(orders);
  toast('Réception confirmée.');
  renderClientSpace();
}

function cancelOrder(id) {
  if (!confirm('Annuler cette réservation ?')) return;
  const orders = getOrders();
  const o = orders.find(x => x.id === id && x.client_id === state.user.id && x.statut === 'en_cours');
  if (!o) return;
  o.statut = 'annule';
  saveOrders(orders);

  const paniers = getPaniers();
  const p = paniers.find(x => x.id === o.panier_id);
  if (p) {
    p.stock += (o.quantite || 1);
    savePaniers(paniers);
  }
  toast('Réservation annulée.');
  renderClientSpace();
}

// ── Espace Commerçant (données propres au commerçant connecté) ──
function renderMerchantSpace() {
  if (!state.user || state.user.role !== 'commercant') { openAuth('login', 'commercant'); return; }

  document.getElementById('merchant-title').textContent = state.user.nom;
  document.getElementById('merchant-info').textContent = ['Commerçant', state.user.telephone, state.user.quartier, state.user.adresse].filter(Boolean).join(' · ');

  const myPaniers = getPaniers().filter(p => p.commercant_id === state.user.id);
  const myOrders = getOrders().filter(o => o.commercant_id === state.user.id);
  const valid = myOrders.filter(o => o.statut !== 'annule');
  const pending = myOrders.filter(o => o.statut === 'en_cours' || o.statut === 'en_livraison');

  const sales = valid.reduce((s, o) => s + (o.quantite || 1), 0);
  const rev = valid.reduce((s, o) => s + (o.prix_remise * (o.quantite || 1)), 0);

  document.getElementById('m-sales').textContent = String(sales);
  document.getElementById('m-revenue').textContent = `${fmt(rev)} F`;

  const ordersBox = document.getElementById('merchant-orders');
  if (!pending.length) {
    ordersBox.innerHTML = '<div class="empty">Aucune commande en attente pour votre commerce.</div>';
  } else {
    ordersBox.innerHTML = pending.map(c => `
      <div class="list-row">
        <div>
          <span class="code-inline">${esc(c.code_retrait)}</span>
          <div style="font-weight:600; margin-top:2px;">${esc(c.titre)} ${c.quantite > 1 ? `(x${c.quantite})` : ''}</div>
          <div style="font-size:13px; color:var(--muted);">${esc(c.client_nom)} (${esc(c.client_telephone)})</div>
          <div style="font-size:12px; color:#374151;">${c.mode_reception === 'livraison' ? 'Livraison : ' + esc(c.adresse_livraison) : 'Retrait en boutique'}</div>
        </div>
        <div>
          ${c.mode_reception === 'livraison'
            ? `<button class="btn btn-dark btn-sm" onclick="setOrderStatus(${c.id}, 'livre')">Marquer livré</button>`
            : `<button class="btn btn-green btn-sm" onclick="setOrderStatus(${c.id}, 'retire')">Valider retrait</button>`}
        </div>
      </div>`).join('');
  }

  const paniersBox = document.getElementById('merchant-paniers');
  if (!myPaniers.length) {
    paniersBox.innerHTML = '<div class="empty">Vous n\'avez encore publié aucun panier.</div>';
  } else {
    paniersBox.innerHTML = myPaniers.map(p => `
      <div class="list-row">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <strong>${esc(p.titre)}</strong>
            <span class="tag ${p.actif ? 'tag-green' : ''}">${p.actif ? 'Actif' : 'Inactif'}</span>
          </div>
          <div style="font-size:13px; color:var(--muted); margin-top:2px;">
            ${fmt(p.prix_remise)} F (-${p.remise}%) &middot; Stock : ${p.stock} &middot; ${p.creneau_debut} - ${p.creneau_fin}
          </div>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="editPanier(${p.id})">Modifier</button>
          ${p.actif
            ? `<button class="btn btn-ghost btn-sm" onclick="togglePanierActive(${p.id}, false)">Désactiver</button>`
            : `<button class="btn btn-green btn-sm" onclick="togglePanierActive(${p.id}, true)">Réactiver</button>`}
        </div>
      </div>`).join('');
  }
}

function setOrderStatus(id, statut) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id && x.commercant_id === state.user.id);
  if (!o) return;
  o.statut = statut;
  saveOrders(orders);
  toast('Commande mise à jour.');
  renderMerchantSpace();
}

function verifyCodeQuick(e) {
  e.preventDefault();
  const input = document.getElementById('quick-code');
  const code = input.value.trim().toUpperCase();
  const orders = getOrders();
  const found = orders.find(o => o.commercant_id === state.user.id && (o.statut === 'en_cours' || o.statut === 'en_livraison') && o.code_retrait.toUpperCase() === code);

  if (!found) {
    toast(`Code "${code}" introuvable dans vos commandes en attente.`, true);
    return;
  }

  found.statut = found.mode_reception === 'livraison' ? 'livre' : 'retire';
  saveOrders(orders);
  input.value = '';
  toast(`Code ${code} validé.`);
  renderMerchantSpace();
}

function togglePanierActive(id, enable) {
  const paniers = getPaniers();
  const p = paniers.find(x => x.id === id && x.commercant_id === state.user.id);
  if (!p) return;
  p.actif = enable ? 1 : 0;
  if (enable && (!p.stock || p.stock < 1)) p.stock = 1;
  savePaniers(paniers);
  toast(enable ? 'Panier réactivé et remis en ligne.' : 'Panier désactivé.');
  renderMerchantSpace();
}

function openNewPanier() {
  state.editingPanierId = null;
  const form = document.getElementById('form-publish');
  if (form) form.reset();
  document.getElementById('pub-heading').textContent = 'Nouveau panier';
  document.getElementById('pub-subtitle').textContent = 'Mettez vos invendus en ligne en moins d\'une minute.';
  document.getElementById('pub-submit').textContent = 'Mettre en ligne';
  showPage('publish');
}

function editPanier(id) {
  if (!state.user || state.user.role !== 'commercant') { openAuth('login', 'commercant'); return; }
  const p = getPaniers().find(x => x.id === id && x.commercant_id === state.user.id);
  if (!p) { toast('Article introuvable pour votre commerce.', true); return; }

  state.editingPanierId = p.id;
  showPage('publish');

  document.getElementById('pub-heading').textContent = 'Modifier le panier';
  document.getElementById('pub-subtitle').textContent = 'Mettez à jour les informations de votre article.';
  document.getElementById('pub-submit').textContent = 'Enregistrer les modifications';

  document.getElementById('pub-title').value = p.titre || '';
  document.getElementById('pub-desc').value = p.description || '';
  document.getElementById('pub-price').value = p.prix_initial;
  document.getElementById('pub-discount').value = String(p.remise);
  document.getElementById('pub-stock').value = p.stock;
  document.getElementById('pub-cat').value = p.categorie || 'Divers';
  document.getElementById('pub-start').value = p.creneau_debut || '18:30';
  document.getElementById('pub-end').value = p.creneau_fin || '19:30';
  document.getElementById('pub-quartier').value = p.quartier || state.user.quartier || 'Cocody';
  const hasDelivery = Number(p.frais_livraison || 0) > 0;
  document.getElementById('pub-delivery').checked = hasDelivery;
  document.getElementById('pub-fee').value = p.frais_livraison || 1000;
}

function preparePublish() {
  if (!state.user || state.user.role !== 'commercant') { openAuth('login', 'commercant'); return; }
  if (!state.editingPanierId) {
    const q = document.getElementById('pub-quartier');
    if (q && state.user.quartier) q.value = state.user.quartier;
  }
}

function handlePublish(e) {
  e.preventDefault();
  if (!state.user || state.user.role !== 'commercant') return;

  const prixInit = parseFloat(document.getElementById('pub-price').value);
  const remise = parseInt(document.getElementById('pub-discount').value, 10);
  const quartier = document.getElementById('pub-quartier').value;
  const coords = QUARTIER_COORDS[quartier] || { lat: state.user.lat, lng: state.user.lng };

  const fields = {
    titre: document.getElementById('pub-title').value.trim(),
    description: document.getElementById('pub-desc').value.trim(),
    categorie: document.getElementById('pub-cat').value,
    quartier,
    prix_initial: prixInit,
    remise,
    prix_remise: Math.round(prixInit * (1 - remise / 100)),
    stock: parseInt(document.getElementById('pub-stock').value, 10),
    creneau_debut: document.getElementById('pub-start').value,
    creneau_fin: document.getElementById('pub-end').value,
    frais_livraison: document.getElementById('pub-delivery').checked ? parseInt(document.getElementById('pub-fee').value || 1000, 10) : 0
  };

  const paniers = getPaniers();

  if (state.editingPanierId) {
    const target = paniers.find(x => x.id === state.editingPanierId && x.commercant_id === state.user.id);
    if (!target) {
      toast('Impossible de modifier cet article.', true);
      return;
    }
    Object.assign(target, fields);
    savePaniers(paniers);
    state.editingPanierId = null;
    e.target.reset();
    toast('Article modifié avec succès.');
    showPage('merchant');
    return;
  }

  paniers.unshift({
    id: Date.now(),
    commercant_id: state.user.id,
    commercant_nom: state.user.nom,
    commercant_adresse: state.user.adresse || quartier,
    ...fields,
    lat: state.user.lat || coords.lat,
    lng: state.user.lng || coords.lng,
    actif: 1
  });
  savePaniers(paniers);

  e.target.reset();
  toast('Panier publié.');
  showPage('merchant');
}

// ── Utilitaires ──
function statusText(s) {
  return { en_cours: 'À retirer', en_livraison: 'En livraison', livre: 'Livré', retire: 'Retiré', annule: 'Annulé' }[s] || s;
}

function fmt(n) {
  return Number(n || 0).toLocaleString('fr-FR');
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Démarrage ──
(function init() {
  const saved = readStore('pm_min_session', null);
  if (saved && saved.id) {
    state.user = saved;
    loadUserFavorites();
  }
  updateHeader();
  showPage('home', true);
})();
