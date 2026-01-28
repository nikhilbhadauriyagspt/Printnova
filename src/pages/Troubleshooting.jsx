import React from 'react';
import SEO from '../components/SEO';
import { HelpCircle, AlertTriangle, Printer, Wifi, Zap, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Troubleshooting = () => {
    const guides = [
        {
            title: "Connectivity Issues",
            icon: <Wifi className="text-blue-500" />,
            steps: [
                "Ensure the printer is turned on and connected to the same Wi-Fi network as your device.",
                "Restart your router and wait for 2 minutes.",
                "Check if the printer's IP address matches the one in your computer settings.",
                "Try connecting via USB cable to rule out wireless issues."
            ]
        },
        {
            title: "Print Quality Problems",
            icon: <Printer className="text-teal-500" />,
            steps: [
                "Run a nozzle check or print head cleaning from the maintenance menu.",
                "Ensure you are using genuine ink or toner cartridges.",
                "Check paper alignment and ensure the paper type settings match the loaded media.",
                "Wipe the scanner glass if you notice lines on scanned documents."
            ]
        },
        {
            title: "Paper Jams",
            icon: <AlertTriangle className="text-orange-500" />,
            steps: [
                "Turn off the printer before attempting to remove jammed paper.",
                "Gently pull the paper out in the direction of the paper path.",
                "Check for small scraps of paper left inside the rollers.",
                "Clean the paper feed rollers with a lint-free cloth."
            ]
        },
        {
            title: "Power & Startup",
            icon: <Zap className="text-yellow-500" />,
            steps: [
                "Check the power cable connections on both ends.",
                "Try a different wall outlet to ensure power supply.",
                "Hold the power button for 15 seconds to perform a hard reset.",
                "Look for error lights and check their meaning in the user manual."
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO 
                pageName="troubleshooting" 
                fallbackTitle="Troubleshooting Guide - Support" 
                fallbackDesc="Step-by-step guides to fix common printer issues like connectivity, quality, and jams." 
            />

            {/* Header */}
            <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl font-black mb-6 tracking-tight">Troubleshooting <span className="text-teal-400">Center</span></h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">Quick solutions for common printer problems. Follow these steps before contacting support.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {guides.map((guide, idx) => (
                        <div key={idx} className="bg-white rounded-[40px] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 hover:border-teal-200 transition-all group">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                {guide.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{guide.title}</h2>
                            <ul className="space-y-4">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-500">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></div>
                                        <span className="text-sm font-medium leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Reset Guide */}
                <div className="mt-20 bg-teal-50 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-teal-600 font-bold uppercase tracking-widest text-xs mb-4">
                            <RefreshCw size={16} /> Hard Reset
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">The Universal Fix</h2>
                        <p className="text-gray-600 leading-relaxed">Most temporary software glitches can be fixed with a hard reset. Unplug the printer, wait for 60 seconds, press and hold the power button for 15 seconds while unplugged, then plug it back in and restart.</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl">
                            Still Not Working? Contact Us <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Troubleshooting;
