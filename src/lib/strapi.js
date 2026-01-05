export const STRAPI_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337')
    .replace(/\/admin\/?$/, "") // Remove /admin or /admin/ if user pasted full admin URL
    .replace(/\/$/, "");        // Remove trailing slash if present

/* -----------------------------------------
   Helper: Build query string for Strapi v4
----------------------------------------- */
function buildQuery(params, searchParams = new URLSearchParams(), prefix = '') {
    Object.entries(params || {}).forEach(([key, value]) => {
        const paramKey = prefix ? `${prefix}[${key}]` : key;

        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(paramKey, v));
        } else if (typeof value === 'object') {
            buildQuery(value, searchParams, paramKey);
        } else {
            searchParams.append(paramKey, value);
        }
    });

    return searchParams;
}

/* -----------------------------------------
   Fetch from Strapi
----------------------------------------- */
export async function fetchFromStrapi(endpoint, params = {}) {
    const url = new URL(`${STRAPI_URL}/api${endpoint}`);
    buildQuery(params, url.searchParams);

    try {
        const res = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Strapi error ${res.status}: ${text}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Strapi fetch error:', error);
        throw error; // IMPORTANT: do NOT return null
    }
}

/* -----------------------------------------
   Unwrap Strapi v4 response
----------------------------------------- */
export function unwrapStrapiResponse(response) {
    if (!response || !response.data) return [];

    if (Array.isArray(response.data)) {
        return response.data.map((item) => {
            if (item.attributes) {
                return {
                    id: item.id,
                    ...item.attributes,
                };
            }
            return item;
        });
    }

    if (response.data.attributes) {
        return {
            id: response.data.id,
            ...response.data.attributes,
        };
    }

    return response.data;
}

/* -----------------------------------------
   Media URL helper
----------------------------------------- */
/* -----------------------------------------
   Media URL helper
----------------------------------------- */
export function getStrapiMedia(media) {
    if (!media) return null;

    // Handle string (already a URL)
    if (typeof media === 'string') {
        return media.startsWith('http') ? media : `${STRAPI_URL}${media}`;
    }

    // Handle object (Strapi media response)
    if (!media.url) return null;

    const url = media.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}
