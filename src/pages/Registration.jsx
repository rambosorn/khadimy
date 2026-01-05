import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { STRAPI_URL, fetchFromStrapi, unwrapStrapiResponse } from '../lib/strapi';

const Registration = () => {
    const [searchParams] = useSearchParams();
    const courseParam = searchParams.get('course');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: courseParam || '',
        background: '',
    });

    const [availableCourses, setAvailableCourses] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch Active Courses for Dropdown
    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await fetchFromStrapi('/courses', {
                    fields: ['title', 'mode'], // Optimize fetch
                    sort: ['title:asc'],
                    pagination: { limit: 100 }
                });
                const parsed = unwrapStrapiResponse(data);
                setAvailableCourses(parsed || []);

                // If the param exists but not in list (edge case), keep it selected anyway
            } catch (err) {
                console.error("Failed to load courses for dropdown", err);
            }
        }
        loadCourses();
    }, []);

    // Update form if URL param changes (optional, but good practice)
    useEffect(() => {
        if (courseParam) {
            setFormData(prev => ({ ...prev, interest: courseParam }));
        }
    }, [courseParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const res = await fetch(`${STRAPI_URL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: formData }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || 'Failed to submit registration');
            }

            setStatus('success');
        } catch (error) {
            console.error('Registration failed:', error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again later or contact us directly on Telegram.');
        }
    };

    if (status === 'success') {
        return (
            <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h1 style={{ marginBottom: '1rem' }}>Thank You for Registering!</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666', fontSize: '1.2rem' }}>
                    We have received your details. Our team will contact you shortly via email with the next steps and payment instructions.
                </p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return Home</a>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Khadimy | Register</title>
                <meta name="description" content="Register for a course." />
            </Helmet>

            <div className="registration-page" style={{ padding: '3rem 0', background: 'var(--color-bg-alt)' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                        <h1 className="section-title" style={{ textAlign: 'center', fontSize: '1.8rem' }}>Join a Course</h1>
                        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                            Fill out the form below to secure your spot.
                        </p>

                        {status === 'error' && (
                            <div style={{ background: '#nm4d4d', color: '#721c24', background: '#f8d7da', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center' }}>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={status === 'submitting'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={status === 'submitting'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number (Telegram)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={status === 'submitting'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Which course are you interested in?</label>
                                <select
                                    name="interest"
                                    required
                                    value={formData.interest}
                                    onChange={handleChange}
                                    disabled={status === 'submitting'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                >
                                    <option value="">Select a course</option>
                                    {availableCourses.map(c => (
                                        <option key={c.id} value={c.title}>{c.title} {c.mode ? `(${c.mode})` : ''}</option>
                                    ))}
                                    <option value="other">General Inquiry / Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Background (Student/Employee?)</label>
                                <textarea
                                    name="background"
                                    rows="3"
                                    value={formData.background}
                                    onChange={handleChange}
                                    disabled={status === 'submitting'}
                                    placeholder="e.g. 3rd year CS student at RUPP..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={status === 'submitting'}
                                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: status === 'submitting' ? 0.7 : 1 }}
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Registration;
