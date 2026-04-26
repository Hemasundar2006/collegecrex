import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

const ComingSoon = ({ title }) => (
    <div className="pt-24 min-h-screen gradient-bg flex items-center justify-center px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-white p-12 rounded-[2.5rem] shadow-3d border border-primary-50 text-center relative overflow-hidden"
        >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-50 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-50 rounded-full blur-3xl"></div>
            
            <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block p-6 bg-primary-100 rounded-3xl text-primary-600 mb-8"
            >
                <Construction size={48} />
            </motion.div>

            <h1 className="text-4xl font-black text-primary-950 mb-4 italic tracking-tighter">
                {title} <span className="text-primary-600">Predictor</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8">
                <div className="h-1 w-12 bg-primary-600 rounded-full"></div>
                <Sparkles size={16} className="text-primary-400" />
                <div className="h-1 w-12 bg-primary-600 rounded-full"></div>
            </div>
            
            <p className="text-primary-700 leading-relaxed mb-10 text-lg">
                Exclusive predictor for Diploma students. We are finalizing the lateral entry seat details for the 2025-26 session!
            </p>

            <button className="px-10 py-4 bg-primary-950 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-primary-900 transition-all active:scale-95">
                Stay Tuned
            </button>
        </motion.div>
    </div>
);

const Ecet = () => <ComingSoon title="AP ECET" />;

export default Ecet;
