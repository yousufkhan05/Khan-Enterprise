import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LayoutGrid, Sun, Moon, ShieldCheck, Heart, Settings, Edit, Trash2, Lock, KeyRound, Eye, EyeOff, Truck, RefreshCw, Headphones, ArrowRight, Layers } from 'lucide-react';

// শুরুর ডেমো প্রোডাক্ট লিস্ট (স্টক এবং ক্যাটাগরিসহ আপডেট করা)
const initialProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro",
    originalPrice: 4500,
    price: 3200,
    stock: 100,
    category: "Headphone",
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
    stock: 5,
    category: "Smartwatch",
    description: "অ্যামোলেড ডিসপ্লে, রিয়েল-টাইম হার্ট রেট ট্র্যাকিং, ব্লুটুথ কলিংシステム এবং ওয়াটারপ্রুফ বডি। প্রিমিয়াম মেটালিক ফিনিশিং এর সাথে একটি রাজকীয় গ্যাজেট।",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: []
  }
];

// হিরো স্লাইডারের ৩টি প্রিমিয়াম ব্যানার ডাটা
const heroSlides = [
  {
    title: "ভবিষ্যতের স্মার্ট গ্যাজেট এখন আপনার হাতের মুঠোয়",
    subtitle: "খান এন্টারপ্রাইজের অরিজিনাল কালেকশন",
    bg: "from-blue-600 to-indigo-800 dark:from-slate-900 dark:to-slate-950",
    badge: "5.5 মেগা ঈদ সেল 🔥"
  },
  {
    title: "প্রিমিয়াম অডিও এক্সপেরিয়েন্স, নো নয়েজ!",
    subtitle: "Wireless Headphones কালেকশনে ফ্ল্যাট ৩০% পর্যন্ত ছাড়",
    bg: "from-purple-600 to-pink-700 dark:from-slate-900 dark:to-slate-900",
    badge: "সীমিত অফার ⚡"
  },
  {
    title: "স্মার্ট লাইফস্টাইল, স্মার্ট ট্র্যাকিং",
    subtitle: "অরিজিনাল স্মার্টওয়াচ কিনলেই পাচ্ছেন নিশ্চিত ক্যাশব্যাক",
    bg: "from-cyan-600 to-teal-700 dark:from-slate-950 dark:to-slate-900",
    badge: "১০০% জেনুইন প্রডাক্ট 🛡️"
  }
];

export default function App() {
  const [page, setPage] = useState('shop');
  const [adminTab, setAdminTab] = useState('add'); 
  const [editingProduct, setEditingProduct] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('All'); // ক্যাটাগরি ফিল্টার স্টেট
  const [currentSlide, setCurrentSlide] = useState(0); // স্লাইডার স্টেট
  
  // সিকিউরিটি স্টেটসমূহ
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); 
  const [showLockModal, setShowLockModal] = useState(false); 
  const [adminPassword, setAdminPassword] = useState(''); 
  const [showPasswordText, setShowPasswordText] = useState(false); 

  const SECRET_ADMIN_PASSWORD = "khanenterprise05"; 

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('khan_ent_dark_mode');
    return savedMode === 'true';
  });

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('khan_enterprise_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  const [cart, setCart] = useState([]);

  // হিরো স্লাইডার অটো-প্লে মেকানিজম (প্রতি ৫ সেকেন্ডে স্লাইড চেঞ্জ হবে)
  useEffect(() => {
    if (page !== 'shop') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('khan_ent_dark_mode', darkMode);
  }, [darkMode]);

  const handleAdminAccessSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === SECRET_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLockModal(false);
      setPage('admin');
      setAdminPassword('');
    } else {
      alert('🚫 ভুল পাসওয়ার্ড! আপনি খান এন্টারপ্রাইজের অনুমোদিত অ্যাডমিন বা মডারেটর নন।');
      setAdminPassword('');
    }
  };

  const handleAdminButtonClick = () => {
    if (isAdminLoggedIn) {
      setPage('admin');
      setAdminTab('add');
      setEditingProduct(null);
    } else {
      setShowLockModal(true); 
    }
  };

  const addProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
  };

  const updateProduct = (updatedProduct) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
    setEditingProduct(null);
    setAdminTab('manage');
    alert('প্রোডাক্টের সমস্ত তথ্য সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const deleteProduct = (id) => {
    if(window.confirm("আপনি কি নিশ্চিত যে এই প্রোডাক্টটি স্টোর থেকে চিরতরে মুছে ফেলতে চান?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
    }
  };

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

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const clearCart = () => setCart([]);

  // ক্যাটাগরি ফিল্টারিং লজিক
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory || (selectedCategory === 'Smartwatch' && p.name.toLowerCase().includes('watch')) || (selectedCategory === 'Headphone' && p.name.toLowerCase().includes('headphone')));

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      darkMode ? 'bg-[rgba(7,11,23,1)] text-slate-100' : 'bg-slate-50 text-slate-900'
    } relative overflow-x-hidden`}>
      
      {/* 🔮 গ্লোবাল অরোরা ব্যাকগ্রাউন্ড নিওন গ্লো (শুধুমাত্র ডার্ক মোডে রাজকীয় ভাইব দেবে) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
        </>
      )}
      
      {/* 🌟 গ্লাস-মরফিজম হেডার টপ বার */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/60 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          <div onClick={() => setPage('shop')} className="flex items-center gap-2.5 cursor-pointer group">
            <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={22} />
            </motion.div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Enterprise</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase -mt-0.5">Premium Gadget Store</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button 
              onClick={() => setPage('shop')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'shop' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid size={15} /> <span className="hidden sm:inline">শপ</span>
            </button>

            <button 
              onClick={handleAdminButtonClick}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'admin' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Lock size={14} className={isAdminLoggedIn ? "text-emerald-400" : "text-slate-400"} />
              <span className="hidden sm:inline">অ্যাডমিন</span>
            </button>

            <button 
              onClick={() => setPage('cart')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all relative ${
                page === 'cart' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:opacity-90'
              }`}
            >
              <ShoppingBag size={15} /> 
              <span>কার্ট</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:scale-105 transition-all"
            >
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* 🌀 ডাইনামিক মেইন এরিয়া */}
      <main className="max-w-6xl mx-auto px-4 py-6 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* ==================== ১. শপ ফ্রন্ট পেজ (সর্বোচ্চ সুন্দর করা ডিজাইন) ==================== */}
          {page === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
              
              {/* 🎠 অ্যাপল স্টাইল মোশন হিরো ব্যানার স্লাইডার */}
              <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl border border-slate-200/30 dark:border-slate-800/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].bg} p-6 sm:p-10 flex flex-col justify-center text-white`}
                  >
                    <span className="w-fit px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-black rounded-full uppercase tracking-wider mb-2.5 sm:mb-4 border border-white/10">
                      {heroSlides[currentSlide].badge}
                    </span>
                    <h2 className="text-lg sm:text-3xl font-black tracking-tight max-w-xl leading-snug">
                      {heroSlides[currentSlide].title}
                    </h2>
                    <p className="text-[11px] sm:text-sm opacity-80 mt-1 sm:mt-2 font-medium max-w-md">
                      {heroSlides[currentSlide].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* স্লাইডার ইন্ডিকেটর ডটস */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {heroSlides.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* 🛡️ দারাজ স্টাইল ট্রাস্ট ব্যাজেস (৩টি ফিচার কার্ড) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-2 sm:p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm">
                  <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl"><Truck size={16} className="sm:w-5 sm:h-5" /></div>
                  <div><h4 className="text-[10px] sm:text-xs font-black">ফাস্ট ডেলিভারি</h4><p className="text-[8px] sm:text-[10px] text-slate-400 hidden sm:block">সারাদেশে দ্রুত পৌঁছানো</p></div>
                </div>
                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-2 sm:p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl"><RefreshCw size={16} className="sm:w-5 sm:h-5" /></div>
                  <div><h4 className="text-[10px] sm:text-xs font-black">৭ দিনের রিটার্ন</h4><p className="text-[8px] sm:text-[10px] text-slate-400 hidden sm:block">সহজ পণ্য পরিবর্তন</p></div>
                </div>
                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-2 sm:p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl"><Headphones size={16} className="sm:w-5 sm:h-5" /></div>
                  <div><h4 className="text-[10px] sm:text-xs font-black">২৪/৭ সাপোর্ট</h4><p className="text-[8px] sm:text-[10px] text-slate-400 hidden sm:block">যেকোনো সময় পাশে</p></div>
                </div>
              </div>

              {/* 🏷️ মডার্ন ক্যাটাগরি ফিল্টার ট্যাব */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                  <h3 className="text-sm sm:text-base font-black flex items-center gap-1.5 tracking-tight">
                    <Layers size={16} className="text-blue-600 dark:text-cyan-400" /> ক্যাটাগরি এক্সপ্লোর করুন
                  </h3>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-bold">
                    {filteredProducts.length} টি পণ্য
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Smartwatch', 'Headphone'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all whitespace-nowrap border ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-950 shadow-md' 
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      {cat === 'All' ? '🎯 সব কালেকশন' : cat === 'Smartwatch' ? '⌚ স্মার্টওয়াচ' : '🎧 হেডফোন'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🛍️ রেসপন্সিভ গ্লোয়িং প্রোডাক্ট গ্রিড */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-white dark:bg-slate-900/20 rounded-3xl border border-dashed dark:border-slate-800">
                  <p className="text-xs font-medium">এই ক্যাটাগরিতে এই মুহূর্তে কোনো পণ্য স্টকে নেই।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} addReview={addReview} setPage={setPage} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ২. অ্যাডমিন প্যানেল ভিউ */}
          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setAdminTab('add'); setEditingProduct(null); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${adminTab === 'add' && !editingProduct ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}
                  >
                    নতুন প্রোডাক্ট যোগ করুন
                  </button>
                  <button 
                    onClick={() => { setAdminTab('manage'); setEditingProduct(null); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${adminTab === 'manage' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}
                  >
                    প্রোডাক্ট ম্যানেজ ও এডিট করুন ({products.length})
                  </button>
                </div>
                <button onClick={() => { setIsAdminLoggedIn(false); setPage('shop'); }} className="px-3 py-1.5 text-xs font-bold rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all">
                  প্যানেল লক করুন (Logout)
                </button>
              </div>

              {adminTab === 'add' || editingProduct ? (
                <AdminPanel addProduct={addProduct} setPage={setPage} editingProduct={editingProduct} updateProduct={updateProduct} />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-1.5"><Settings size={18} /> স্টকের প্রোডাক্ট তালিকা</h3>
                  <div className="space-y-3">
                    {products.map(p => (
                      <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || p.image} alt="" className="w-12 h-12 object-contain bg-white dark:bg-slate-900 p-1 rounded-xl border dark:border-slate-800" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{p.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">মূল্য: ৳{p.price} | স্টক: {p.stock} পিস</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <button onClick={() => setEditingProduct(p)} className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl font-bold transition-all"><Edit size={14} /> এডিট</button>
                          <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1 text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl font-bold transition-all"><Trash2 size={14} /> ডিলিট</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ৩. কার্ট পেজ ভিউ */}
          {page === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 🔐 অ্যাডমিন সিক্রেট লক মোডাল */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl text-center">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border dark:border-slate-800 shadow-inner">
                <KeyRound size={26} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">মডারেটর সিকিউরিটি গেট</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-[240px] mx-auto">অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার সিক্রেট কোডটি প্রদান করুন।</p>
              
              <form onSubmit={handleAdminAccessSubmit} className="mt-5 space-y-3 text-left">
                <div className="relative flex items-center">
                  <input 
                    type={showPasswordText ? "text" : "password"} 
                    required
                    placeholder="সিক্রেট পাসওয়ার্ড দিন..." 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-3.5 pr-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button type="button" onClick={() => setShowPasswordText(!showPasswordText)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button type="button" onClick={() => setShowLockModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs uppercase">বন্ধ করুন</button>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-600 text-white dark:text-slate-950 font-black py-3 rounded-xl text-xs uppercase shadow-md">আনলক করুন</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 গ্লোয়িং প্রিমিয়াম ফুটার */}
      <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-900/60 bg-white/50 dark:bg-slate-900/20 py-6 text-center text-xs text-slate-400 font-medium backdrop-blur-md transition-colors">
        <div className="flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Khan Enterprise. Realized Luxury Architecture with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>by Yousuf</span>
        </div>
      </footer>
    </div>
  );
}