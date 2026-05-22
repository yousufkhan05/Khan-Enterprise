import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LayoutGrid, Sun, Moon, ShieldCheck, Heart, Settings, Edit, Trash2, Lock, KeyRound, Eye, EyeOff, Truck, RefreshCw, Headphones, Layers, ClipboardList } from 'lucide-react';

// ডিফল্ট ৩টি প্রিমিয়াম ব্যানার (যা প্রথমবার লোড হবে)
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
  const [showPasswordText, setShowPasswordText] = useState(false); 
  
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

  // 🎠 লাইভ ব্যানার স্লিডার স্টেট (অ্যাডমিন প্যানেল থেকে অ্যাড/রিমুভ করার জন্য)
  const [heroSlides, setHeroSlides] = useState(() => {
    const savedSlides = localStorage.getItem('khan_enterprise_slides');
    return savedSlides ? JSON.parse(savedSlides) : defaultSlides;
  });

  // স্লাইডার অটো-প্লে মেকানিজম (ব্যানার পরিবর্তন হবে যদি ব্যানার থাকে)
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

  // ব্যানার ডাটা লোকাল স্টোরেজে সিঙ্ক করা
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
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${
      darkMode ? 'bg-[rgba(7,11,23,1)] text-slate-100' : 'bg-slate-50 text-slate-900'
    } relative overflow-x-hidden pt-[140px] sm:pt-[80px]`}>
      
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
        </>
      )}
      
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div onClick={() => setPage('shop')} className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="text-blue-600 dark:text-cyan-400">Enterprise</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
            <button onClick={() => setPage('shop')} className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${page === 'shop' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}><LayoutGrid size={14} /> <span>Shop</span></button>
            <button onClick={handleAdminButtonClick} className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${page === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}><Lock size={13} className={isAdminLoggedIn ? "text-emerald-400" : ""} /> <span>Admin</span></button>
            <button onClick={() => setPage('cart')} className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 relative transition-all cursor-pointer ${page === 'cart' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}><ShoppingBag size={14} /> <span>Cart</span>{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}</button>
            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer">{darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}</button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-4 z-10 w-full">
        <AnimatePresence mode="wait">
          
          {page === 'shop' && (
            <motion.div key="shop-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* 🎠 আল্ট্রা-লাক্সারি গ্লাস মরফিজম স্লাইডার (ডার্ক ও লাইট মোডে রি-ডিজাইন করা হয়েছে) */}
              {heroSlides.length > 0 && (
                <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800/80 bg-gradient-to-tr from-slate-100 to-white dark:from-slate-900 dark:to-slate-950">
                  {/* ডার্ক মোডে লাক্সারি গ্লো ও ওশেন ব্যাকগ্রাউন্ড ইফেক্ট */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent dark:from-blue-500/20 dark:via-transparent opacity-80" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentSlide} 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }} 
                      transition={{ duration: 0.4 }} 
                      className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center z-10 text-left"
                    >
                      <span className="w-fit px-2.5 py-0.5 bg-blue-600/10 text-blue-600 dark:bg-blue-400/20 dark:text-cyan-400 text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-wider mb-2 border border-blue-500/20">
                        {heroSlides[currentSlide].badge || "SPECIAL OFfER ⚡"}
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black max-w-xl leading-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        {heroSlides[currentSlide].title}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium max-w-md">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* স্লাইড ইন্ডিকেটর ডটস */}
                  <div className="absolute bottom-3 right-6 flex gap-1 z-20">
                    {heroSlides.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 rounded-full transition-all ${idx === currentSlide ? 'w-4 bg-blue-600 dark:bg-cyan-400' : 'w-1 bg-slate-300 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Smartwatch', 'Headphone'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${selectedCategory === cat ? 'bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-950 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>{cat === 'All' ? '🎯 All Collection' : cat === 'Smartwatch' ? '⌚ Smartwatch' : '🎧 Headphone'}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} addReview={addReview} setPage={setPage} />)}
              </div>
            </motion.div>
          )}

          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <AdminPanel products={products} setProducts={setProducts} addProduct={addProduct} updateProduct={updateProduct} editingProduct={editingProduct} setPage={setPage} orders={orders} setOrders={setOrders} adminTab={adminTab} setAdminTab={setAdminTab} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} setEditingProduct={setEditingProduct} deleteProduct={deleteProduct} heroSlides={heroSlides} setHeroSlides={setHeroSlides} />
            </motion.div>
          )}

          {page === 'cart' && (
            <motion.div key="cart-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-xl text-center border-slate-200 dark:border-slate-800">
              <div className="w-12 h-14 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3"><KeyRound size={22} /></div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Moderator Security Access</h3>
              <form onSubmit={handleAdminAccessSubmit} className="mt-4 space-y-3">
                <input type="text" style={{ WebkitTextSecurity: 'disc' }} required placeholder="Enter Secret Password..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 text-xs rounded-xl border bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white border-slate-300 dark:border-slate-800 text-center font-mono focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setShowLockModal(false)} className="bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Close</button>
                  <button type="submit" className="bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-md">Unlock</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full border-t border-slate-200/40 dark:border-slate-900 bg-white/50 dark:bg-slate-900/20 py-4.5 text-center text-[10px] text-slate-400 backdrop-blur-md mt-auto">
        © {new Date().getFullYear()} Khan Enterprise. All Rights Reserved. Developed by Yousuf
      </footer>
    </div>
  );
}