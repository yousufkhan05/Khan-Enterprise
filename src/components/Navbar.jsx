import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Search, ShoppingCart, Sun, Moon, Menu, X, Laptop, UserCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount, setPage, currentPage }) {
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // মোবাইল মেনু স্টেট
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleMenuClick = (pageName) => {
    setPage(pageName);
    setIsMenuOpen(false); // মেনু আইটেমে ক্লিক করলে মেনু বন্ধ হয়ে যাবে
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ১. স্টোর লোগো */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleMenuClick('shop')}>
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              KHAN ENTERPRISE
            </span>
          </div>

          {/* ২. ডেস্কটপ মেনু অপশনসমূহ (মোবাইলে সম্পূর্ণ হাইড থাকবে) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* সার্চ বার */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="সার্চ করুন..."
                className="px-2 py-0.5 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none w-40"
              />
              <Search size={14} className="text-slate-400" />
            </div>

            {/* লাইট/ডার্ক মোড */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* অ্যাডমিন বাটন */}
            <button
              onClick={() => handleMenuClick(currentPage === 'admin' ? 'shop' : 'admin')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                currentPage === 'admin' 
                  ? 'bg-rose-500 text-white border-transparent shadow-sm' 
                  : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {currentPage === 'admin' ? 'শপ পেজ' : 'অ্যাডমিন'}
            </button>

            {/* কার্ট আইকন */}
            <button onClick={() => handleMenuClick('cart')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* ৩. মোবাইল হ্যামবার্গার মেনু বাটন (শুধুমাত্র মোবাইলে দৃশ্যমান) */}
          <div className="flex md:hidden items-center space-x-2">
            {/* মোবাইলের শর্টকাট কার্ট বাটন যাতে কাস্টমার সবসময় কার্ট দেখতে পায় */}
            <button onClick={() => handleMenuClick('cart')} className="p-2 text-slate-700 dark:text-slate-300 relative mr-1">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* আসল হ্যামবার্গার টগল বাটন */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* ৪. মোবাইল ড্রপডাউন মেনু প্যানেল (মোবাইলে বাটন টিপলে নিচে স্লাইড হবে) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              
              {/* মোবাইলের ভেতরের সার্চ বক্স */}
              <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  placeholder="পণ্য সামগ্রী সার্চ করুন..."
                  className="bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none w-full"
                />
                <Search size={16} className="text-slate-400" />
              </div>

              {/* মেনু অপশন: হোম/শপ */}
              <button 
                onClick={() => handleMenuClick('shop')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ShoppingBag size={18} className="text-blue-500" />
                <span>শপ কালেকশন</span>
              </button>

              {/* মেনু অপশন: অ্যাডমিন প্যানেল */}
              <button 
                onClick={() => handleMenuClick('admin')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <UserCheck size={18} className="text-emerald-500" />
                <span>অ্যাডমিন ড্যাশবোর্ড</span>
              </button>

              {/* মেনু অপশন: থিম চেঞ্জার টগল (ডার্ক/লাইট) */}
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
                  <span>{darkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {darkMode ? 'Dark' : 'Light'}
                </span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}