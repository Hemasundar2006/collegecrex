import React, { useState, useEffect } from 'react';
import { Client } from "@gradio/client";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Filter, Sparkles, MapPin, Info, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';

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
    const [mapModal, setMapModal] = useState({ isOpen: false, college: null, loading: false, data: null, error: null });
    const [exportCount, setExportCount] = useState(10);

    useEffect(() => {
        window.openMapModal = (collegeName, district = '') => {
            setMapModal({ isOpen: true, college: collegeName, loading: true, data: null, error: null });
            
            const apiKey = "ea7dcf935a8e4f86bf2740ecc81a94fd";
            const searchQuery = `${collegeName} ${district} Andhra Pradesh`.trim();
            fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&apiKey=${apiKey}`)
                .then(res => res.json())
                .then(result => {
                    if (result.features && result.features.length > 0) {
                        const { lat, lon, formatted } = result.features[0].properties;
                        setMapModal(prev => ({ ...prev, loading: false, data: { lat, lon, formatted } }));
                    } else {
                        setMapModal(prev => ({ ...prev, loading: false, error: "Location not found on map" }));
                    }
                })
                .catch(err => {
                    setMapModal(prev => ({ ...prev, loading: false, error: "Failed to load map data" }));
                });
        };
        return () => { delete window.openMapModal; };
    }, []);

    const exportToExcel = () => {
        const table = document.querySelector('.results-html-content table');
        if (!table) {
            alert('No data available to export.');
            return;
        }

        const rows = table.querySelectorAll('tr');
        const headers = [];
        if (rows.length > 0) {
            const headerCells = rows[0].querySelectorAll('th, td');
            headerCells.forEach(cell => {
                if (!cell.classList.contains('map-header') && !cell.classList.contains('map-cell')) {
                    headers.push(cell.textContent ? cell.textContent.trim() : '');
                }
            });
        }

        const body = [];
        const rowCount = Math.min(rows.length, exportCount + 1);
        for (let i = 1; i < rowCount; i++) {
            const rowData = [];
            const cols = rows[i].querySelectorAll('td, th');
            cols.forEach(cell => {
                if (!cell.classList.contains('map-header') && !cell.classList.contains('map-cell')) {
                    rowData.push(cell.textContent ? cell.textContent.trim() : '');
                }
            });
            body.push(rowData);
        }

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...body]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Colleges");
        XLSX.writeFile(workbook, `Top_${exportCount}_Colleges.xlsx`);
    };

    const categories = ['OC', 'SC', 'ST', 'BCA', 'BCB', 'BCC', 'BCD', 'BCE', 'EWS'];
    const genders = ['Male', 'Female'];
    const districts = ['All', 'ATP', 'CTR', 'EG', 'GTR', 'KDP', 'KNL', 'KRI', 'NLR', 'PKS', 'SKL', 'VSP', 'VZM', 'WG'];
    const courses = ['AEI', 'AFT', 'AI', 'AIM', 'AMG', 'ARC', 'AUT', 'BME', 'CAI', 'CCB', 'CCN', 'CCP', 'CER', 'CHE', 'CIV', 'CME', 'CMI', 'COT', 'CPC', 'CPP', 'ECE', 'EEE', 'EII', 'EVT', 'GT', 'IOT', 'MEC', 'MET', 'MIN', 'MRA', 'PET', 'TXT', 'VAS', 'VCS', 'VER', 'VMC', 'WD'];

    const processResultHtml = (htmlString) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const table = doc.querySelector('table');
            if (!table) return htmlString;

            const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
            const allRows = Array.from(table.querySelectorAll('tr'));
            const dataRows = allRows.filter(r => r !== headerRow);

            dataRows.sort((a, b) => {
                const textA = a.textContent.toLowerCase();
                const textB = b.textContent.toLowerCase();
                const aIsGovt = textA.includes('govt') || textA.includes('government') || textA.includes('university') || textA.includes(' univ');
                const bIsGovt = textB.includes('govt') || textB.includes('government') || textB.includes('university') || textB.includes(' univ');
                if (aIsGovt && !bIsGovt) return -1;
                if (!aIsGovt && bIsGovt) return 1;
                return 0;
            });
            
            const tbody = table.querySelector('tbody') || table;
            dataRows.forEach(row => tbody.appendChild(row));
            
            if (headerRow && !headerRow.querySelector('.map-header')) {
                const th = document.createElement('th');
                th.className = 'map-header';
                th.innerText = 'Location';
                headerRow.appendChild(th);
            }

            let nameColIdx = 1;
            let distColIdx = -1;
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th, td')).map(h => h.innerText.toLowerCase());
                const foundIdx = headers.findIndex(h => h.includes('college') || h.includes('institute') || h.includes('name'));
                if (foundIdx !== -1) nameColIdx = foundIdx;
                
                const distIdx = headers.findIndex(h => h.includes('dist') || h.includes('place') || h.includes('location'));
                if (distIdx !== -1) distColIdx = distIdx;
            }

            dataRows.forEach(row => {
                if (row.querySelector('.map-cell')) return;
                const tds = row.querySelectorAll('td, th');
                const collegeName = tds[nameColIdx] ? tds[nameColIdx].innerText.trim() : '';
                const districtName = distColIdx !== -1 && tds[distColIdx] ? tds[distColIdx].innerText.trim() : '';
                
                const td = document.createElement('td');
                td.className = 'map-cell';
                if (collegeName) {
                    const safeName = collegeName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                    const safeDist = districtName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                    td.innerHTML = `<button type="button" class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-200 transition-colors flex items-center gap-1 whitespace-nowrap" onclick="window.openMapModal('${safeName}', '${safeDist}')"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Map</button>`;
                }
                row.appendChild(td);
            });
            
            return doc.body.innerHTML;
        } catch (e) {
            console.error("Sorting table failed", e);
            return htmlString;
        }
    };

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
                setResult(processResultHtml(response.data[0]));
            } else {
                const client = await Client.connect("hemasundarprojs/polycet_filter");
                const response = await client.predict("/predictor", {
                    rank: parseFloat(rank),
                    category: category,
                    gender: gender,
                    course: course,
                    district: dDistrict,
                });
                setResult(processResultHtml(response.data[0]));
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
                <div className="flex justify-center mb-12 px-2">
                    <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-primary-100 shadow-lg flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => { setActiveTab('quick'); setResult(null); }}
                            className={`px-4 sm:px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none whitespace-nowrap text-sm sm:text-base ${activeTab === 'quick' ? 'bg-primary-600 text-white shadow-3d' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <Search size={18} className="shrink-0" />
                            Quick Predict
                        </button>
                        <button
                            onClick={() => { setActiveTab('dream'); setResult(null); }}
                            className={`px-4 sm:px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none whitespace-nowrap text-sm sm:text-base ${activeTab === 'dream' ? 'bg-primary-600 text-white shadow-3d' : 'text-primary-600 hover:bg-primary-50'}`}
                        >
                            <Sparkles size={18} className="shrink-0" />
                            Dream Filter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Section */}
                    <motion.div
                        layout
                        className="lg:col-span-7"
                    >
                        <form onSubmit={handlePredict} className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-3d border border-primary-50 space-y-6 relative overflow-hidden">
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
                                    className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-3d-hover border border-primary-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 bg-green-50 rounded-bl-2xl text-green-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <h3 className="text-primary-900 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Available Options
                                        </h3>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                            <select 
                                                value={exportCount} 
                                                onChange={(e) => setExportCount(Number(e.target.value))}
                                                className="w-full sm:w-auto px-3 py-2 bg-primary-50 text-primary-700 border border-primary-100 rounded-xl text-xs font-bold outline-none cursor-pointer"
                                            >
                                                <option value={10}>Top 10</option>
                                                <option value={20}>Top 20</option>
                                                <option value={50}>Top 50</option>
                                            </select>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={exportToExcel}
                                                    className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none border border-primary-100"
                                                >
                                                    <Download size={14} />
                                                    Excel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        className="results-html-content text-primary-950 prose prose-sm prose-green max-w-none overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: result }}
                                    />
                                </motion.div>
                            ) : !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-primary-950 text-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-3d h-full flex flex-col justify-center border border-white/10"
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

                            {/* WhatsApp Community Card */}
                            {!loading && !result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[#25D366]/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-[#25D366]/20 relative overflow-hidden flex flex-col justify-center"
                                >
                                    <div className="absolute -top-6 -right-6 opacity-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                    </div>
                                    <h3 className="text-xl font-black mb-2 tracking-tight text-[#1DA851] flex items-center gap-2 relative z-10">
                                        Join Our Community
                                    </h3>
                                    <p className="text-[#1DA851]/80 leading-relaxed text-sm font-medium mb-6 relative z-10">
                                        Have queries about AP POLYCET? Join our WhatsApp channel for updates, counseling tips, and expert guidance.
                                    </p>
                                    <a 
                                        href="https://whatsapp.com/channel/0029Vb7K4xO1noz27fvVPG28"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center self-start px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1DA851] transition-all shadow-[0_4px_0_rgb(29,168,81)] hover:shadow-[0_2px_0_rgb(29,168,81)] hover:translate-y-0.5 active:scale-95 gap-2 relative z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                        Follow Channel
                                    </a>
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

            {/* Map Modal */}
            <AnimatePresence>
                {mapModal.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-primary-100 relative"
                        >
                            <button 
                                onClick={() => setMapModal({ isOpen: false, college: null, loading: false, data: null, error: null })}
                                className="absolute top-6 right-6 text-primary-400 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-black text-primary-950 mb-2 pr-10 leading-tight">
                                {mapModal.college}
                            </h3>
                            
                            <div className="mt-6 aspect-video bg-primary-50 rounded-xl overflow-hidden relative border border-primary-100 flex items-center justify-center">
                                {mapModal.loading ? (
                                    <div className="flex flex-col items-center text-primary-500">
                                        <Loader2 className="animate-spin mb-2 w-8 h-8" />
                                        <span className="text-sm font-bold animate-pulse">Locating on Map...</span>
                                    </div>
                                ) : mapModal.error ? (
                                    <div className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg">
                                        {mapModal.error}
                                    </div>
                                ) : mapModal.data ? (
                                    <img 
                                        src={`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${mapModal.data.lon},${mapModal.data.lat}&zoom=14&marker=lonlat:${mapModal.data.lon},${mapModal.data.lat};type:material;color:%2315803d;icontype:awesome&apiKey=ea7dcf935a8e4f86bf2740ecc81a94fd`}
                                        alt="Map Location"
                                        className="w-full h-full object-cover"
                                    />
                                ) : null}
                            </div>
                            
                            {mapModal.data && (
                                <div className="mt-4 flex items-start gap-2 text-sm text-primary-700 bg-green-50 p-3 rounded-xl border border-green-100">
                                    <MapPin size={16} className="text-green-600 shrink-0 mt-0.5" />
                                    <p className="font-medium leading-relaxed">{mapModal.data.formatted}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating WhatsApp Bot */}
            <a
                href="https://wa.me/9170361808133?text=Hi!%20I%20have%20a%20query%20related%20to%20AP%20POLYCET."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_10px_40px_rgb(37,211,102,0.6)] transition-all z-40 flex items-center justify-center group"
                aria-label="Chat with our Bot on WhatsApp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-primary-950 text-xs font-black px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-primary-100 hidden sm:block">
                    Need Help? Chat with us!
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white rotate-45 border-r border-t border-primary-100"></div>
                </div>
            </a>
        </div>
    );
};

export default Polycet;
