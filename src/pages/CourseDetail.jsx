import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Globe, User, ArrowLeft, Linkedin, Facebook, Calendar, Layers, Share2 } from 'lucide-react';
import NotFound from './NotFound';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';
import ShareButtons from '../components/ShareButtons';

const CourseDetail = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadCourse() {
            try {
                const data = await fetchFromStrapi('/courses', {
                    populate: ['cover', 'instructor', 'instructor.photo'],
                    'filters[slug][$eq]': slug
                });
                const courses = unwrapStrapiResponse(data);
                if (courses && courses.length > 0) {
                    setCourse(courses[0]);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to load course detail", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (slug) {
            loadCourse();
        }
    }, [slug]);

    if (loading) {
        return <div className="container section">Loading course details...</div>;
    }

    if (error || !course) {
        return <NotFound />;
    }

    return (
        <>
            <Helmet>
                <title>Khadimy | {course.title}</title>
                <meta name="description" content={course.overview} />
            </Helmet>

            <div className="course-detail-page">
                {/* Header */}
                <div className="course-detail-header">
                    <div className="container">
                        <Link to="/courses" style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <ArrowLeft size={20} /> Back to Courses
                        </Link>
                        <span style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>
                            {course.mode}
                        </span>
                        <h1 className="course-detail-title">{course.title}</h1>
                        <p style={{ fontSize: '1.25rem', maxWidth: '800px', opacity: 0.9 }}>{course.overview}</p>
                    </div>
                </div>

                <div className="container section course-detail-layout">

                    {/* Main Content */}
                    <div className="course-content">
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', color: 'var(--color-text)' }}>
                                Course Description
                            </h2>
                            <p style={{ color: 'var(--color-text-light)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                                This course is designed for {course.audience}. Whether you are looking to upskill or switch careers, you will find practical value here.
                            </p>
                        </div>

                        {course.outcomes && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', color: 'var(--color-text)' }}>
                                    What You Will Learn
                                </h2>
                                <ul style={{ display: 'grid', gap: '1rem' }}>
                                    {Array.isArray(course.outcomes) ? course.outcomes.map((outcome, index) => (
                                        <li key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                            <CheckCircle size={20} color="var(--color-success)" style={{ marginTop: '4px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>{outcome}</span>
                                        </li>
                                    )) : (
                                        <li>Outcomes data format mismatch</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {course.instructor && (
                            <div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', color: 'var(--color-text)' }}>
                                    Meet Your Instructor
                                </h2>
                                <div className="course-instructor-card">
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        background: 'var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {course.instructor.photo ? (
                                            <img
                                                src={getStrapiMedia(course.instructor.photo.url)}
                                                alt={course.instructor.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <User size={40} color="var(--color-text-light)" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '700', color: 'var(--color-text)' }}>{course.instructor.name}</h3>
                                        <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>{course.instructor.role}</div>
                                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>{course.instructor.bio}</p>

                                        {/* Social Icons for Instructor */}
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            {course.instructor.linkedin && (
                                                <a href={course.instructor.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>
                                                    <Linkedin size={18} />
                                                </a>
                                            )}
                                            {course.instructor.facebook && (
                                                <a href={course.instructor.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }}>
                                                    <Facebook size={18} />
                                                </a>
                                            )}
                                            {course.instructor.website && (
                                                <a href={course.instructor.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-light)' }}>
                                                    <Globe size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--color-text)' }}>Share this Course</h3>
                            <ShareButtons
                                url={window.location.href}
                                title={course.title}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="course-sidebar">
                        <div className="course-sidebar-sticky">
                            {/* Sidebar Image */}
                            <div style={{
                                height: '200px',
                                background: 'var(--color-bg-alt)',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {course.cover ? (
                                    <img
                                        src={getStrapiMedia(course.cover.url)}
                                        alt={course.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
                                        <Layers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <div>Course Preview</div>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--color-text)' }}>Course Details</h3>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <Clock size={20} className="text-muted-foreground" style={{ marginTop: '2px', color: 'var(--color-text-light)' }} />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>Duration</div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{course.duration}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <Globe size={20} className="text-muted-foreground" style={{ marginTop: '2px', color: 'var(--color-text-light)' }} />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>Format</div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{course.mode}</div>
                                    </div>
                                </div>

                                {course.schedule && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <Calendar size={20} className="text-muted-foreground" style={{ marginTop: '2px', color: 'var(--color-text-light)' }} />
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>Class Schedule</div>
                                            <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{course.schedule}</div>
                                        </div>
                                    </div>
                                )}

                                {course.tools && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <Layers size={20} className="text-muted-foreground" style={{ marginTop: '2px', color: 'var(--color-text-light)' }} />
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>Tools Used</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                                {Array.isArray(course.tools) && course.tools.map((tool, idx) => (
                                                    <span key={idx} style={{
                                                        background: 'var(--color-bg-alt)',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-text)',
                                                        fontWeight: '500'
                                                    }}>
                                                        {typeof tool === 'string' ? tool : tool.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-text)' }}>{course.price || 'Free'}</h2>
                                </div>

                                <Link to={`/register?course=${encodeURIComponent(course.title)}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                                    Register for Course
                                </Link>
                                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                                    Limited seats available for next cohort.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </>
    );
};
export default CourseDetail;
