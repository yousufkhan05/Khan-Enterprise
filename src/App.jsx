import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LayoutGrid, Sun, Moon, ShieldCheck, Heart } from 'lucide-react';

// শুরুর ডেমো প্রোডাক্ট লিস্ট (যদি লোকাল স্টোরেজে কিছু না থাকে)
const initialProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro",
    originalPrice: 4500,
    price: 3200,
    stock: 100,
    description: "হাই-রেজোলিউশন অডিও, ৪টি নয়েজ ক্যান্সেলেশন মাইক্রোফোন এবং একটানা ৪০ ঘণ্টার মেগা ব্যাটারি লাইফ। গেমার এবং মিউজিক লাভারদের জন্য একদম পারফেক্ট চয়েস।",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    reviews: []
  },
  {
    id: 2,
    name: "Ultra Smart Watch Series 9",
    originalPrice: 3500,
    price: 2400,
    stock: 5, // এটি লিমিটেড স্টক দেখাবে
    description: "অ্যামোলেড ডিসপ্লে, রিয়েল-টাইম হার্ট রেট ট্র্যাকিং, ব্লুটুথ কলিং সিস্টেম এবং ওয়াটারপ্রুফ বডি। প্রিমিয়াম মেটালিক ফিনিশিং এর সাথে একটি রাজকীয় গ্যাজেট।",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: []
  }
];

export default function App() {
  // নেভিগেশন স্টেট ('shop', 'admin', 'cart')
  const [page, setPage] = useState('shop');
  
  // ডার্ক মোড স্টেট
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('khan_ent_dark_mode');
    return savedMode === 'true';
  });

  // প্রোডাক্ট গ্লোবাল স্টেট (লোকাল স্টোরেজ ব্যাকআপসহ)
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('khan_enterprise_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  // কার্ট স্টেট
  const [cart, setCart] = useState([]);

  // ডার্ক মোড ডম আপডেট ও লোকাল স্টোরেজে সেভ
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('khan_ent_dark_mode', darkMode);
  }, [darkMode]);

  // নতুন প্রোডাক্ট অ্যাড করার ফাংশন
  const addProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
  };

  // লাইভ প্রোডাক্টের রিভিউ অ্যাড করার ফাংশন
  const addReview = (productId, review) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [review, ...(p.reviews || [])] };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
  };

  // কার্টে পণ্য যোগ করার ফাংশন
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // কার্ট থেকে নির্দিষ্ট পণ্য বাদ দেওয়া
  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // কার্ট সম্পূর্ণ খালি করা
  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 🌟 প্রিমিয়াম গ্লোবাল হেডার */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* লোগো ব্র্যান্ডিং */}
          <div 
            onClick={() => setPage('shop')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="text-blue-600 dark:text-cyan-400">Enterprise</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">Premium Gadget Store</p>
            </div>
          </div>

          {/* নেভিগেশন কন্ট্রোল বাটনসমূহ */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* শপ কালেকশন বাটন */}
            <button 
              onClick={() => setPage('shop')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'shop' 
                  ? 'bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">শপ</span>
            </button>

            {/* অ্যাডমিন প্যানেল বাটন */}
            <button 
              onClick={() => setPage('admin')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'admin' 
                  ? 'bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle size={16} /> <span className="hidden sm:inline">অ্যাডমিন</span>
            </button>

            {/* শপিং কার্ট কাউন্টার বাটন */}
            <button 
              onClick={() => setPage('cart')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all relative ${
                page === 'cart' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShoppingBag size={16} /> 
              <span>কার্ট</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse border-2 border-white dark:border-slate-900">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* ডার্ক ও লাইট মোড টগল বাটন */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

          </div>
        </div>
      </header>

      {/* 🌀 মেইন ডাইনামিক পেজ বডি */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* ১. শপ ভিউ (প্রোডাক্ট গ্রিড কালেকশন) */}
          {page === 'shop' && (
            <motion.div
              key="shop-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* স্টাইলিশ ব্যানার */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-slate-900/60 p-6 sm:p-10 rounded-3xl text-white border border-transparent dark:border-slate-800/80 shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2">স্মার্ট গ্যাজেটের সেরা কালেকশন! 🔥</h2>
                <p className="text-xs sm:text-sm opacity-80 max-w-lg leading-relaxed font-medium">খান এন্টারপ্রাইজে আপনাকে স্বাগতম। আমাদের প্রতিটি পণ্যের সাথে পাচ্ছেন অফিসিয়াল ওয়ারেন্টি এবং ফাস্ট ক্যাশ অন ডেলিভারি সুবিধা।</p>
              </div>

              {/* প্রোডাক্ট কার্ড গ্রিড লেআউট */}
              {products.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <LayoutGrid size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">স্টোরে বর্তমানে কোনো প্রোডাক্ট লাইভ নেই। এডমিন প্যানেল থেকে যোগ করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      addToCart={addToCart} 
                      addReview={addReview}
                      setPage={setPage}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ২. অ্যাডমিন ড্যাশবোর্ড ভিউ */}
          {page === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminPanel addProduct={addProduct} setPage={setPage} />
            </motion.div>
          )}

          {/* ৩. শপিং কার্ট ও চেকআউট ফর্ম ভিউ */}
          {page === 'cart' && (
            <motion.div
              key="cart-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Cart 
                cart={cart} 
                removeFromCart={removeFromCart} 
                clearCart={clearCart} 
                setPage={setPage}
                products={products}
                setProducts={setProducts}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 🌟 ফুটার সেকশন */}
      <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-900/60 bg-white dark:bg-slate-900/40 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Khan Enterprise. Developed with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>by Yousuf</span>
        </div>
      </footer>

    </div>
  );
}