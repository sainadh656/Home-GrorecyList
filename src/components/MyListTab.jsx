import { useRef } from 'react';
import { formatDate } from '../data';
import html2canvas from 'html2canvas';
import './MyListTab.css';

export default function MyListTab({ groceryList, user, onDelete, onClear, showToast }) {
    const areaRef = useRef(null);

    async function downloadList() {
        if (groceryList.length === 0) { showToast('Your list is empty — nothing to download!', 'error'); return; }
        showToast('Generating PNG…');
        try {
            const canvas = await html2canvas(areaRef.current, { backgroundColor: '#12132b', scale: 2, useCORS: true, logging: false });
            const link = document.createElement('a');
            const now = new Date();
            link.download = `grocery-list-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('✅ Downloaded!', 'success');
        } catch (e) {
            showToast('Download failed. Try again.', 'error');
        }
    }

    function handleClear() {
        if (groceryList.length === 0) return;
        if (!window.confirm(`Remove all ${groceryList.length} items from your list?`)) return;
        onClear();
        showToast('List cleared!');
    }

    return (
        <section className="pane">
            <div className="list-pane-header">
                <div>
                    <h2 className="pane-title">My Grocery List</h2>
                    <p className="pane-subtitle">{groceryList.length > 0 ? `${groceryList.length} item${groceryList.length !== 1 ? 's' : ''}` : 'No items yet'}</p>
                </div>
                <div className="list-actions">
                    <button className="action-btn download-btn" onClick={downloadList}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Download PNG
                    </button>
                    <button className="action-btn clear-btn" onClick={handleClear}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                        Clear All
                    </button>
                </div>
            </div>

            <div className="list-download-area" ref={areaRef}>
                <div className="list-card-header">
                    <div className="list-card-brand">🛒 HomeGrocery</div>
                    <div className="list-card-meta">
                        <span>{user?.name}</span>
                        <span>{formatDate()}</span>
                    </div>
                </div>
                <div className="list-items-container">
                    {groceryList.length === 0
                        ? (
                            <div className="empty-list">
                                <span>🧺</span>
                                <p>Your list is empty.<br />Start adding items from Home or Add Items tab.</p>
                            </div>
                        )
                        : groceryList.map((item, idx) => (
                            <div key={item.id} className="list-row">
                                <span className="list-row-num">{idx + 1}</span>
                                <span className="list-row-emoji">{item.emoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="list-row-name">{item.name}</div>
                                    {item.note && <div className="list-row-note">{item.note}</div>}
                                </div>
                                <span className="list-row-qty">{item.qty} {item.unit}</span>
                                <button className="list-row-delete" onClick={() => { onDelete(item.id); showToast('Item removed'); }} title="Remove">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14H6L5 6" />
                                        <path d="M10 11v6" /><path d="M14 11v6" />
                                        <path d="M9 6V4h6v2" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}
