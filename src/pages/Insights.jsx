import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

const Insights = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadArticles() {
            try {
                const data = await fetchFromStrapi('/articles', {
                    populate: '*',
                    'sort[0]': 'publish_date:desc'
                });
                setArticles(unwrapStrapiResponse(data));
            } catch (err) {
                console.error("Failed to load articles", err);
            } finally {
                setLoading(false);
            }
        }
        loadArticles();
    }, []);

    return (
        <>
            <Helmet>
                <title>Khadimy | Insights</title>
                <meta name="description" content="Read the latest articles on technology, career development, and industry trends." />
            </Helmet>

            <div className="insights-page" style={{ padding: '3rem 0', background: 'var(--color-bg-alt)' }}>
                <div className="container" style={{ marginBottom: '3rem' }}>
                    <h1 className="section-title" style={{ textAlign: 'left' }}>Insights & Articles</h1>
                    <p style={{ maxWidth: '600px', color: '#666' }}>
                        Stay updated with the latest trends in tech, education, and career growth.
                    </p>
                </div>

                <div className="container">
                    {loading ? (
                        <p>Loading insights...</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {articles.map(article => {
                                const imageUrl = article.cover ? getStrapiMedia(article.cover.url) : 'https://placehold.co/300x200';

                                return (
                                    <article key={article.id} className="article-card">
                                        <Link to={`/insights/${article.slug}`}>
                                            <img src={imageUrl} alt={article.title} className="article-image" />
                                        </Link>
                                        <div className="article-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>

                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <span className="tag-pill" style={{
                                                    background: 'var(--color-primary-light)',
                                                    color: 'var(--color-primary)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {article.category || 'Article'}
                                                </span>
                                            </div>

                                            <h3 className="article-title" style={{ marginBottom: '0.75rem' }}>
                                                <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                                            </h3>

                                            <p className="article-excerpt" style={{ flexGrow: 1, marginBottom: '1.5rem', color: '#666' }}>
                                                {article.excerpt || "Read more about this topic..."}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Insights;
