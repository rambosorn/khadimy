import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Linkedin, Facebook, Globe, Github } from 'lucide-react';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

const Experts = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadExperts() {
            try {
                const data = await fetchFromStrapi('/experts', {
                    populate: {
                        photo: { fields: ['url', 'alternativeText'] },
                        skills: true
                    },
                    fields: ['name', 'role', 'location', 'experience', 'linkedin', 'facebook', 'github', 'website']
                });
                setExperts(unwrapStrapiResponse(data));
            } catch (err) {
                console.error("Failed to load experts", err);
            } finally {
                setLoading(false);
            }
        }
        loadExperts();
    }, []);

    return (
        <>
            <Helmet><title>Khadimy | Our Experts</title></Helmet>
            <div style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 className="section-title">Meet Our Experts</h1>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
                            Learn from professionals who are currently working in the industry.
                        </p>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center' }}>Loading experts...</p>
                    ) : (
                        <div className="experts-grid">
                            {experts.map(expert => {
                                const imageUrl = expert.photo ? getStrapiMedia(expert.photo.url) : 'https://placehold.co/150';
                                // Dynamic data or fallbacks
                                const location = expert.location || 'Phnom Penh, Cambodia';
                                // const experience = expert.experience || '3+ yrs of exp.';  // Removed per request
                                // const consultations = expert.consultations || '100+ consultations'; // Removed per request

                                const skills = expert.skills || expert.expertise;

                                // Process skills based on format
                                let skillsList = [];
                                if (skills && !Array.isArray(skills) && typeof skills === 'object' && Array.isArray(skills.skills)) {
                                    skillsList = skills.skills;
                                } else if (Array.isArray(skills)) {
                                    skillsList = skills;
                                } else if (typeof skills === 'string') {
                                    skillsList = [skills];
                                }

                                // Limit tags to show
                                const displaySkills = skillsList.slice(0, 3);
                                const remainingSkills = skillsList.length - 3;

                                return (
                                    <div key={expert.id} className="expert-card-container">
                                        {/* Profile Image with Ring */}
                                        <div style={{
                                            width: '90px',
                                            height: '90px',
                                            borderRadius: '50%',
                                            padding: '3px',
                                            background: 'var(--color-surface)',
                                            boxShadow: 'var(--shadow-sm)',
                                            marginBottom: '0.75rem',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '1px solid var(--color-border)'
                                            }}>
                                                <img
                                                    src={imageUrl}
                                                    alt={expert.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Name & Role */}
                                        <div style={{ minHeight: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <h3 className="expert-name">
                                                {expert.name}
                                            </h3>
                                            <p className="expert-role">
                                                {expert.role}
                                            </p>
                                        </div>

                                        {/* Location */}
                                        <div className="expert-location">
                                            <Globe size={14} />
                                            <span>{location}</span>
                                        </div>

                                        {/* Experience (Separate) */}
                                        <div style={{
                                            marginBottom: '1rem',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <div className="expert-exp-badge">
                                                {expert.experience || '3+ yrs exp'}
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.4rem',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            marginBottom: '1.5rem',
                                            flexGrow: 1,
                                            alignContent: 'center'
                                        }}>
                                            {displaySkills.map((skill, idx) => (
                                                <span key={idx} className="expert-skill-pill">
                                                    {typeof skill === 'string' ? skill : skill.name}
                                                </span>
                                            ))}
                                            {remainingSkills > 0 && (
                                                <span className="expert-skill-pill-more">
                                                    +{remainingSkills}
                                                </span>
                                            )}
                                        </div>

                                        {/* Social Icons (Moved to Bottom) */}
                                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', width: '100%', justifyContent: 'center' }}>
                                            {expert.linkedin && (
                                                <a href={expert.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }} className="expert-social-link">
                                                    <Linkedin size={18} />
                                                </a>
                                            )}
                                            {expert.facebook && (
                                                <a href={expert.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }} className="expert-social-link">
                                                    <Facebook size={18} />
                                                </a>
                                            )}
                                            {expert.github && (
                                                <a href={expert.github} target="_blank" rel="noopener noreferrer" style={{ color: '#333' }} className="expert-social-link">
                                                    <Github size={18} />
                                                </a>
                                            )}
                                            {expert.website && (
                                                <a href={expert.website} target="_blank" rel="noopener noreferrer" style={{ color: '#666' }} className="expert-social-link">
                                                    <Globe size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Experts;
