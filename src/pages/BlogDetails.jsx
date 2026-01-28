import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';

const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blogs/${slug}`);
                setBlog(res.data);
            } catch (error) {
                console.error("Failed to fetch article");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Loading Article...</div>;
    if (!blog) return <div className="min-h-screen flex items-center justify-center text-red-500">Article not found.</div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO 
                pageName={`blog_${blog.id}`}
                fallbackTitle={`${blog.meta_title || blog.title} | Tech Insights`}
                fallbackDesc={blog.meta_description || blog.description}
            />
            <SchemaMarkup type="blog" data={blog} />

            {/* Header Image */}
            <div className="h-[400px] md:h-[500px] w-full relative overflow-hidden">
                <img 
                    src={blog.image_url || "https://via.placeholder.com/1200x600?text=Tech+Insight"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white">
                    <div className="container mx-auto">
                        <Link to="/" className="inline-flex items-center gap-2 text-teal-400 font-bold mb-6 hover:text-teal-300 transition-colors">
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">{blog.title}</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content */}
                    <div className="flex-1 bg-white p-8 md:p-16 rounded-[40px] shadow-2xl shadow-gray-200/50">
                        <div className="flex flex-wrap items-center gap-6 mb-10 text-gray-400 font-bold text-xs uppercase tracking-widest border-b border-gray-50 pb-8">
                            <div className="flex items-center gap-2"><Calendar size={16} className="text-teal-500" /> {new Date(blog.created_at).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><User size={16} className="text-teal-500" /> {blog.author}</div>
                            <div className="flex items-center gap-2"><Clock size={16} className="text-teal-500" /> 5 Min Read</div>
                            <button className="ml-auto flex items-center gap-2 hover:text-teal-600 transition-colors"><Share2 size={16} /> Share</button>
                        </div>

                        {/* Article Body */}
                        <div 
                            className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="bg-teal-900 p-8 rounded-[32px] text-white overflow-hidden relative">
                            <h3 className="text-xl font-bold mb-4 relative z-10">Join our Newsletter</h3>
                            <p className="text-teal-100 text-sm mb-6 relative z-10">Get the latest tech insights delivered directly to your inbox.</p>
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="w-full bg-white/10 border border-white/20 p-3 rounded-xl mb-3 text-white focus:outline-none"
                            />
                            <button className="w-full bg-white text-teal-900 font-bold py-3 rounded-xl hover:bg-teal-50 transition-all">Subscribe Now</button>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Recommended</h3>
                            <div className="space-y-6">
                                <p className="text-gray-400 text-sm italic">More articles coming soon...</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
