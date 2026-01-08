import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await fetchFromStrapi('/courses', {
                    populate: ['cover', 'instructor', 'instructor.photo'],
                    sort: ['createdAt:desc'],
                });

                const parsed = unwrapStrapiResponse(data);
                setCourses(parsed || []);
            } catch (err) {
                console.error('Failed to load courses', err);
            } finally {
                setLoading(false);
            }
        }

        loadCourses();
    }, []);

    /* ---------- SAFE SEARCH FILTER ---------- */
    const filteredCourses = courses.filter((course) => {
        const title = course?.title || '';
        const mode = course?.mode || '';
        const term = searchTerm.toLowerCase();

        return (
            title.toLowerCase().includes(term) ||
            mode.toLowerCase().includes(term)
        );
    });

    return (
        <>
            <Helmet>
                <title>Khadimy | All Courses</title>
                <meta
                    name="description"
                    content="Browse our practical, industry-oriented courses."
                />
            </Helmet>

            <div
                className="courses-page"
                style={{ padding: '3rem 0', background: 'var(--color-bg-alt)' }}
            >
                {/* ---------- HEADER ---------- */}
                <div className="container" style={{ marginBottom: '3rem' }}>
                    <h1 className="section-title" style={{ textAlign: 'left' }}>
                        All Courses
                    </h1>
                    <p style={{ maxWidth: '600px', color: '#666' }}>
                        Explore our curriculum designed to get you hired. From web
                        development to data analytics.
                    </p>
                </div>

                {/* ---------- SEARCH ---------- */}
                <div className="container">
                    <div style={{ display: 'flex', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                }}
                            />
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#999',
                                }}
                            />
                        </div>
                    </div>

                    {/* ---------- CONTENT ---------- */}
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : filteredCourses.length === 0 ? (
                        <p>No courses found.</p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '2rem',
                            }}
                        >
                            {filteredCourses.map((course) => {
                                const imageUrl = course.cover ? getStrapiMedia(course.cover) : 'https://placehold.co/350x200';

                                return (
                                    <div key={course.id} className="course-card">
                                        <Link to={`/courses/${course.slug || course.id}`}>
                                            <div className="course-image-container">
                                                <img src={imageUrl} alt={course.title} className="course-image" />
                                                <span className="course-badge">{course.price || 'Free'}</span>
                                            </div>
                                        </Link>

                                        <div className="course-content">
                                            <div className="course-provider" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                                {course.instructor?.photo ? (
                                                    <img
                                                        src={getStrapiMedia(course.instructor.photo)}
                                                        alt={course.instructor.name}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Briefcase size={20} color="#888" />
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)' }}>
                                                        {course.instructor?.name || 'Khadimy Instructor'}
                                                    </span>
                                                    {course.instructor?.role && (
                                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                                            {course.instructor.role}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="course-title">
                                                <Link to={`/courses/${course.slug || course.id}`}>
                                                    {course.title || 'Untitled Course'}
                                                </Link>
                                            </h3>

                                            <div className="course-subtitle" style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                {(course.overview || '').length > 80
                                                    ? (course.overview || '').substring(0, 80) + '...'
                                                    : (course.overview || 'No description available')}
                                            </div>
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

export default Courses;
