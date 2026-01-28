import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import { ChevronRight } from 'lucide-react';

const PolicyPage = () => {
    const { type } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
            try {
                setLoading(true);
                // The backend returns all policies as an object, keyed by type
                const res = await api.get(`/policies`, { params: { website_id: websiteId } });
                if (res.data && res.data[type]) {
                    setPolicy(res.data[type]);
                } else {
                    setPolicy(null); // Not found
                }
            } catch (error) {
                console.error(`Failed to fetch policy: ${type}`, error);
                setPolicy(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
        window.scrollTo(0, 0);
    }, [type]);

    const pageTitle = policy?.meta_title || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center italic text-gray-400">Loading Page...</div>;
    }

    if (!policy) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                <p className="text-gray-500">The page you are looking for does not exist or could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <SEO 
                pageName={`policy_${type}`}
                fallbackTitle={pageTitle}
                fallbackDesc={policy.meta_description}
            />

            {/* Header and Breadcrumb */}
            <div className="bg-gray-50 pt-10 pb-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
                        <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-bold">{pageTitle}</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                </div>
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-4 py-16 overflow-hidden">
                <div 
                    className="policy-content w-full overflow-x-hidden" 
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                />
            </div>
        </div>
    );
};

export default PolicyPage;
