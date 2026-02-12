import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, subValue, color, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
                {subValue && <p className="text-xs font-semibold text-slate-500 mt-1">{subValue}</p>}
            </div>
        </div>
    </motion.div>
);

export default StatsCard;
