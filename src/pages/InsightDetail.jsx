import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import NotFound from './NotFound';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

const InsightDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadArticle() {
            try {
                const data = await fetchFromStrapi('/articles', {
                    populate: '*',
                    'filters[slug][$eq]': slug
                });
                const articles = unwrapStrapiResponse(data);
                if (articles && articles.length > 0) {
                    setArticle(articles[0]);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to load article", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (slug) {
            loadArticle();
        }
    }, [slug]);

    if (loading) {
        return <div className="section"><div className="container">Loading article...</div></div>;
    }

    if (error || !article) {
        return <NotFound />;
    }

    const imageUrl = article.cover ? getStrapiMedia(article.cover.url) : null;

    return (
        <>
            <Helmet>
                <title>Khadimy | {article.title}</title>
                <meta name="description" content={article.excerpt || article.title} />
            </Helmet>

            <article className="insight-detail-page">
                {/* Header/Hero */}
                <div style={{ background: 'var(--color-bg-alt)', padding: '4rem 0' }}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <Link to="/insights" style={{ color: '#666', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <ArrowLeft size={20} /> Back to Insights
                        </Link>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                                <Tag size={16} /> {article.category}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                                <Calendar size={16} /> {article.publish_date}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
                            {article.title}
                        </h1>

                        <p style={{ fontSize: '1.25rem', color: '#555', lineHeight: '1.6' }}>
                            {article.excerpt}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="section" style={{ padding: '3rem 0' }}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={article.title}
                                style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', boxShadow: 'var(--shadow-md)' }}
                            />
                        )}

                        <div className="article-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
                            {/* Rendering content. Strapi often sends markdown or blocks. 
                            For this MVP, assuming it's rich text (markdown) or just text.
                            In a real app, use a markdown renderer (e.g. react-markdown).
                            Here, simply analyzing structure. If it's pure text, render it.
                        */}
                            {article.content}
                        </div>

                        {article.external_link && (
                            <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8f9fa', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Read Original Source</h3>
                                <a href={article.external_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                                    Visit External Link &rarr;
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
};

export default InsightDetail;
