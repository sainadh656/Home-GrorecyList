// ─── Google OAuth Client ID ───────────────────────────────
// Replace with your own from https://console.cloud.google.com/
export const CLIENT_ID = '897324727631-m4fh5nrrdq1k4u6r0u6j5hq6alhgkl28.apps.googleusercontent.com';

// ─── Routine Items ────────────────────────────────────────
export const ROUTINE_ITEMS = [
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
    { name: 'Bananas', emoji: '🍌', category: 'Fruits', defaultUnit: 'dozen' },
    { name: 'Apples', emoji: '🍎', category: 'Fruits', defaultUnit: 'kg' },
    { name: 'Mangoes', emoji: '🥭', category: 'Fruits', defaultUnit: 'kg' },
    { name: 'Lemons', emoji: '🍋', category: 'Fruits', defaultUnit: 'pcs' },
    { name: 'Grapes', emoji: '🍇', category: 'Fruits', defaultUnit: 'kg' },
    { name: 'Milk', emoji: '🥛', category: 'Dairy', defaultUnit: 'L' },
    { name: 'Curd / Yoghurt', emoji: '🫙', category: 'Dairy', defaultUnit: 'kg' },
    { name: 'Paneer', emoji: '🧀', category: 'Dairy', defaultUnit: 'g' },
    { name: 'Butter', emoji: '🧈', category: 'Dairy', defaultUnit: 'g' },
    { name: 'Eggs', emoji: '🥚', category: 'Dairy', defaultUnit: 'dozen' },
    { name: 'Basmati Rice', emoji: '🍚', category: 'Grains', defaultUnit: 'kg' },
    { name: 'Wheat Flour', emoji: '🌾', category: 'Grains', defaultUnit: 'kg' },
    { name: 'Toor Dal', emoji: '🫘', category: 'Grains', defaultUnit: 'kg' },
    { name: 'Chana Dal', emoji: '🫘', category: 'Grains', defaultUnit: 'kg' },
    { name: 'Oats', emoji: '🥣', category: 'Grains', defaultUnit: 'g' },
    { name: 'Cooking Oil', emoji: '🫙', category: 'Oils', defaultUnit: 'L' },
    { name: 'Mustard Seeds', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
    { name: 'Cumin Seeds', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
    { name: 'Turmeric', emoji: '🫙', category: 'Oils', defaultUnit: 'g' },
    { name: 'Salt', emoji: '🧂', category: 'Oils', defaultUnit: 'kg' },
    { name: 'Biscuits', emoji: '🍪', category: 'Snacks', defaultUnit: 'pack' },
    { name: 'Bread', emoji: '🍞', category: 'Snacks', defaultUnit: 'pcs' },
    { name: 'Coffee', emoji: '☕', category: 'Snacks', defaultUnit: 'g' },
    { name: 'Tea', emoji: '🍵', category: 'Snacks', defaultUnit: 'g' },
    { name: 'Sugar', emoji: '🍬', category: 'Snacks', defaultUnit: 'kg' },
    { name: 'Dish Soap', emoji: '🫧', category: 'Household', defaultUnit: 'mL' },
    { name: 'Laundry Powder', emoji: '🧺', category: 'Household', defaultUnit: 'kg' },
    { name: 'Toilet Paper', emoji: '🧻', category: 'Household', defaultUnit: 'pack' },
    { name: 'Hand Wash', emoji: '🧴', category: 'Household', defaultUnit: 'mL' },
];

export const CATEGORIES = ['All', ...new Set(ROUTINE_ITEMS.map(i => i.category))];

export const UNITS = ['pcs', 'kg', 'g', 'L', 'mL', 'dozen', 'pack', 'bag'];

// ─── Helpers ──────────────────────────────────────────────
export function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emojiForName(name) {
    const n = name.toLowerCase();
    const map = [
        ['milk', '🥛'], ['egg', '🥚'], ['rice', '🍚'], ['sugar', '🍬'], ['salt', '🧂'],
        ['oil', '🫙'], ['flour', '🌾'], ['dal', '🫘'], ['lentil', '🫘'], ['bean', '🫘'],
        ['chicken', '🍗'], ['meat', '🥩'], ['fish', '🐟'], ['prawn', '🦐'],
        ['apple', '🍎'], ['banana', '🍌'], ['mango', '🥭'], ['orange', '🍊'], ['grape', '🍇'],
        ['lemon', '🍋'], ['tomato', '🍅'], ['potato', '🥔'], ['onion', '🧅'], ['garlic', '🧄'],
        ['ginger', '🫚'], ['carrot', '🥕'], ['spinach', '🥬'], ['brinjal', '🍆'], ['peas', '🫛'],
        ['chilli', '🌶️'], ['pepper', '🌶️'], ['coriander', '🌿'], ['mint', '🌿'],
        ['bread', '🍞'], ['biscuit', '🍪'], ['chocolate', '🍫'], ['jam', '🍯'],
        ['coffee', '☕'], ['tea', '🍵'], ['juice', '🧃'], ['water', '💧'],
        ['butter', '🧈'], ['cheese', '🧀'], ['curd', '🫙'], ['yoghurt', '🫙'], ['paneer', '🧀'],
        ['soap', '🫧'], ['shampoo', '🧴'], ['toothpaste', '🪥'], ['tissue', '🧻'],
        ['detergent', '🧺'], ['vitamin', '💊'], ['medicine', '💊'],
    ];
    for (const [kw, emoji] of map) if (n.includes(kw)) return emoji;
    return '🛒';
}

export function formatDate() {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── LocalStorage helpers ─────────────────────────────────
export function loadUser() { try { return JSON.parse(localStorage.getItem('hg_user')) } catch { return null; } }
export function saveUser(u) { localStorage.setItem('hg_user', JSON.stringify(u)); }
export function clearUser() { localStorage.removeItem('hg_user'); }
export function loadList(email) { try { return JSON.parse(localStorage.getItem(`hg_list_${email}`)) || []; } catch { return []; } }
export function saveList(email, list) { localStorage.setItem(`hg_list_${email}`, JSON.stringify(list)); }
