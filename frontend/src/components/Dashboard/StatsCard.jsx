import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

const StatsCard = ({ icon: Icon, label, value, subValue, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        <Card className="p-6 transition-all hover:bg-white/5 group border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
                    {subValue && <p className="text-xs font-semibold text-gray-500 mt-1">{subValue}</p>}
                </div>
            </div>
        </Card>
    </motion.div>
);

export default StatsCard;
