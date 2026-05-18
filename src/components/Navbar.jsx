import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Search, ShoppingCart, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount, setPage, currentPage }) {
  const { darkMode, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* স্টোর নেম */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setPage('shop')}>
            <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              KHAN ENTERPRISE
            </span>
          </div>

          {/* ডানপাশের মেনু আইটেমসমূহ */}
          <div className="flex items-center space-x-4">
            
            {/* অ্যানিমেটেড সার্চ বক্স */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="সার্চ করুন..."
                    className="px-3 py-1 text-xs rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none mr-2"
                  />
                )}
              </AnimatePresence>
              
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Search size={18} />
              </button>
            </div>

            {/* থিম চেঞ্জার বাটন (Light/Dark) */}
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* অ্যাডমিন প্যানেল টগল বাটন */}
            <button
              onClick={() => setPage(currentPage === 'admin' ? 'shop' : 'admin')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                currentPage === 'admin' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {currentPage === 'admin' ? 'শপ পেজ' : 'অ্যাডমিন'}
            </button>

            {/* কার্ট বাটন */}
            <button onClick={() => setPage('cart')} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}