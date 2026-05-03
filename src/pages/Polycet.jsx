import React, { useState } from 'react';
import { Client } from "@gradio/client";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Filter, Sparkles, MapPin, Info } from 'lucide-react';

const Polycet = () => {
    const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'dream'
    
    // Quick Predictor State
    const [rank, setRank] = useState('');
    const [category, setCategory] = useState('OC');
    const [gender, setGender] = useState('Male');
    const [course, setCourse] = useState('AEI');
    
    // Dream College State (Advanced Filter)
    const [dDistrict, setDDistrict] = useState('All');
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const categories = ['OC', 'SC', 'ST', 'BCA', 'BCB', 'BCC', 'BCD', 'BCE', 'EWS'];
    const genders = ['Male', 'Female'];
    const districts = ['All', 'ATP', 'CTR', 'EG', 'GTR', 'KDP', 'KNL', 'KRI', 'NLR', 'PKS', 'SKL', 'VSP', 'VZM', 'WG'];
    const courses = ['AEI', 'AFT', 'AI', 'AIM', 'AMG', 'ARC', 'AUT', 'BME', 'CAI', 'CCB', 'CCN', 'CCP', 'CER', 'CHE', 'CIV', 'CME', 'CMI', 'COT', 'CPC', 'CPP', 'ECE', 'EEE', 'EII', 'EVT', 'GT', 'IOT', 'MEC', 'MET', 'MIN', 'MRA', 'PET', 'TXT', 'VAS', 'VCS', 'VER', 'VMC', 'WD'];

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            if (activeTab === 'quick') {
                const client = await Client.connect("hemasundarprojs/polycet_rank_predictor");
                const response = await client.predict("/predictor", {
                    rank: parseFloat(rank),
                    category: category,
                    gender: gender,
                    course: course,
                });
                setResult(response.data[0]);
            } else {
                const client = await Client.connect("hemasundarprojs/polycet_filter");
                const response = await client.predict("/predictor", {
                    rank: parseFloat(rank),
                    category: category,
                    gender: gender,
                    course: course,
                    district: dDistrict,
                });
                setResult(response.data[0]);
            }
        } catch (err) {
            console.error(err);
            setError("Prediction failed. Please check your inputs or try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen gradient-bg pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-primary-950 mb-4 italic tracking-tighter">
                        AP POLYCET <span className="text-primary-600">2025</span>
                    </h1>
                    <p className="text-primary-700 font-medium">Select your preferred prediction method below</p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-primary-100 shadow-lg flex gap-2">
                        <button
                            onClick={() => { setActiveTab('quick'); setResult(null); }}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'quick' ? 'bg-primary-600 text-white shadow-3d' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <Search size={18} />
                            Quick Predict
                        </button>
                        <button
                            onClick={() => { setActiveTab('dream'); setResult(null); }}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'dream' ? 'bg-primary-600 text-white shadow-3d' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <Sparkles size={18} />
                            Dream College Filter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Section */}
                    <motion.div
                        layout
                        className="lg:col-span-7"
                    >
                        <form onSubmit={handlePredict} className="bg-white p-8 rounded-[2.5rem] shadow-3d border border-primary-50 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-green-300"></div>
                            
                            <div>
                                <label className="block text-xs font-black text-primary-900 mb-2 uppercase tracking-[0.2em] opacity-60">
                                    Entrance Rank
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={rank}
                                    onChange={(e) => setRank(e.target.value)}
                                    placeholder="e.g. 5240"
                                    className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-xl text-primary-950 placeholder:text-primary-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-primary-900 mb-2 uppercase tracking-[0.2em] opacity-60">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                        >
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-primary-900 mb-2 uppercase tracking-[0.2em] opacity-60">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                    >
                                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-primary-900 mb-2 uppercase tracking-[0.2em] opacity-60">
                                    Target Branch
                                </label>
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer"
                                >
                                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <AnimatePresence>
                                {activeTab === 'dream' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-2"
                                    >
                                        <label className="block text-xs font-black text-primary-900 mb-2 uppercase tracking-[0.2em] opacity-60 flex items-center gap-1">
                                            <MapPin size={12} />
                                            District Preference
                                        </label>
                                        <select
                                            value={dDistrict}
                                            onChange={(e) => setDDistrict(e.target.value)}
                                            className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-primary-950 appearance-none cursor-pointer ring-2 ring-primary-100 ring-offset-2"
                                        >
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (activeTab === 'quick' ? <Search /> : <Sparkles />)}
                                {loading ? "Analyzing..." : (activeTab === 'quick' ? "Run Quick Predict" : "Generate Dream List")}
                            </button>
                        </form>
                    </motion.div>

                    {/* Results Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-3d-hover border border-primary-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 bg-green-50 rounded-bl-2xl text-green-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-primary-900 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Available Options
                                    </h3>
                                    <div 
                                        className="results-html-content text-primary-950 prose prose-sm prose-green max-w-none"
                                        dangerouslySetInnerHTML={{ __html: result }}
                                    />
                                </motion.div>
                            ) : !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-primary-950 text-white p-10 rounded-[2.5rem] shadow-3d h-full flex flex-col justify-center border border-white/10"
                                >
                                    <div className="mb-6 opacity-40 italic"><Info size={40} /></div>
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">Expert Insight</h3>
                                    <p className="text-primary-300 leading-relaxed text-sm italic">
                                        "Did you know? Choosing the right branch is as important as the college. Use our <b>Dream College Filter</b> to find specific branches in your preferred district."
                                    </p>
                                    <div className="mt-8 flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                        <div className="w-1.5 h-1.5 bg-primary-700 rounded-full"></div>
                                        <div className="w-1.5 h-1.5 bg-primary-800 rounded-full"></div>
                                    </div>
                                </motion.div>
                            )}

                            {loading && (
                                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                                    <p className="text-primary-600 font-bold animate-pulse uppercase tracking-widest text-xs">Processing Algorithm...</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold text-sm">
                                    {error}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Polycet;
