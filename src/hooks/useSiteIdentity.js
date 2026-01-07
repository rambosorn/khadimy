import { useState, useEffect } from 'react';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';

export const useSiteIdentity = () => {
    const [identity, setIdentity] = useState({
        siteName: 'Khadimy',
        logoUrl: '/logo.png', // Default fallback
        faviconUrl: '/logo.png',
        altText: 'Khadimy Logo',
        loading: true
    });

    useEffect(() => {
        async function loadIdentity() {
            try {
                // Force fresh params to bypass cache
                const data = await fetchFromStrapi('/site-identity', {
                    populate: ['favicon', 'logo']
                });

                const result = unwrapStrapiResponse(data);

                if (result) {
                    setIdentity({
                        siteName: result.site_name || 'Khadimy',
                        logoUrl: result.logo ? getStrapiMedia(result.logo.url) : '/logo.png',
                        faviconUrl: result.favicon ? getStrapiMedia(result.favicon.url) : '/logo.png',
                        altText: result.alt_text || 'Khadimy Logo',
                        loading: false
                    });
                } else {
                    setIdentity(prev => ({ ...prev, loading: false }));
                }
            } catch (err) {
                console.error("Failed to load site identity", err);
                setIdentity(prev => ({ ...prev, loading: false }));
            }
        }

        loadIdentity();
    }, []);

    return identity;
};
