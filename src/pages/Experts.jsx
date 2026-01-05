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
                const data = await fetchFromStrapi('/experts', { populate: '*' });
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
            <div className="section container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="section-title">Meet Our Experts</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
                        Learn from professionals who are currently working in the industry.
                    </p>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading experts...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
                                <div key={expert.id} className="expert-card" style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'transform 0.3s ease',
                                    border: '1px solid #f0f0f0',
                                    height: '100%'
                                }}>
                                    {/* Profile Image with Ring */}
                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        padding: '3px',
                                        background: '#fff',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                        marginBottom: '0.75rem',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '1px solid #eee'
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
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            marginBottom: '0.2rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {expert.name}
                                        </h3>
                                        <p style={{
                                            color: '#94a3b8',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            marginBottom: '0'
                                        }}>
                                            {expert.role}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        marginBottom: '1.25rem',
                                        marginTop: '0.5rem'
                                    }}>
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
                                        <div style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: '#334155',
                                            padding: '0.4rem 0.8rem',
                                            background: '#f8fafc',
                                            borderRadius: '6px'
                                        }}>
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
                                            <span key={idx} style={{
                                                background: '#f1f5f9',
                                                color: '#475569',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '99px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                        {remainingSkills > 0 && (
                                            <span style={{
                                                background: '#fff',
                                                border: '1px solid #e2e8f0',
                                                color: '#64748b',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '99px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                +{remainingSkills}
                                            </span>
                                        )}
                                    </div>

                                    {/* Social Icons (Moved to Bottom) */}
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', width: '100%', justifyContent: 'center' }}>
                                        {expert.linkedin && (
                                            <a href={expert.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {expert.facebook && (
                                            <a href={expert.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Facebook size={18} />
                                            </a>
                                        )}
                                        {expert.github && (
                                            <a href={expert.github} target="_blank" rel="noopener noreferrer" style={{ color: '#333', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Github size={18} />
                                            </a>
                                        )}
                                        {expert.website && (
                                            <a href={expert.website} target="_blank" rel="noopener noreferrer" style={{ color: '#666', transition: 'transform 0.2s' }} className="hover-scale">
                                                <Globe size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div >
        </>
    );
};
export default Experts;
