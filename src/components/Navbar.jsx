import './Navbar.css';

export default function Navbar({ user, onSignOut }) {
    const avatarSrc = user.picture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c5cfc&color=fff&size=64`;

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="nav-logo">🛒</span>
                <span className="nav-title">HomeGrocery</span>
            </div>
            <div className="nav-right">
                <div className="user-info">
                    <img
                        className="user-avatar"
                        src={avatarSrc}
                        alt={user.name}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c5cfc&color=fff&size=64`; }}
                    />
                    <span className="user-name">{user.name}</span>
                </div>
                <button className="signout-btn" onClick={onSignOut} title="Sign out">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
