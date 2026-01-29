import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Tag, Clock, Star, Search, MapPin, ScanLine, Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('Buy Products');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const slides = [
    "/banner/banner-1.jpg",
    "/banner/banner-2.jpg",
    "/banner/banner-3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (activeTab === 'Track Order') {
      navigate(`/orders?id=${searchQuery.trim()}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white pb-10 pt-6">
      <div className="container mx-auto px-4">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[550px]">

          {/* --- MAIN HERO BLOCK (Slider + Search) --- */}
          <div className="md:col-span-8 bg-gray-900 rounded-2xl relative overflow-hidden group flex flex-col justify-center">

            {/* Background Slider */}
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-60' : 'opacity-0'
                  }`}
              />
            ))}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

            {/* Static Content with Search */}
            <div className="relative z-10 px-8 md:px-16 md:pl-0 w-full max-w-4xl mx-auto text-center md:text-left">

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Find the Perfect <br />
                <span className="text-teal-400">Printing Solution</span>
              </h1>

              <p className="text-gray-300 mb-8 text-lg font-light max-w-xl mx-auto md:mx-0">
                Browse our extensive collection of high-performance printers, scanners, and accessories designed for your business needs.
              </p>

              {/* --- ADVANCED SEARCH PANEL --- */}
              <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl max-w-2xl mx-auto md:mx-0 animate-fade-in-up">

                {/* 1. Search Tabs */}
                <div className="flex gap-4 mb-3 border-b border-white/10 pb-2">
                  {['Buy Products', 'Track Order', 'Find Ink'].map((tab) => (
                    <button
                      key={tab}
                      className={`text-xs font-semibold uppercase tracking-wide pb-1 transition-all ${activeTab === tab
                        ? 'text-teal-400 border-b-2 border-teal-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 2. Input Area */}
                <form onSubmit={handleSearch} className="flex items-center bg-gray-900/60 rounded-xl border border-white/10 p-1">

                  {/* Icon based on Tab */}
                  <div className="pl-4 text-teal-400">
                    {activeTab === 'Track Order' ? <MapPin className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === 'Track Order' ? "Enter Order ID (e.g. #ORD-2026)..." :
                        activeTab === 'Find Ink' ? "Enter Printer Model Number..." :
                          "Search for printers, scanners..."
                    }
                    className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-gray-500 font-medium"
                  />

                  {/* Camera/Scan Icon (Visual Only) */}
                  <button type="button" className="hidden sm:flex p-2 text-gray-400 hover:text-white transition-colors" title="Search by Image">
                    <ScanLine className="w-5 h-5" />
                  </button>

                  {/* Search Button */}
                  <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 ml-1">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Quick Tags */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="text-gray-400 text-sm">Popular:</span>
                <button onClick={() => navigate('/products?search=Wireless')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors backdrop-blur-sm">Wireless</button>
                <button onClick={() => navigate('/products?search=LaserJet')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors backdrop-blur-sm">LaserJet</button>
                <button onClick={() => navigate('/products?search=EcoTank')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors backdrop-blur-sm">EcoTank</button>
              </div>

            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-teal-500' : 'w-2 bg-white/30'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* --- SIDE COLUMN (Fixed Static Content) --- */}
          <div className="md:col-span-4 flex flex-col gap-4 h-full">

            {/* Top Side Card */}
            <Link to="/products?category=printer-accessories" className="flex-1 bg-teal-50 rounded-2xl relative overflow-hidden group cursor-pointer border border-teal-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="relative z-10 max-w-[60%]">
                <p className="text-teal-600 font-bold text-sm mb-1 uppercase">Essentials</p>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Original Inks</h3>
                <p className="text-sm text-gray-500 mb-4">High yield & smudge free.</p>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1">Shop Now <ArrowRight className="w-3 h-3" /></span>
              </div>
              <img
                src="https://placehold.co/300x300/f0fdfa/14b8a6?text=Ink+Set"
                alt="Ink"
                className="absolute right-[-20px] bottom-[-20px] w-40 h-40 object-contain rotate-12 group-hover:scale-110 transition-transform duration-500"
              />
            </Link>

            {/* Bottom Side Card */}
            <Link to="/products?search=Scanner" className="flex-1 bg-orange-50 rounded-2xl relative overflow-hidden group cursor-pointer border border-orange-100 p-6 hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                HOT
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Limited Offer</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Smart Scanners</h3>
                <p className="text-sm text-gray-500 mb-4">Digitize documents in seconds.</p>
                <button className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                  View Deals
                </button>
              </div>
            </Link>

          </div>
        </div>

        {/* --- FLOATING TRUST STRIP --- */}
        <div className="relative mt-10 z-20">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-full p-2 md:p-3 flex flex-wrap md:flex-nowrap items-center justify-around divide-y md:divide-y-0 md:divide-x divide-gray-100">

            <TrustItem
              icon={<Truck className="w-5 h-5 text-teal-500" />}
              title="Free Shipping"
              desc="On orders over $150"
            />
            <TrustItem
              icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
              title="2-Year Warranty"
              desc="Full device coverage"
            />
            <TrustItem
              icon={<Headphones className="w-5 h-5 text-purple-500" />}
              title="Expert Support"
              desc="24/7 Technical help"
            />
            <TrustItem
              icon={<CreditCard className="w-5 h-5 text-orange-500" />}
              title="Secure Payment"
              desc="100% Protected"
            />

          </div>
        </div>

      </div>
    </div>
  );
};

const TrustItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 px-8 py-4 md:py-2 group cursor-default w-full md:w-auto">
    <div className="bg-gray-50 p-3 rounded-full group-hover:bg-teal-50 group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{title}</span>
      <span className="text-[11px] text-gray-400 font-medium">{desc}</span>
    </div>
  </div>
);

export default Hero;
