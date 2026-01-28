import React from 'react';
import SEO from '../components/SEO';
import { Target, Users, Zap, Award, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO 
        pageName="about" 
        fallbackTitle="About Us | PrintNova Story" 
        fallbackDesc="Learn about our journey in the printing industry." 
      />
      {/* --- Vision Hero --- */}
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 inline-block italic">Our Vision</span>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Redefining the Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 font-black">Digital Printing.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed font-light">
            Founded in 2015, MyStore has grown from a small specialized workshop to a national leader in high-performance printing solutions for businesses and homes.
          </p>
        </div>
      </section>

      {/* --- Stats Strip --- */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[40px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem val="10k+" label="Printers Sold" />
          <StatItem val="98%" label="Happy Clients" />
          <StatItem val="24/7" label="Support Ready" />
          <StatItem val="15+" label="Global Brands" />
        </div>
      </section>

      {/* --- Core Values --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Why we do <br/> what we do.</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                We believe that every great idea deserves to be seen in its best light. Our mission is to provide accessible, high-quality printing tech that bridges the gap between digital vision and physical reality.
              </p>
              
              <div className="space-y-6">
                <ValueItem icon={<Zap className="text-teal-600" />} title="Innovation First" desc="We constantly update our inventory with the latest laser and 3D tech." />
                <ValueItem icon={<Award className="text-teal-600" />} title="Quality Guaranteed" desc="Every product undergoes rigorous testing before it reaches you." />
                <ValueItem icon={<Users className="text-teal-600" />} title="Customer Centric" desc="Your satisfaction is the only metric that matters to us." />
              </div>
            </div>
            
            <div className="flex-1 relative">
               <div className="absolute -inset-4 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
               <img 
                src="/about-us.jpg" 
                alt="About" 
                className="relative z-10 rounded-[40px] border border-gray-100 shadow-sm" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* --- The Promise --- */}
      <section className="bg-gray-950 py-24 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#115e59_0%,_transparent_70%)] opacity-20"></div>
         <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
            <h2 className="text-4xl font-bold mb-8 italic">"We don't just sell hardware; we enable your creativity to take physical form."</h2>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-px bg-teal-500"></div>
               <p className="text-teal-400 font-bold uppercase tracking-widest text-xs">Our Leadership Team</p>
               <div className="w-12 h-px bg-teal-500"></div>
            </div>
         </div>
      </section>

      {/* --- Join Us CTA --- */}
      <section className="py-24 container mx-auto px-4 text-center">
         <div className="bg-teal-50 rounded-[50px] p-12 md:p-24 border border-teal-100">
            <h2 className="text-4xl font-bold text-teal-900 mb-6 font-serif">Want to learn more?</h2>
            <p className="text-teal-700/70 mb-10 max-w-lg mx-auto">Subscribe to our newsletter or follow our social channels to stay updated with our latest technology launches.</p>
            <div className="flex justify-center gap-4">
               <button className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">Visit Our Shop</button>
               <button className="bg-white text-teal-900 border border-teal-200 px-10 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-all">Contact Us</button>
            </div>
         </div>
      </section>

    </div>
  );
};

const StatItem = ({ val, label }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{val}</p>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

const ValueItem = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AboutUs;
