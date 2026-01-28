import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SEO from '../components/SEO';
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                // Fetch FAQs for default website_id 1
                const res = await api.get('/faqs', { params: { website_id: import.meta.env.VITE_WEBSITE_ID } });
                setFaqs(res.data);
            } catch (error) {
                console.error("Failed to fetch FAQs");
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <SEO 
                pageName="faq" 
                fallbackTitle="Frequently Asked Questions - Support" 
                fallbackDesc="Find answers to common questions about our products and services." 
            />
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-gray-500 text-lg max-w-lg mx-auto">Everything you need to know about our printers, orders, and support.</p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400 font-bold italic">Loading help content...</div>
                    ) : faqs.length > 0 ? (
                        faqs.map((faq, index) => (
                            <div key={faq.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-800 text-lg pr-8">{faq.question}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50 mt-4 mx-6 py-6">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">No FAQs available at the moment.</p>
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="mt-20 bg-teal-900 rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-teal-900 bg-teal-700 flex items-center justify-center font-bold text-xs uppercase">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
                        <p className="text-teal-300 mb-8 max-w-sm mx-auto text-sm">If you can't find what you're looking for, our friendly team is here to help you.</p>
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-teal-900 px-8 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-all">
                            Contact Support <ArrowRight size={18} />
                        </Link>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
