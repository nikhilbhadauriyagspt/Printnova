import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/api';

const SEO = ({ pageName, fallbackTitle, fallbackDesc, image, type = 'website' }) => {
    const [seo, setSeo] = useState(null);
    const [favicon, setFavicon] = useState('/vite.svg');
    const domain = window.location.origin;
    const currentUrl = window.location.href;

    useEffect(() => {
        let isMounted = true;
        
        const fetchSEO = async () => {
            const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
            try {
                // Fetch separately to avoid one failing the other
                api.get(`/seo/${pageName}`, { params: { website_id: websiteId } }).then(res => {
                    if (isMounted && res.data) {
                        setSeo(res.data);
                        if (res.data.meta_title) document.title = res.data.meta_title;
                    }
                }).catch(err => console.error("SEO Load Error:", err));

                api.get(`/websites/${websiteId}`).then(res => {
                    if (isMounted && res.data?.favicon_url) {
                        setFavicon(res.data.favicon_url);
                    }
                }).catch(err => console.error("Branding Load Error:", err));

            } catch (error) {
                if (isMounted) {
                    setSeo({
                        meta_title: fallbackTitle,
                        meta_description: fallbackDesc,
                        meta_keywords: ''
                    });
                    if (fallbackTitle) document.title = fallbackTitle;
                }
            }
        };

        fetchSEO();
        
        return () => { isMounted = false; };
    }, [pageName, fallbackTitle, fallbackDesc]);

    useEffect(() => {
        if (favicon) {
            const link = document.querySelector("link[rel~='icon']");
            if (link) {
                link.href = favicon;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = favicon;
                document.head.appendChild(newLink);
            }
        }
    }, [favicon]);

    const title = seo?.meta_title || fallbackTitle || 'PrintNova';
    const description = seo?.meta_description || fallbackDesc || '';
    const metaImage = image || `${domain}/logo.png`;

    return (
        <Helmet key={pageName + (seo ? '_loaded' : '_loading')}>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={seo?.meta_keywords || ''} />
            <link rel="canonical" href={currentUrl} />
            <link rel="icon" type="image/x-icon" href={favicon} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="PrintNova" />

            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
};

export default SEO;