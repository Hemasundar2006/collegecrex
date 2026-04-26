import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-primary-950 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4">CollegeCrex</h3>
                        <p className="text-primary-300 text-sm leading-relaxed">
                            Empowering students to find their dream colleges through data-driven predictions and insights.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-primary-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Rank Predictors</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Counseling Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-primary-900 flex items-center justify-center rounded-lg hover:bg-primary-800 cursor-pointer transition-colors">
                                <span className="text-xs">FB</span>
                            </div>
                            <div className="w-10 h-10 bg-primary-900 flex items-center justify-center rounded-lg hover:bg-primary-800 cursor-pointer transition-colors">
                                <span className="text-xs">TW</span>
                            </div>
                            <div className="w-10 h-10 bg-primary-900 flex items-center justify-center rounded-lg hover:bg-primary-800 cursor-pointer transition-colors">
                                <span className="text-xs">IG</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-primary-900 mt-12 pt-8 text-center text-primary-500 text-xs">
                    © {new Date().getFullYear()} CollegeCrex. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
