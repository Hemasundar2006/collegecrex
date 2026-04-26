import React, { useState } from 'react';
import { Client } from "@gradio/client";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Search, Filter, MapPin, Trash2 } from 'lucide-react';

const DreamCollege = () => {
    const [rank, setRank] = useState('');
    const [category, setCategory] = useState('OC');
    const [gender, setGender] = useState('Male');
    const [course, setCourse] = useState('AEI');
    const [district, setDistrict] = useState('All');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const categories = ['OC', 'SC', 'ST', 'BCA', 'BCB', 'BCC', 'BCD', 'BCE', 'EWS'];
    const genders = ['Male', 'Female'];
    const districts = ['All', 'ATP', 'CTR', 'DIST', 'EG', 'GTR', 'KDP', 'KNL', 'KRI', 'NLR', 'PKS', 'SKL', 'VSP', 'VZM', 'WG'];
    const courses = ['AEI', 'AFT', 'AI', 'AIM', 'AMG', 'ARC', 'AUT', 'BME', 'BRANCH_CODE', 'CAI', 'CCB', 'CCN', 'CCP', 'CER', 'CHE', 'CIV', 'CME', 'CMI', 'COT', 'CPC', 'CPP', 'ECE', 'EEE', 'EII', 'EVT', 'GT', 'IOT', 'MEC', 'MET', 'MIN', 'MRA', 'PET', 'TXT', 'VAS', 'VCS', 'VER', 'VMC', 'WD'];

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const client = await Client.connect("hemasundarprojs/polycet_filter");
            const response = await client.predict("/predictor", {
                rank: parseFloat(rank),
                category: category,
                gender: gender,
                course: course,
                district: district,
            });
            setResult(response.data[0]);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch college list. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen gradient-bg pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6 shadow-sm border border-green-200">
                        <Sparkles size={16} />
                        <span>Filter by District & Course</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-primary-950 mb-4 italic tracking-tighter">
                        Dream <span className="text-primary-600">College</span> Predictor
                    </h1>
                    <p className="text-primary-700 max-w-2xl mx-auto">
                        Find exactly which college you can get into with specific branch and district filters. Tailored for AP POLYCET counseling.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filter Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4"
                    >
                        <form onSubmit={handlePredict} className="bg-white p-8 rounded-[2rem] shadow-3d border border-primary-50 space-y-6 sticky top-28">
                            <div className="flex items-center justify-between pb-4 border-b border-primary-50">
                                <h3 className="flex items-center gap-2 font-black text-primary-950 uppercase text-sm tracking-widest">
                                    <Filter size={18} className="text-primary-600" />
                                    Filter Options
                                </h3>
                                <button 
                                    type="button" 
                                    onClick={() => {setRank(''); setResult(null);}}
                                    className="text-primary-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-primary-900 mb-1.5 uppercase tracking-wider">
                                        Your Rank
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={rank}
                                        onChange={(e) => setRank(e.target.value)}
                                        placeholder="Rank..."
                                        className="w-full px-4 py-3 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-primary-950 shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-primary-900 mb-1.5 uppercase tracking-wider">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                        >
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-primary-900 mb-1.5 uppercase tracking-wider">
                                            Gender
                                        </label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full px-4 py-3 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                        >
                                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-primary-900 mb-1.5 uppercase tracking-wider">
                                        Branch / Course
                                    </label>
                                    <select
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                        className="w-full px-4 py-3 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                    >
                                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-primary-900 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin size={12} className="text-primary-600" />
                                        District Filter
                                    </label>
                                    <select
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full px-4 py-3 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                    >
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary-950 text-white rounded-xl font-black text-lg shadow-3d hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                                {loading ? "Generating List..." : "Find Colleges"}
                            </button>
                        </form>
                    </motion.div>

                    {/* Results Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[2rem] shadow-3d border border-primary-50 overflow-hidden"
                                >
                                    <div className="bg-primary-600 p-6 flex justify-between items-center text-white">
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight italic">Matched Colleges</h2>
                                            <p className="text-xs text-primary-100 uppercase tracking-widest font-bold">Your Potential Placements</p>
                                        </div>
                                        <CheckCircleIcon />
                                    </div>
                                    <div className="p-8">
                                        <div 
                                            className="dream-result-container prose prose-green max-w-none prose-table:rounded-xl prose-table:overflow-hidden prose-th:bg-primary-50 prose-th:p-4 prose-td:p-4 prose-tr:border-b prose-tr:border-primary-50"
                                            dangerouslySetInnerHTML={{ __html: result }}
                                        />
                                    </div>
                                </motion.div>
                            ) : !loading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-4 border-dashed border-primary-100 text-center p-12"
                                >
                                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-300 mb-6 group-hover:scale-110 transition-transform">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-primary-900 mb-2">Ready to explore?</h3>
                                    <p className="text-primary-600 max-w-xs">Fill in your rank and preferences on the left to generate your custom dream college list.</p>
                                </motion.div>
                            )}

                            {loading && (
                                <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-primary-100 rounded-full animate-ping opacity-25"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="text-primary-600 animate-spin" size={40} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-primary-900 animate-pulse">Running AI Simulation</h3>
                                        <p className="text-primary-500 text-sm italic">Scanning college cutoffs for 2025...</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 flex items-center gap-4">
                                    <div className="p-3 bg-red-100 rounded-2xl"><Search className="rotate-45" /></div>
                                    <div>
                                        <h4 className="font-bold">Something went wrong</h4>
                                        <p className="text-sm opacity-80">{error}</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckCircleIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default DreamCollege;
