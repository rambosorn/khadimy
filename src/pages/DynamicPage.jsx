import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchFromStrapi, unwrapStrapiResponse } from '../lib/strapi';
import ReactMarkdown from 'react-markdown';
import NotFound from './NotFound';

const DynamicPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadPage() {
            setLoading(true);
            try {
                const data = await fetchFromStrapi('/pages', {
                    'filters[slug][$eq]': slug
                });
                const result = unwrapStrapiResponse(data);
                if (result && result.length > 0) {
                    setPage(result[0]);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to load page", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            loadPage();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="section" style={{ minHeight: '60vh' }}>
                <div className="container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return <NotFound />;
    }

    return (
        <>
            <Helmet>
                <title>{page.seo_title || page.title} | Khadimy</title>
                <meta name="description" content={page.seo_description || `Page about ${page.title}`} />
            </Helmet>

            <div className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--color-dark)' }}>
                        {page.title}
                    </h1>

                    {/* Render Content - handling basic markdown/text structure */}
                    <div className="page-content" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        {/* 
                            Note: Strapi Rich Text is Markdown. 
                            For MVP, we just display it. Use react-markdown for full rendering in future.
                         */}
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '1.5rem' }} {...props} />,
                                h2: ({ node, ...props }) => <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', marginTop: '1.25rem' }} {...props} />,
                                p: ({ node, ...props }) => <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }} {...props} />,
                                ul: ({ node, ...props }) => <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyle: 'disc' }} {...props} />,
                                li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />
                            }}
                        >
                            {page.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DynamicPage;
