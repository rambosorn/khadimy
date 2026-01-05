import { useState } from 'react';
import { Facebook, Linkedin, Link2, Send, Instagram, Check } from 'lucide-react';

const ShareButtons = ({ url, title }) => {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'Copy Link',
            icon: copied ? <Check size={20} /> : <Link2 size={20} />,
            onClick: handleCopy,
            color: '#666',
            bg: 'white',
            border: '1px solid #ddd'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'white',
            bg: '#0077b5'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'white',
            bg: '#1877f2'
        },
        {
            name: 'Telegram',
            icon: <Send size={20} />,
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'white',
            bg: '#0088cc'
        },
        {
            name: 'Instagram',
            icon: <Instagram size={20} />,
            onClick: handleCopy, // No web API, fallback to copy
            color: 'white',
            bg: '#e4405f',
            title: 'Copy link for Instagram'
        }
    ];

    return (
        <div style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '2rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#333'
            }}>
                <Share2Icon /> SHARE
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {shareLinks.map((link, index) => {
                    const style = {
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        background: link.bg,
                        color: link.color,
                        border: link.border || 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    };

                    if (link.href) {
                        return (
                            <a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={style}
                                title={`Share on ${link.name}`}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {link.icon}
                            </a>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={link.onClick}
                            style={style}
                            title={link.title || link.name}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {link.icon}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Simple Share Icon implementation if not imported from lucide-react to be safe, 
// but I will import existing Lucide icons in the file.
// Wait, I can just use the Lucide import.
// I'll add Share2 to imports.

const Share2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

export default ShareButtons;
