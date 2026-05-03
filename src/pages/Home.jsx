import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, BookOpen, Globe } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, to, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        viewport={{ once: true }}
        className="group relative"
    >
        <Link to={to}>
            <div className="relative p-8 rounded-2xl bg-white border border-primary-100 shadow-3d hover:shadow-3d-hover transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon size={80} className="text-primary-600" />
                </div>
                <div className="p-4 bg-primary-50 rounded-xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Icon className="text-primary-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-3">{title}</h3>
                <p className="text-primary-600 text-sm leading-relaxed mb-6">
                    {description}
                </p>
                <div className="mt-auto px-6 py-2 bg-primary-600 text-white rounded-full font-bold text-sm shadow-3d group-hover:bg-primary-700 transition-colors">
                    Check Now
                </div>
            </div>
        </Link>
    </motion.div>
);

const Home = () => {
    return (
        <div className="pt-24 min-h-screen gradient-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mb-8 shadow-sm">
                            <Sparkles size={16} />
                            <span>Revolutionizing Career Planning</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black text-primary-950 leading-[1.1] mb-6 italic tracking-tighter">
                            Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-400">Future College</span> Rank
                        </h1>
                        <p className="text-lg text-primary-700 leading-relaxed max-w-xl mb-10">
                            The most accurate rank predictor for AP POLYCET, EAMCET, and ECET. Built by students, for students. Get insights into your potential college placements today.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all">
                                Explored Features
                            </button>
                            <button className="px-8 py-4 bg-white text-primary-900 border-2 border-primary-100 rounded-2xl font-black text-lg hover:bg-primary-50 transition-all shadow-lg">
                                Watch Tutorial
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-tr from-primary-600 to-green-300 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-4 rounded-[2.5rem] border-4 border-white/20 z-10 flex items-center justify-center">
                                <motion.div 
                                    animate={{ 
                                        rotateY: [0, 10, -10, 0],
                                        rotateX: [0, -5, 5, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="p-12 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/30 text-white flex flex-col items-center"
                                >
                                    <Trophy size={100} className="mb-4 drop-shadow-2xl" />
                                    <span className="text-3xl font-black tracking-widest italic">PREMIUM INSIGHTS</span>
                                </motion.div>
                            </div>
                            {/* Decorative bubbles */}
                            <div className="absolute top-10 left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl animate-bounce"></div>
                        </div>
                        {/* Status Float Card */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }} 
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -bottom-10 -right-10 p-6 bg-white rounded-2xl shadow-3d-hover border border-primary-50 z-20 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Globe size={24} />
                            </div>
                            <div>
                                <div className="text-xs text-primary-500 font-bold uppercase tracking-wider">Live Users</div>
                                <div className="text-2xl font-black text-primary-950">1,240+ Today</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16">
                    <FeatureCard 
                        icon={BookOpen}
                        title="AP POLYCET"
                        description="Predict your rank for Polytechnic entrance and find your branch with advanced AI logic."
                        to="/polycet"
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={Sparkles}
                        title="Dream College"
                        description="New! Filter colleges by specific districts and courses to find your perfect match."
                        to="/dream-college"
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={Trophy}
                        title="AP EAMCET"
                        description="Engineering & Medicine entrance predictor. Check your potential college with previous data."
                        to="/eamcet"
                        delay={0.3}
                    />
                    <FeatureCard 
                        icon={Globe}
                        title="AP ECET"
                        description="Lateral entry for diploma students. Get accurate predictions for B.Tech college seats."
                        to="/ecet"
                        delay={0.4}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
