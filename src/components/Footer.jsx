import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Github, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                    <img src="/logo.png" alt="Khadimy" style={{ height: '35px', marginBottom: '1rem', objectFit: 'contain' }} />
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        Bridging the gap between academic theory and real industry practice.
                    </p>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/experts">Experts</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Connect</h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Join our community to stay updated.</p>
                </div>
            </div>

            {/* Bottom Bar: Copyright Left, Socials Right */}
            <div className="container" style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #333',
                color: '#888',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Khadimy. All rights reserved.
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Linkedin size={20} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Facebook size={20} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Github size={20} />
                    </a>
                    <a href="https://khadimy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Globe size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
