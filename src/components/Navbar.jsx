import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar" style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem 0', background: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="Khadimy Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links desktop-flex" style={{ gap: '2rem', alignItems: 'center' }}>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <Link to="/experts">Experts</Link>
                    <Link to="/community">Community</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Join Now
                    </Link>
                    <button onClick={toggleTheme} style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Night Mode">
                        {theme === 'light' ? <Moon size={20} color="var(--color-primary)" /> : <Sun size={20} color="var(--color-accent)" />}
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Night Mode">
                        {theme === 'light' ? <Moon size={20} color="var(--color-primary)" /> : <Sun size={20} color="var(--color-accent)" />}
                    </button>
                    <button onClick={toggleMenu} aria-label="Toggle Menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="mobile-menu mobile-only" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'var(--color-surface)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <Link to="/" onClick={toggleMenu} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Home</Link>
                    <Link to="/courses" onClick={toggleMenu} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Courses</Link>
                    <Link to="/experts" onClick={toggleMenu} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Experts</Link>
                    <Link to="/community" onClick={toggleMenu} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Community</Link>
                    <Link to="/register" onClick={toggleMenu} className="btn btn-primary" style={{ textAlign: 'center' }}>
                        Join Now
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
