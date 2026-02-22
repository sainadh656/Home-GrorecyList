import { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import AddItemsTab from './components/AddItemsTab';
import MyListTab from './components/MyListTab';
import Toast from './components/Toast';
import { loadUser, saveUser, clearUser, loadList, saveList, makeId } from './data';

const TABS = ['home', 'add', 'list'];

export default function App() {
    const [user, setUser] = useState(null);
    const [list, setList] = useState([]);
    const [activeTab, setActiveTab] = useState('home');
    const [toast, setToast] = useState({ msg: '', type: '', visible: false });

    // ── Restore session on mount ──────────────────────────────
    useEffect(() => {
        const saved = loadUser();
        if (saved) {
            setUser(saved);
            setList(loadList(saved.email));
        }
    }, []);

    // ── Save list on change ───────────────────────────────────
    useEffect(() => {
        if (user) saveList(user.email, list);
    }, [list, user]);

    // ── Toast helper ──────────────────────────────────────────
    const showToast = useCallback((msg, type = '') => {
        setToast({ msg, type, visible: true });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
    }, []);

    // ── Auth ──────────────────────────────────────────────────
    function onSignIn(u) {
        setUser(u);
        saveUser(u);
        setList(loadList(u.email));
        showToast(`Welcome, ${u.name.split(' ')[0]}! 👋`, 'success');
        setActiveTab('home');
    }

    function onSignOut() {
        clearUser();
        setUser(null);
        setList([]);
        setActiveTab('home');
    }

    // ── List mutations ────────────────────────────────────────
    function addItem(item) {
        const newItem = { ...item, id: makeId(), addedAt: Date.now() };
        setList(prev => [...prev, newItem]);
    }

    function deleteItem(id) {
        setList(prev => prev.filter(i => i.id !== id));
    }

    function clearAll() {
        setList([]);
    }

    // ── Render ────────────────────────────────────────────────
    if (!user) {
        return (
            <>
                <LoginScreen onSignIn={onSignIn} />
                <Toast message={toast.msg} type={toast.type} visible={toast.visible} />
            </>
        );
    }

    return (
        <div className="app">
            <Navbar user={user} onSignOut={onSignOut} />

            {/* Tab bar */}
            <div className="tab-bar">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <div className="tab-icon-wrap">
                            <span className="tab-icon">
                                {tab === 'home' ? '🏠' : tab === 'add' ? '➕' : '📋'}
                            </span>
                        </div>
                        <span>{tab === 'home' ? 'Home' : tab === 'add' ? 'Add Items' : 'My List'}</span>
                        {tab === 'list' && list.length > 0 && (
                            <span className="list-badge">{list.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab panes */}
            {activeTab === 'home' && (
                <HomeTab groceryList={list} onAdd={addItem} showToast={showToast} />
            )}
            {activeTab === 'add' && (
                <AddItemsTab groceryList={list} onAdd={addItem} showToast={showToast} />
            )}
            {activeTab === 'list' && (
                <MyListTab groceryList={list} user={user} onDelete={deleteItem} onClear={clearAll} showToast={showToast} />
            )}

            <Toast message={toast.msg} type={toast.type} visible={toast.visible} />
        </div>
    );
}
