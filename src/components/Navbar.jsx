import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Search, ShoppingCart, Sun, Moon, LayoutGrid, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount, setPage, currentPage }) {
  const { darkMode, toggleTheme } = useTheme();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      {/* ==================== DESKTOP & MOBILE TOP NAVBAR ==================== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* স্টোর লোগো/নেম */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => setPage('shop')}
            >
              <span className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:via-teal-400 dark:to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                KHAN ENTERPRISE
              </span>
            </motion.div>

            {/* ডেস্কটপ সার্চ ও কন্ট্রোলস (মোবাইলে লুকানো থাকবে) */}
            <div className="hidden md:flex items-center space-x-6">
              
              {/* ডেস্কটপ অ্যানিমেটেড সার্চ */}
              <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 dark:focus-within:border-cyan-400 transition-all">
                <input
                  type="text"
                  placeholder="পণ্য সার্চ করুন..."
                  className="bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none w-48 lg:w-64 transition-all"
                />
                <Search size={16} className="text-slate-400" />
              </div>

              {/* থিম টগল বাটন */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme} 
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {darkMode ? <Sun size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> : <Moon size={20} />}
              </motion.button>

              {/* অ্যাডমিন বাটন */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(currentPage === 'admin' ? 'shop' : 'admin')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                  currentPage === 'admin' 
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-transparent shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400'
                }`}
              >
                {currentPage === 'admin' ? 'শপ পেজ' : 'অ্যাডমিন প্যানেল'}
              </motion.button>

              {/* কার্ট বাটন */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage('cart')} 
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 relative transition-all"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* মোবাইল সার্চ আইকন (শুধুমাত্র মোবাইলের টপ বারে দেখাবে) */}
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <Search size={22} />
              </button>
            </div>

          </div>
        </div>

        {/* মোবাইল ফুল-স্ক্রিন সার্চ প্যানেল (Daraz Style) */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 w-full bg-white dark:bg-slate-950 p-3 shadow-xl border-b border-slate-200 dark:border-slate-800 flex items-center z-50 md:hidden"
            >
              <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  autoFocus
                  placeholder="দারুণ সব গ্যাজেট সার্চ করুন..."
                  className="bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none w-full"
                />
                <Search size={18} className="text-slate-400" />
              </div>
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="ml-3 p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500"
              >
                <X size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==================== MOBILE BOTTOM NAVIGATION BAR (Daraz App Style) ==================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-900 px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div className="flex items-center justify-around">
          
          {/* হোম/শপ বাটন */}
          <button 
            onClick={() => setPage('shop')}
            className={`flex flex-col items-center space-y-1 transition-all ${currentPage === 'shop' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <LayoutGrid size={20} className={currentPage === 'shop' ? 'animate-pulse' : ''} />
            <span className="text-[10px]">হোম</span>
          </button>

          {/* কার্ট বাটন */}
          <button 
            onClick={() => setPage('cart')}
            className={`flex flex-col items-center space-y-1 relative transition-all ${currentPage === 'cart' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 right-0 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-950 animate-bounce">
                {cartCount}
              </span>
            )}
            <span className="text-[10px]">কার্ট</span>
          </button>

          {/* থিম চেঞ্জার বাটন */}
          <button 
            onClick={toggleTheme}
            className="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400"
          >
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            <span className="text-[10px]">{darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
          </button>

          {/* অ্যাডমিন প্যানেল বাটন */}
          <button 
            onClick={() => setPage(currentPage === 'admin' ? 'shop' : 'admin')}
            className={`flex flex-col items-center space-y-1 transition-all ${currentPage === 'admin' ? 'text-rose-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <UserCheck size={20} />
            <span className="text-[10px]">অ্যাডমিন</span>
          </button>

        </div>
      </div>
    </>
  );
}