import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Facebook, Calendar, MapPin, ExternalLink, PlusSquare } from 'lucide-react';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

const Community = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await fetchFromStrapi('/events', {
                    'populate': '*',
                    'sort[0]': 'date:asc',
                    'filters[date][$gte]': new Date().toISOString() // Show upcoming events
                });
                setEvents(unwrapStrapiResponse(data));
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    const getGoogleCalendarUrl = (event) => {
        const title = encodeURIComponent(event.title);
        const description = encodeURIComponent(`Join us for ${event.title}!`);
        const location = encodeURIComponent(event.location || '');

        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours duration

        const formatTime = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');
        const dates = `${formatTime(startDate)}/${formatTime(endDate)}`;

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${description}&location=${location}`;
    };

    return (
        <>
            <Helmet><title>Khadimy | Community</title></Helmet>
            <div className="section container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="section-title">Join the Community</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666', fontSize: '1.1rem' }}>
                        Connect with fellow learners, alumni, and mentors. Stay updated on the latest tech trends in Cambodia.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto 4rem auto' }}>
                    <a href="https://t.me/khademy_official" target="_blank" rel="noreferrer" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '3rem',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0088cc15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Send size={40} color="#0088cc" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Telegram Channel</h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Get daily updates, job postings, and course announcements.</p>
                        <span className="btn btn-primary">Join Channel</span>
                    </a>

                    <a href="https://www.facebook.com/khadimyofficial" target="_blank" rel="noreferrer" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '3rem',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1877f215', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Facebook size={40} color="#1877f2" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Facebook Page</h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Follow us for event photos, live streams, and community stories.</p>
                        <span className="btn btn-outline">Follow Us</span>
                    </a>
                </div>

                {/* Events Section */}
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Upcoming Events</h2>

                    {loading ? (
                        <p style={{ textAlign: 'center' }}>Loading events...</p>
                    ) : events.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: 'var(--radius-md)' }}>
                            <Calendar size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: '#666' }}>No upcoming events scheduled. Check back soon!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {events.map(event => {
                                const eventDate = new Date(event.date);
                                const day = eventDate.getDate();
                                const month = eventDate.toLocaleDateString(undefined, { month: 'long' });
                                const year = eventDate.getFullYear();
                                const time = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={event.id} style={{
                                        background: 'var(--color-surface)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'row', // Default row for desktop
                                        border: '1px solid var(--color-border)'
                                    }} className="event-card-responsive">
                                        {/* Thumbnail (Left) */}
                                        <div style={{
                                            width: '320px',
                                            minWidth: '320px',
                                            background: '#f0f0f0',
                                            backgroundImage: event.cover ? `url(${getStrapiMedia(event.cover.url)})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative'
                                        }}>
                                            {!event.cover && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                    <Calendar size={64} color="#bdc3c7" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content (Right) */}
                                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                            {/* Header: Title + Big Date */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-text)' }}>{event.title}</h3>

                                                    {/* Metadata */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '1rem' }}>
                                                        {event.location && (
                                                            <>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                                    <MapPin size={18} /> {event.location}
                                                                </div>
                                                                <span style={{ color: '#ccc' }}>•</span>
                                                            </>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <Calendar size={18} /> {time}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Big Date Display */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: 1 }}>
                                                    <span style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-2px' }}>{day}</span>
                                                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '1.1rem', fontWeight: '500', paddingLeft: '0.2rem' }}>
                                                        <span>{month},</span>
                                                        <span>{year}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ marginTop: '1.5rem' }}>
                                                <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.75rem 1.5rem',
                                                        border: '1px solid var(--color-primary)',
                                                        color: 'var(--color-primary)',
                                                        borderRadius: '6px',
                                                        textDecoration: 'none',
                                                        fontWeight: '600',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-bg-alt)'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    Add to Calendar <PlusSquare size={18} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .event-card-responsive {
                        flex-direction: column !important;
                    }
                    .event-card-responsive > div:first-child {
                        width: 100% !important;
                        height: 200px;
                    }
                }
            `}</style>
        </>
    );
};
export default Community;
