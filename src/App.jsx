import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LayoutGrid, Sun, Moon, ShieldCheck, Lock, KeyRound } from 'lucide-react';

const defaultSlides = [
  { id: 1, title: "The Future of Smart Gadgets Now in Your Hands", subtitle: "Exclusive Collection from Khan Enterprise", badge: "MEGA EID SALE 🔥" },
  { id: 2, title: "Premium Audio Experience, Zero Noise!", subtitle: "Flat 30% Off on Wireless Headphones Collection", badge: "LIMITED OFFER ⚡" },
  { id: 3, title: "Smart Lifestyle, Intelligent Tracking", subtitle: "Get Guaranteed Cashback on Genuine Smartwatches", badge: "100% GENUINE PRODUCT 🛡️" }
];

const initialProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro",
    originalPrice: 4500,
    price: 3200,
    stock: 100,
    category: "Headphone",
    description: "High-resolution audio, 4 noise cancellation microphones, and continuous 40 hours of mega battery life.",
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
    description: "AMOLED display, real-time heart rate tracking, Bluetooth calling system, and waterproof body.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: []
  }
];

export default function App() {
  const [page, setPage] = useState('shop');
  const [adminTab, setAdminTab] = useState('orders'); 
  const [editingProduct, setEditingProduct] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [currentSlide, setCurrentSlide] = useState(0); 
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); 
  const [showLockModal, setShowLockModal] = useState(false); 
  const [adminPassword, setAdminPassword] = useState(''); 
  
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('khan_enterprise_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

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
  const [heroSlides, setHeroSlides] = useState(() => {
    const savedSlides = localStorage.getItem('khan_enterprise_slides');
    return savedSlides ? JSON.parse(savedSlides) : defaultSlides;
  });

  useEffect(() => {
    if (page !== 'shop' || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [page, heroSlides]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('khan_ent_dark_mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('khan_enterprise_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('khan_enterprise_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  const handleAdminAccessSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === SECRET_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLockModal(false);
      setPage('admin');
      setAdminTab('orders'); 
      setAdminPassword('');
    } else {
      alert('🚫 Invalid Password!');
      setAdminPassword('');
    }
  };

  const handleAdminButtonClick = () => {
    if (isAdminLoggedIn) {
      setPage('admin');
      setAdminTab('orders');
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
    alert('Product details updated successfully!');
  };

  const deleteProduct = (id) => {
    if(window.confirm("Delete this product permanently?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('khan_enterprise_products', JSON.stringify(updated));
    }
  };

  const updateOrderStatus = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const updated = orders.map(order => order.orderId === orderId ? { ...order, status: nextStatus } : order);
    setOrders(updated);
  };

  const deleteOrder = (orderId) => {
    if(window.confirm("Delete this order?")) {
      setOrders(orders.filter(order => order.orderId !== orderId));
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

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory || (selectedCategory === 'Smartwatch' && p.name.toLowerCase().includes('watch')) || (selectedCategory === 'Headphone' && p.name.toLowerCase().includes('headphone')));

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    } relative overflow-x-hidden pt-[76px]`}>
      
      {/* 👑 লাখ টাকার প্রফেশনাল হেডার (কোনো ওভারল্যাপিং বা জ্যাম ছাড়া মোবাইল ও পিসিতে ফিক্সড গ্রিড) */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo Container */}
          <div onClick={() => setPage('shop')} className="flex items-center gap-2 cursor-pointer select-none group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
              <ShieldCheck size={18} />
            </div>
            <span className="text-sm sm:text-base font-black tracking-tight uppercase text-slate-900 dark:text-white">
              Khan <span className="text-blue-600 dark:text-cyan-400">Enterprise</span>
            </span>
          </div>

          {/* Navigation Controls Wrapper (মোবাইল ফ্রেন্ডলি সাইজিং লকড) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => setPage('shop')} className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${page === 'shop' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <LayoutGrid size={13} /> <span className="hidden sm:inline">Shop</span>
            </button>
            
            <button onClick={handleAdminButtonClick} className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${page === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <Lock size={12} /> <span className="hidden sm:inline">Admin</span>
            </button>
            
            <button onClick={() => setPage('cart')} className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 relative transition-all cursor-pointer ${page === 'cart' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
              <ShoppingBag size={13} /> <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 ? (
                <span className="bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cart.length}
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-[10px]">0</span>
              )}
            </button>

            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-0.5" />

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer hover:scale-105">
              {darkMode ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
            </button>
          </div>

        </div>
      </header>

      {/* 🌀 Dynamic Flow Body Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 w-full">
        <AnimatePresence mode="wait">
          {page === 'shop' && (
            <motion.div key="shop-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Premium Carousel Slider Container */}
              {heroSlides.length > 0 && (
                <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-10 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 opacity-100" />
                  <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} transition={{ duration: 0.2 }} className="z-10 relative">
                      <span className="px-2.5 py-0.5 bg-blue-600/10 text-blue-600 dark:bg-blue-400/20 dark:text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-wider mb-2 border border-blue-500/20 inline-block">{heroSlides[currentSlide].badge}</span>
                      <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-tight max-w-xl">{heroSlides[currentSlide].title}</h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{heroSlides[currentSlide].subtitle}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute bottom-3 right-6 flex gap-1 z-20">
                    {heroSlides.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 transition-all rounded-full ${idx === currentSlide ? 'w-4 bg-blue-600 dark:bg-cyan-400' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Smartwatch', 'Headphone'].map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-xs font-black rounded-xl border cursor-pointer transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>{cat === 'All' ? '🎯 All Collection' : cat === 'Smartwatch' ? '⌚ Smartwatch' : '🎧 Headphone'}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} addReview={addReview} setPage={setPage} />)}
              </div>
            </motion.div>
          )}

          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <AdminPanel products={products} setProducts={setProducts} addProduct={addProduct} updateProduct={updateProduct} editingProduct={editingProduct} setPage={setPage} orders={orders} setOrders={setOrders} adminTab={adminTab} setAdminTab={setAdminTab} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} setEditingProduct={setEditingProduct} deleteProduct={deleteProduct} heroSlides={heroSlides} setHeroSlides={setHeroSlides} />
            </motion.div>
          )}

          {page === 'cart' && (
            <motion.div key="cart-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 👑 লাক্সারি মিনিমাল ফুটার (স্ক্রিনের একদম নিচে আঠারো মতো স্টিকি লকড থাকবে) */}
      <footer className="w-full border-t border-slate-200/60 dark:border-slate-900/60 bg-white dark:bg-slate-900/30 py-5 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-auto transition-colors">
        © {new Date().getFullYear()} Khan Enterprise. All Rights Reserved. Realized Architecture by Yousuf
      </footer>

      {/* Security Admin Password Modal Sheet Gate */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-xl text-center border-slate-200 dark:border-slate-800">
              <div className="w-12 h-14 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3"><KeyRound size={22} /></div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Moderator Access</h3>
              <form onSubmit={handleAdminAccessSubmit} className="mt-4 space-y-3">
                <input type="text" style={{ WebkitTextSecurity: 'disc' }} required placeholder="Enter Password..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 text-xs rounded-xl border bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white border-slate-300 dark:border-slate-800 text-center font-mono focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setShowLockModal(false)} className="bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Close</button>
                  <button type="submit" className="bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer">Unlock</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}