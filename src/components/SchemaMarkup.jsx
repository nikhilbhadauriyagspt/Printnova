import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ type, data }) => {
    let schemas = [];
    const domain = window.location.origin;

    if (type === 'product') {
        // Product Schema
        schemas.push({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": data.name,
            "image": data.image_url ? (data.image_url.startsWith('http') ? data.image_url : `${domain}/products/${data.image_url}`) : '',
            "description": data.description,
            "sku": `PN-${data.id}`,
            "brand": {
                "@type": "Brand",
                "name": "PrintNova"
            },
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "USD",
                "price": data.price,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": data.rating || 4.5,
                "reviewCount": data.review_count || 1
            }
        });

        // Breadcrumb Schema
        schemas.push({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": domain
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Shop",
                    "item": `${domain}/products`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": data.name,
                    "item": window.location.href
                }
            ]
        });
    } else if (type === 'blog') {
        schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.title,
            "image": data.image_url,
            "author": {
                "@type": "Person",
                "name": data.author || "Admin"
            },
            "publisher": {
                "@type": "Organization",
                "name": "PrintNova",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${domain}/logo.png`
                }
            },
            "datePublished": data.created_at
        };
    }

    if (schemas.length === 0) return null;

    return (
        <Helmet>
            {schemas.map((s, idx) => (
                <script key={idx} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

export default SchemaMarkup;
