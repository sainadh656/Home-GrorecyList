import { useState } from 'react';
import { UNITS, emojiForName } from '../data';
import './AddItemsTab.css';

export default function AddItemsTab({ groceryList, onAdd, showToast }) {
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [note, setNote] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const trimName = name.trim();
        const parsedQty = parseFloat(qty) || 1;
        if (!trimName) { showToast('Please enter an item name!', 'error'); return; }
        if (parsedQty <= 0) { showToast('Quantity must be greater than 0.', 'error'); return; }
        const emoji = emojiForName(trimName);
        onAdd({ name: trimName, emoji, qty: parsedQty, unit, note: note.trim() });
        showToast(`${emoji} ${trimName} added!`, 'success');
        setName(''); setQty(''); setNote(''); setUnit('pcs');
    }

    const recent = [...groceryList].reverse().slice(0, 6);

    return (
        <section className="pane">
            <div className="pane-header">
                <h2 className="pane-title">Add Custom Item</h2>
                <p className="pane-subtitle">Add anything not in the routine list</p>
            </div>

            <form className="add-form-card" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input className="form-input" type="text" placeholder="e.g. Organic Almonds" maxLength={60}
                        value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-row">
                    <div className="form-group flex1">
                        <label className="form-label">Quantity</label>
                        <input className="form-input" type="number" placeholder="1" min="0.1" step="0.1"
                            value={qty} onChange={e => setQty(e.target.value)} />
                    </div>
                    <div className="form-group flex1">
                        <label className="form-label">Unit</label>
                        <select className="form-select" value={unit} onChange={e => setUnit(e.target.value)}>
                            <option value="pcs">pcs (pieces)</option>
                            <option value="kg">kg (kilogram)</option>
                            <option value="g">g (gram)</option>
                            <option value="L">L (litre)</option>
                            <option value="mL">mL (millilitre)</option>
                            <option value="dozen">dozen</option>
                            <option value="pack">pack</option>
                            <option value="bag">bag</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Note (optional)</label>
                    <input className="form-input" type="text" placeholder="e.g. Brand preference, colour…" maxLength={100}
                        value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <button type="submit" className="add-btn">➕ Add to My List</button>
            </form>

            {recent.length > 0 && (
                <div className="recent-section">
                    <h3 className="section-heading">Recently Added</h3>
                    <div className="recent-list">
                        {recent.map(item => (
                            <div key={item.id} className="recent-item">
                                <span>{item.emoji} <span className="recent-item-name">{item.name}</span></span>
                                <span className="recent-item-qty">{item.qty} {item.unit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
