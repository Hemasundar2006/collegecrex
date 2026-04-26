import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary-600 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary-200">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-primary-900 tracking-tight italic">CollegeCrex</span>
                    </Link>
                    <div className="hidden md:flex gap-8 items-center text-sm font-medium text-primary-700">
                        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                        <Link to="/polycet" className="hover:text-primary-600 transition-colors">AP POLYCET</Link>
                        <Link to="/dream-college" className="hover:text-primary-600 transition-colors font-bold text-primary-600">Dream College</Link>
                        <Link to="/eamcet" className="hover:text-primary-600 transition-colors">AP EAMCET</Link>
                        <Link to="/ecet" className="hover:text-primary-600 transition-colors">AP ECET</Link>
                        <button className="bg-primary-600 text-white px-5 py-2 rounded-full font-semibold shadow-3d hover:bg-primary-700 transition-all active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
