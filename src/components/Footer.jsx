import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Github, Globe } from 'lucide-react';
import { fetchFromStrapi, unwrapStrapiResponse } from '../lib/strapi';
import { useSiteIdentity } from '../hooks/useSiteIdentity';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const { logoUrl, altText, siteName } = useSiteIdentity();

    useEffect(() => {
        async function loadFooter() {
            try {
                console.log("Fetching footer data...");
                const data = await fetchFromStrapi('/footer');
                console.log("Raw Footer API Response:", data);
                const result = unwrapStrapiResponse(data);
                console.log("Unwrapped Footer Data:", result);
                if (result) {
                    setFooterData(result);
                }
            } catch (err) {
                console.error("Failed to load footer data", err);
            }
        }
        loadFooter();
    }, []);

    // Fallback data if API fails or is loading (optional, or just render strict skeletons. Using defaults for smooth transition)
    const displayData = {
        description: footerData?.description || "Bridging the gap between academic theory and real-world industry practice.",
        copyright: footerData?.copyright_text || `${new Date().getFullYear()} Khadimy. All rights reserved.`,
        socials: {
            linkedin: footerData?.link_linkedin || "https://linkedin.com",
            facebook: footerData?.link_facebook || "https://facebook.com",
            github: footerData?.link_github || "https://github.com",
            website: footerData?.link_website || "https://khadimy.com"
        }
    };

    return (
        <footer style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                    <img src={logoUrl} alt={altText || siteName} style={{ height: '35px', marginBottom: '1rem', objectFit: 'contain' }} />
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        {displayData.description}
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
                    &copy; {displayData.copyright}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href={displayData.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Linkedin size={20} />
                    </a>
                    <a href={displayData.socials.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Facebook size={20} />
                    </a>
                    <a href={displayData.socials.github} target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Github size={20} />
                    </a>
                    <a href={displayData.socials.website} target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', transition: 'color 0.2s' }} className="hover:text-white">
                        <Globe size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
