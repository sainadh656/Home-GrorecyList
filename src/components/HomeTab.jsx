import { useState } from 'react';
import { ROUTINE_ITEMS, CATEGORIES, UNITS, slugify } from '../data';
import './HomeTab.css';

export default function HomeTab({ groceryList, onAdd, showToast }) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [quantities, setQuantities] = useState({});
    const [units, setUnits] = useState({});

    const filtered = ROUTINE_ITEMS.filter(item => {
        const matchCat = activeCategory === 'All' || item.category === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    function getQty(name) { return quantities[name] ?? 1; }
    function getUnit(name) { return units[name] ?? ROUTINE_ITEMS.find(i => i.name === name)?.defaultUnit ?? 'pcs'; }

    function handleAdd(item) {
        const already = groceryList.some(g => g.name === item.name);
        if (already) { showToast(`${item.name} is already in your list!`); return; }
        onAdd({ name: item.name, emoji: item.emoji, qty: parseFloat(getQty(item.name)) || 1, unit: getUnit(item.name), note: '' });
        showToast(`${item.emoji} ${item.name} added!`, 'success');
    }

    return (
        <section className="pane">
            <div className="pane-header">
                <h2 className="pane-title">Routine Grocery Items</h2>
                <p className="pane-subtitle">Tap any item to add it to your list</p>
                <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search items…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="cat-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`cat-tab ${cat === activeCategory ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >{cat}</button>
                ))}
            </div>

            {filtered.length === 0
                ? <div className="empty-list"><span>🔍</span><p>No items found for "<strong>{search}</strong>"</p></div>
                : (
                    <div className="items-grid">
                        {filtered.map(item => {
                            const isAdded = groceryList.some(g => g.name === item.name);
                            return (
                                <div key={item.name} className={`item-card ${isAdded ? 'added' : ''}`}>
                                    <span className="item-card-emoji">{item.emoji}</span>
                                    <div className="item-card-name">{item.name}</div>
                                    <div className="item-card-qrow">
                                        <input
                                            type="number"
                                            className="item-card-qty-input"
                                            value={getQty(item.name)}
                                            min="0.1" step="0.1"
                                            onChange={e => setQuantities(q => ({ ...q, [item.name]: e.target.value }))}
                                        />
                                        <select
                                            className="item-card-unit-select"
                                            value={getUnit(item.name)}
                                            onChange={e => setUnits(u => ({ ...u, [item.name]: e.target.value }))}
                                        >
                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        className="item-card-action"
                                        onClick={() => handleAdd(item)}
                                    >
                                        {isAdded ? '✔ Added' : '+ Add'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        </section>
    );
}
