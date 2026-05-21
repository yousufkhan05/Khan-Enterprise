import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LayoutGrid, Sun, Moon, ShieldCheck, Heart, Settings, Edit, Trash2, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

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
    stock: 5,
    description: "অ্যামোলেড ডিসপ্লে, রিয়েল-টাইম হার্ট রেট ট্র্যাকিং, ব্লুটুথ কলিং সিস্টেম এবং ওয়াটারপ্রুফ বডি। প্রিমিয়াম মেটালিক ফিনিশিং এর সাথে একটি রাজকীয় গ্যাজেট।",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: []
  }
];

export default function App() {
  const [page, setPage] = useState('shop');
  const [adminTab, setAdminTab] = useState('add'); 
  const [editingProduct, setEditingProduct] = useState(null); 
  
  // 🔐 সিকিউরিটি স্টেটসমূহ
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // অ্যাডমিন লগইন আছে কিনা
  const [showLockModal, setShowLockModal] = useState(false); // পাসওয়ার্ড পপ-আপ দেখাবে কিনা
  const [adminPassword, setAdminPassword] = useState(''); // ইনপুট পাসওয়ার্ড
  const [showPasswordText, setShowPasswordText] = useState(false); // পাসওয়ার্ড হাইড/শো

  // 🔑 আপনার এবং মডারেটরদের জন্য সিক্রেট পাসওয়ার্ড (আপনি চাইলে এটি পরিবর্তন করতে পারেন)
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('khan_ent_dark_mode', darkMode);
  }, [darkMode]);

  // পাসওয়ার্ড ভেরিফিকেশন ফাংশন
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

  // অ্যাডমিন প্যানেল বাটনে ক্লিক হ্যান্ডেলার
  const handleAdminButtonClick = () => {
    if (isAdminLoggedIn) {
      setPage('admin');
      setAdminTab('add');
      setEditingProduct(null);
    } else {
      setShowLockModal(true); // লগইন না থাকলে পাসওয়ার্ড পপ-আপ লক স্ক্রিন আসবে
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

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 🌟 প্রিমিয়াম হেডার ٹপ বার */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          <div onClick={() => setPage('shop')} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="text-blue-600 dark:text-cyan-400">Enterprise</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">Premium Gadget Store</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button 
              onClick={() => setPage('shop')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'shop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">শপ</span>
            </button>

            {/* সিকিউরড অ্যাডমিন বাটন */}
            <button 
              onClick={handleAdminButtonClick}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                page === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lock size={14} className={isAdminLoggedIn ? "text-emerald-500" : "text-slate-400"} />
              <span className="hidden sm:inline">অ্যাডমিন</span>
            </button>

            <button 
              onClick={() => setPage('cart')}
              className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all relative ${
                page === 'cart' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <ShoppingBag size={16} /> 
              <span>কার্ট</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* 🌀 ডাইনামিক মেইন এরিয়া */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* ১. শপ ভিউ */}
          {page === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-slate-900/60 p-6 sm:p-10 rounded-3xl text-white border dark:border-slate-800">
                <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2">স্মার্ট গ্যাজেটের সেরা কালেকশন! 🔥</h2>
                <p className="text-xs sm:text-sm opacity-80 max-w-lg leading-relaxed font-medium">খান এন্টারপ্রাইজে আপনাকে স্বাগতম। আমাদের প্রতিটি পণ্যের সাথে পাচ্ছেন অফিসিয়াল ওয়ারেন্টি এবং ফাস্ট ক্যাশ অন ডেলিভারি সুবিধা।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} addReview={addReview} setPage={setPage} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ২. ডাইনামিক অ্যাডমিন প্যানেল ও লাইভ প্রোডাক্ট এডিটর */}
          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setAdminTab('add'); setEditingProduct(null); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${adminTab === 'add' && !editingProduct ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}
                  >
                    নতুন প্রোডাক্ট যোগ করুন
                  </button>
                  <button 
                    onClick={() => { setAdminTab('manage'); setEditingProduct(null); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${adminTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border dark:border-slate-800'}`}
                  >
                    প্রোডাক্ট ম্যানেজ ও এডিট করুন ({products.length})
                  </button>
                </div>
                {/* লগআউট বাটন এডমিন সিকিউরিটির জন্য */}
                <button 
                  onClick={() => { setIsAdminLoggedIn(false); setPage('shop'); }}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all"
                >
                  প্যানেল লক করুন (Logout)
                </button>
              </div>

              {adminTab === 'add' || editingProduct ? (
                <AdminPanel addProduct={addProduct} setPage={setPage} editingProduct={editingProduct} updateProduct={updateProduct} />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-1.5"><Settings size={18} /> স্টকের প্রোডাক্ট এডিট তালিকা</h3>
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
                          <button onClick={() => setEditingProduct(p)} className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl font-bold transition-colors"><Edit size={14} /> এডিট (Edit)</button>
                          <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1 text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl font-bold transition-colors"><Trash2 size={14} /> ডিলিট</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ৩. কার্ট ভিউ */}
          {page === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 🔐 অ্যাডমিন ও মডারেটর সিক্রেট লক স্ক্রিন পপ-আপ মোডাল */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl text-center"
            >
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
                    className="w-full p-3.5 pr-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                  />
                  {/* পাসওয়ার্ড শো/হাইড বাটন */}
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowLockModal(false)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs uppercase"
                  >
                    বন্ধ করুন
                  </button>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-black py-3 rounded-xl text-xs uppercase shadow-md shadow-blue-500/10"
                  >
                    আনলক করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-auto border-t dark:border-slate-900 bg-white dark:bg-slate-900/40 py-6 text-center text-xs text-slate-400 font-medium transition-colors">
        <div className="flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Khan Enterprise. Developed with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>by Yousuf</span>
        </div>
      </footer>
    </div>
  );
}