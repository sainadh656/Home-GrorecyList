/* ════════════════════════════════════════════════════════════
   HomeGrocery — app.js
   Google Identity Services login + localStorage persistence
════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────
// GOOGLE OAUTH CONFIG
// Replace CLIENT_ID with your own from:
// https://console.cloud.google.com/ → APIs & Services → Credentials
// (Create OAuth 2.0 Client ID → Web application)
// ─────────────────────────────────────────
const CLIENT_ID = '897324727631-m4fh5nrrdq1k4u6r0u6j5hq6alhgkl28.apps.googleusercontent.com';

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
let currentUser = null;   // { name, email, picture }
let groceryList = [];    // [{ id, name, emoji, qty, unit, note, addedAt }]
let activeCategory = 'All';
let currentSearchTerm = '';

// ─────────────────────────────────────────
// ROUTINE ITEMS DATABASE
// ─────────────────────────────────────────
const ROUTINE_ITEMS = [
  // Vegetables
  { name: 'Tomatoes', emoji: '🍅', category: 'Vegetables', defaultUnit: 'kg' },
  { name: 'Onions', emoji: '🧅', category: 'Vegetables', defaultUnit: 'kg' },
  { name: 'Potatoes', emoji: '🥔', category: 'Vegetables', defaultUnit: 'kg' },
  { name: 'Spinach', emoji: '🥬', category: 'Vegetables', defaultUnit: 'kg' },
  { name: 'Carrots', emoji: '🥕', category: 'Vegetables', defaultUnit: 'kg' },
  { name: 'Green Chillies', emoji: '🌶️', category: 'Vegetables', defaultUnit: 'g' },
  { name: 'Garlic', emoji: '🧄', category: 'Vegetables', defaultUnit: 'g' },
  { name: 'Ginger', emoji: '🫚', category: 'Vegetables', defaultUnit: 'g' },
  { name: 'Cucumber', emoji: '🥒', category: 'Vegetables', defaultUnit: 'pcs' },
  { name: 'Brinjal', emoji: '🍆', category: 'Vegetables', defaultUnit: 'kg' },
  // Fruits
  { name: 'Bananas', emoji: '🍌', category: 'Fruits', defaultUnit: 'dozen' },
  { name: 'Apples', emoji: '🍎', category: 'Fruits', defaultUnit: 'kg' },
  { name: 'Mangoes', emoji: '🥭', category: 'Fruits', defaultUnit: 'kg' },
  { name: 'Lemons', emoji: '🍋', category: 'Fruits', defaultUnit: 'pcs' },
  { name: 'Grapes', emoji: '🍇', category: 'Fruits', defaultUnit: 'kg' },
  // Dairy
  { name: 'Milk', emoji: '🥛', category: 'Dairy', defaultUnit: 'L' },
  { name: 'Curd / Yoghurt', emoji: '🫙', category: 'Dairy', defaultUnit: 'kg' },
  { name: 'Paneer', emoji: '🧀', category: 'Dairy', defaultUnit: 'g' },
  { name: 'Butter', emoji: '🧈', category: 'Dairy', defaultUnit: 'g' },
  { name: 'Eggs', emoji: '🥚', category: 'Dairy', defaultUnit: 'dozen' },
  // Grains & Pulses
  { name: 'Basmati Rice', emoji: '🍚', category: 'Grains', defaultUnit: 'kg' },
  { name: 'Wheat Flour', emoji: '🌾', category: 'Grains', defaultUnit: 'kg' },
  { name: 'Toor Dal', emoji: '🫘', category: 'Grains', defaultUnit: 'kg' },
  { name: 'Chana Dal', emoji: '🫘', category: 'Grains', defaultUnit: 'kg' },
  { name: 'Oats', emoji: '🥣', category: 'Grains', defaultUnit: 'g' },
  // Oils & Spices
  { name: 'Cooking Oil', emoji: '🫙', category: 'Oils', defaultUnit: 'L' },
  { name: 'Mustard Seeds', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
  { name: 'Cumin Seeds', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
  { name: 'Turmeric', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
  { name: 'Salt', emoji: '🧂', category: 'Oils', defaultUnit: 'kg' },
  // Snacks & Others
  { name: 'Biscuits', emoji: '🍪', category: 'Snacks', defaultUnit: 'pack' },
  { name: 'Bread', emoji: '🍞', category: 'Snacks', defaultUnit: 'pcs' },
  { name: 'Coffee', emoji: '☕', category: 'Snacks', defaultUnit: 'g' },
  { name: 'Tea', emoji: '🍵', category: 'Snacks', defaultUnit: 'g' },
  { name: 'Sugar', emoji: '🍬', category: 'Snacks', defaultUnit: 'kg' },
  // Cleaning
  { name: 'Dish Soap', emoji: '🫧', category: 'Household', defaultUnit: 'mL' },
  { name: 'Laundry Powder', emoji: '🧺', category: 'Household', defaultUnit: 'kg' },
  { name: 'Toilet Paper', emoji: '🧻', category: 'Household', defaultUnit: 'pack' },
  { name: 'Hand Wash', emoji: '🧴', category: 'Household', defaultUnit: 'mL' },
];

const CATEGORIES = ['All', ...new Set(ROUTINE_ITEMS.map(i => i.category))];

// ─────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────
function storageKey() {
  return currentUser ? `hg_list_${currentUser.email}` : 'hg_list_guest';
}

function saveList() {
  localStorage.setItem(storageKey(), JSON.stringify(groceryList));
}

function loadList() {
  const raw = localStorage.getItem(storageKey());
  groceryList = raw ? JSON.parse(raw) : [];
}

function saveUser(user) {
  localStorage.setItem('hg_user', JSON.stringify(user));
}

function loadSavedUser() {
  const raw = localStorage.getItem('hg_user');
  return raw ? JSON.parse(raw) : null;
}

function clearSavedUser() {
  localStorage.removeItem('hg_user');
}

// ─────────────────────────────────────────
// GOOGLE IDENTITY SERVICES AUTH
// ─────────────────────────────────────────
function initGoogle() {
  // If CLIENT_ID is the placeholder, use a demo mode (no real OAuth)
  if (CLIENT_ID.startsWith('YOUR_GOOGLE')) {
    console.warn('No Google Client ID configured — running in demo mode.');
    setupDemoLoginButton();
    return;
  }

  if (typeof google === 'undefined') {
    // Script may not have loaded yet, retry
    setTimeout(initGoogle, 300);
    return;
  }

  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
  });
}

function handleCredentialResponse(response) {
  // Decode the JWT id_token (payload is base64url, no verification needed in client)
  try {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    onUserSignedIn({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  } catch (e) {
    showToast('Sign-in failed. Try again.', 'error');
  }
}

function signInWithGoogle() {
  if (CLIENT_ID.startsWith('YOUR_GOOGLE')) {
    // Demo mode: fake sign-in so users can test all features
    onUserSignedIn({
      name: 'Demo User',
      email: 'demo@homegrocery.app',
      picture: 'https://ui-avatars.com/api/?name=Demo+User&background=7c5cfc&color=fff&size=64',
    });
    return;
  }

  if (typeof google === 'undefined') {
    showToast('Google Sign-In not loaded yet. Check your internet connection.', 'error');
    return;
  }

  google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Fallback: render the button programmatically
      const container = document.getElementById('google-login-btn');
      google.accounts.id.renderButton(container, {
        theme: 'outline', size: 'large', shape: 'pill', width: 300,
      });
    }
  });
}

function signOut() {
  if (typeof google !== 'undefined' && !CLIENT_ID.startsWith('YOUR_GOOGLE')) {
    google.accounts.id.disableAutoSelect();
  }
  currentUser = null;
  clearSavedUser();
  showLoginOverlay();
}

// ─────────────────────────────────────────
// DEMO MODE (no Client ID set)
// ─────────────────────────────────────────
function setupDemoLoginButton() {
  const btn = document.getElementById('google-login-btn');
  if (btn) {
    btn.title = 'Demo Mode — no real Google OAuth';
  }
}

// ─────────────────────────────────────────
// APP INIT
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Try to restore session
  const saved = loadSavedUser();
  if (saved) {
    onUserSignedIn(saved, true);
  }
  initGoogle();
  // Toast container
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);
});

function onUserSignedIn(user, isRestore = false) {
  currentUser = user;
  saveUser(user);
  loadList();
  hideLoginOverlay();
  renderUserInfo();
  renderCategoryTabs();
  renderHomeItems();
  renderMyList();
  renderRecentItems();
  updateListBadge();
  if (!isRestore) showToast(`Welcome, ${user.name.split(' ')[0]}! 👋`, 'success');
}

function hideLoginOverlay() {
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

function showLoginOverlay() {
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function renderUserInfo() {
  if (!currentUser) return;
  document.getElementById('user-name').textContent = currentUser.name;
  const avatar = document.getElementById('user-avatar');
  avatar.src = currentUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=7c5cfc&color=fff&size=64`;
  avatar.onerror = () => {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=7c5cfc&color=fff&size=64`;
  };
  document.getElementById('dl-user-name').textContent = currentUser.name;
  updateDateLabel();
}

function updateDateLabel() {
  const now = new Date();
  document.getElementById('dl-date').textContent = now.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────
function switchTab(tab) {
  ['home', 'add', 'list'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`pane-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`pane-${t}`).classList.toggle('hidden', t !== tab);
  });
  if (tab === 'list') { updateDateLabel(); renderMyList(); }
  if (tab === 'add') { renderRecentItems(); }
}

// ─────────────────────────────────────────
// HOME TAB
// ─────────────────────────────────────────
function renderCategoryTabs() {
  const container = document.getElementById('cat-tabs');
  container.innerHTML = CATEGORIES.map(cat =>
    `<button class="cat-tab ${cat === activeCategory ? 'active' : ''}"
       onclick="selectCategory('${cat}')">${cat}</button>`
  ).join('');
}

function selectCategory(cat) {
  activeCategory = cat;
  renderCategoryTabs();
  renderHomeItems();
}

function filterHomeItems() {
  currentSearchTerm = document.getElementById('home-search').value.trim().toLowerCase();
  renderHomeItems();
}

function renderHomeItems() {
  const grid = document.getElementById('home-items-grid');
  let items = ROUTINE_ITEMS;

  if (activeCategory !== 'All') {
    items = items.filter(i => i.category === activeCategory);
  }
  if (currentSearchTerm) {
    items = items.filter(i => i.name.toLowerCase().includes(currentSearchTerm));
  }

  if (items.length === 0) {
    grid.innerHTML = `<div class="empty-list" style="grid-column:1/-1"><span>🔍</span><p>No items found for "<strong>${currentSearchTerm}</strong>"</p></div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    // Use the original ROUTINE_ITEMS index so we never pass emojis/special chars through onclick strings
    const globalIdx = ROUTINE_ITEMS.indexOf(item);
    const isAdded = groceryList.some(g => g.name === item.name);
    const slug = slugify(item.name);
    return `
      <div class="item-card ${isAdded ? 'added' : ''}" id="card-${slug}">
        <span class="item-card-emoji">${item.emoji}</span>
        <div class="item-card-name">${item.name}</div>
        <div class="item-card-qrow">
          <input type="number" class="item-card-qty-input" id="qty-${slug}"
            value="1" min="0.1" step="0.1" onclick="event.stopPropagation()" />
          <select class="item-card-unit-select" id="unit-${slug}" onclick="event.stopPropagation()">
            ${unitOptions(item.defaultUnit)}
          </select>
        </div>
        <button class="item-card-action" onclick="addRoutineItem(${globalIdx})">
          ${isAdded ? '✔ Added' : '+ Add'}
        </button>
      </div>`;
  }).join('');

  // Attach event listeners after rendering (safer than inline onclick for emojis)
  grid.querySelectorAll('.item-card-action').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
}

function addRoutineItem(idx) {
  const item = ROUTINE_ITEMS[idx];
  if (!item) return;

  const { name, emoji } = item;
  const slug = slugify(name);
  const qty = parseFloat(document.getElementById(`qty-${slug}`)?.value) || 1;
  const unit = document.getElementById(`unit-${slug}`)?.value || item.defaultUnit || 'pcs';

  if (groceryList.some(g => g.name === name)) {
    showToast(`${name} is already in your list!`);
    return;
  }

  pushToList({ name, emoji, qty, unit, note: '' });

  // Update card UI without re-rendering the whole grid
  const card = document.getElementById(`card-${slug}`);
  if (card) {
    card.classList.add('added');
    const btn = card.querySelector('.item-card-action');
    if (btn) btn.textContent = '✔ Added';
  }

  showToast(`${emoji} ${name} added!`, 'success');
  // Switch to My List tab so user can see the added item
  switchTab('list');
}

// ─────────────────────────────────────────
// ADD ITEMS TAB
// ─────────────────────────────────────────
function addCustomItem() {
  const nameEl = document.getElementById('item-name');
  const qtyEl = document.getElementById('item-qty');
  const unitEl = document.getElementById('item-unit');
  const noteEl = document.getElementById('item-note');

  const name = nameEl.value.trim();
  const qty = parseFloat(qtyEl.value) || 1;
  const unit = unitEl.value;
  const note = noteEl.value.trim();

  if (!name) { showToast('Please enter an item name!', 'error'); nameEl.focus(); return; }
  if (qty <= 0) { showToast('Quantity must be greater than 0.', 'error'); qtyEl.focus(); return; }

  const emoji = emojiForName(name);
  pushToList({ name, emoji, qty, unit, note });

  nameEl.value = '';
  qtyEl.value = '';
  noteEl.value = '';
  nameEl.focus();
  showToast(`${emoji} ${name} added!`, 'success');
  renderRecentItems();
  renderHomeItems(); // refresh "added" states
}

function renderRecentItems() {
  const container = document.getElementById('recent-list');
  const section = document.getElementById('recent-section');
  const recent = [...groceryList].reverse().slice(0, 6);
  if (recent.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';
  container.innerHTML = recent.map(item => `
    <div class="recent-item">
      <span>${item.emoji} <span class="recent-item-name">${escHtml(item.name)}</span></span>
      <span class="recent-item-qty">${item.qty} ${item.unit}</span>
    </div>
  `).join('');
}

// ─────────────────────────────────────────
// MY LIST TAB
// ─────────────────────────────────────────
function renderMyList() {
  const container = document.getElementById('list-items-container');
  const emptyMsg = document.getElementById('empty-list-msg');
  const meta = document.getElementById('list-meta');

  updateListBadge();

  if (groceryList.length === 0) {
    container.innerHTML = `
      <div class="empty-list" id="empty-list-msg">
        <span>🧺</span>
        <p>Your list is empty.<br/>Start adding items from Home or Add Items tab.</p>
      </div>`;
    meta.textContent = 'No items yet';
    return;
  }

  meta.textContent = `${groceryList.length} item${groceryList.length !== 1 ? 's' : ''}`;
  container.innerHTML = groceryList.map((item, idx) => `
    <div class="list-row" id="row-${item.id}">
      <span class="list-row-num">${idx + 1}</span>
      <span class="list-row-emoji">${item.emoji}</span>
      <div style="flex:1; min-width:0;">
        <div class="list-row-name">${escHtml(item.name)}</div>
        ${item.note ? `<div class="list-row-note">${escHtml(item.note)}</div>` : ''}
      </div>
      <span class="list-row-qty">${item.qty} ${item.unit}</span>
      <button class="list-row-delete" onclick="deleteItem('${item.id}')" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

function deleteItem(id) {
  groceryList = groceryList.filter(i => i.id !== id);
  saveList();
  renderMyList();
  renderHomeItems();
  showToast('Item removed');
}

function clearList() {
  if (groceryList.length === 0) return;
  if (!confirm(`Remove all ${groceryList.length} items from your list?`)) return;
  groceryList = [];
  saveList();
  renderMyList();
  renderHomeItems();
  renderRecentItems();
  showToast('List cleared!');
}

function updateListBadge() {
  const badge = document.getElementById('list-badge');
  badge.textContent = groceryList.length;
  badge.style.display = groceryList.length > 0 ? '' : 'none';
}

// ─────────────────────────────────────────
// PNG DOWNLOAD via html2canvas
// ─────────────────────────────────────────
async function downloadList() {
  if (groceryList.length === 0) {
    showToast('Your list is empty — nothing to download!', 'error');
    return;
  }

  const area = document.getElementById('list-download-area');
  showToast('Generating PNG…');

  try {
    const canvas = await html2canvas(area, {
      backgroundColor: '#12132b',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    link.download = `grocery-list-${dateStr}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✅ Downloaded!', 'success');
  } catch (e) {
    showToast('Download failed. Try again.', 'error');
    console.error(e);
  }
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function pushToList(item) {
  groceryList.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: item.name,
    emoji: item.emoji,
    qty: item.qty,
    unit: item.unit,
    note: item.note || '',
    addedAt: Date.now(),
  });
  saveList();
  updateListBadge();
}

function unitOptions(selected = 'pcs') {
  const opts = ['pcs', 'kg', 'g', 'L', 'mL', 'dozen', 'pack', 'bag'];
  return opts.map(u =>
    `<option value="${u}" ${u === selected ? 'selected' : ''}>${u}</option>`
  ).join('');
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

// Smart emoji picker by keyword
function emojiForName(name) {
  const n = name.toLowerCase();
  const map = [
    ['milk', '🥛'], ['egg', '🥚'], ['rice', '🍚'], ['sugar', '🍬'], ['salt', '🧂'],
    ['oil', '🫙'], ['flour', '🌾'], ['dal', '🫘'], ['lentil', '🫘'], ['bean', '🫘'],
    ['chicken', '🍗'], ['meat', '🥩'], ['fish', '🐟'], ['prawn', '🦐'],
    ['apple', '🍎'], ['banana', '🍌'], ['mango', '🥭'], ['orange', '🍊'], ['grape', '🍇'],
    ['lemon', '🍋'], ['tomato', '🍅'], ['potato', '🥔'], ['onion', '🧅'], ['garlic', '🧄'],
    ['ginger', '🫚'], ['carrot', '🥕'], ['spinach', '🥬'], ['brinjal', '🍆'], ['peas', '🫛'],
    ['pepper', '🌶️'], ['chilli', '🌶️'], ['coriander', '🌿'], ['mint', '🌿'],
    ['bread', '🍞'], ['biscuit', '🍪'], ['chocolate', '🍫'], ['jam', '🍯'],
    ['coffee', '☕'], ['tea', '🍵'], ['juice', '🧃'], ['water', '💧'],
    ['butter', '🧈'], ['cheese', '🧀'], ['curd', '🫙'], ['yoghurt', '🫙'], ['paneer', '🧀'],
    ['soap', '🫧'], ['shampoo', '🧴'], ['toothpaste', '🪥'], ['tissue', '🧻'],
    ['detergent', '🧺'], ['bleach', '🫧'], ['vitamin', '💊'], ['medicine', '💊'],
  ];
  for (const [kw, emoji] of map) {
    if (n.includes(kw)) return emoji;
  }
  return '🛒';
}

// ─────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────
let toastTimer;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  // Force reflow
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
