import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LayoutGrid, Sun, Moon, ShieldCheck, Heart, Settings, Edit, Trash2, Lock, KeyRound, Eye, EyeOff, Truck, RefreshCw, Headphones, Layers, ClipboardList } from 'lucide-react';

const initialProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro",
    originalPrice: 4500,
    price: 3200,
    stock: 100,
    category: "Headphone",
    description: "High-resolution audio, 4 noise cancellation microphones, and continuous 40 hours of mega battery life. Perfect choice for gamers and music lovers.",
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
    description: "AMOLED display, real-time heart rate tracking, Bluetooth calling system, and waterproof body. A royal gadget with premium metallic finishing.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    reviews: []
  }
];

const heroSlides = [
  {
    title: "The Future of Smart Gadgets Now in Your Hands",
    subtitle: "Exclusive Collection from Khan Enterprise",
    bg: "from-blue-600 to-indigo-800 dark:from-slate-900 dark:to-slate-950",
    badge: "MEGA EID SALE 🔥"
  },
  {
    title: "Premium Audio Experience, Zero Noise!",
    subtitle: "Flat 30% Off on Wireless Headphones Collection",
    bg: "from-purple-600 to-pink-700 dark:from-slate-900 dark:to-slate-900",
    badge: "LIMITED OFFER ⚡"
  },
  {
    title: "Smart Lifestyle, Intelligent Tracking",
    subtitle: "Get Guaranteed Cashback on Genuine Smartwatches",
    bg: "from-cyan-600 to-teal-700 dark:from-slate-950 dark:to-slate-900",
    badge: "100% GENUINE PRODUCT 🛡️"
  }
];

export default function App() {
  const [page, setPage] = useState('shop');
  const [adminTab, setAdminTab] = useState('add'); 
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

  useEffect(() => {
    localStorage.setItem('khan_enterprise_orders', JSON.stringify(orders));
  }, [orders]);

  const handleAdminAccessSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === SECRET_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLockModal(false);
      setPage('admin');
      setAdminTab('add'); // অ্যাডমিন লগইন করার পর প্রথম ট্যাব দেখাবে
      setEditingProduct(null);
      setAdminPassword('');
    } else {
      alert('🚫 Invalid Password! You are not an authorized moderator.');
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
    alert('Product details have been successfully updated!');
  };

  const deleteProduct = (id) => {
    if(window.confirm("Are you sure you want to permanently delete this product?")) {
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
    if(window.confirm("Do you want to delete this order from the dashboard?")) {
      const updated = orders.filter(order => order.orderId !== orderId);
      setOrders(updated);
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
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      darkMode ? 'bg-[rgba(7,11,23,1)] text-slate-100' : 'bg-slate-50 text-slate-900'
    } relative`}>
      
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none z-0" />
        </>
      )}
      
      {/* 🌟 Navigation Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/60 shadow-md transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          <div onClick={() => setPage('shop')} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Enterprise</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase -mt-0.5">Premium Gadget Store</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={() => setPage('shop')} className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${page === 'shop' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
              <LayoutGrid size={15} /> <span className="hidden sm:inline">Shop</span>
            </button>

            <button onClick={handleAdminButtonClick} className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${page === 'admin' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
              <Lock size={14} className={isAdminLoggedIn ? "text-emerald-400" : "text-slate-400"} />
              <span className="hidden sm:inline">Admin</span>
            </button>

            <button onClick={() => setPage('cart')} className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all relative ${page === 'cart' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:opacity-90'}`}>
              <ShoppingBag size={15} /> 
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:scale-105 transition-all">
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* 🌀 Main Display Area */}
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-6 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* 1. SHOP FRONT VIEW */}
          {page === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
              <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl border border-slate-200/30 dark:border-slate-800/50">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].bg} p-6 sm:p-10 flex flex-col justify-center text-white`}>
                    <span className="w-fit px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-black rounded-full uppercase mb-2.5 sm:mb-4 border border-white/10">{heroSlides[currentSlide].badge}</span>
                    <h2 className="text-lg sm:text-3xl font-black max-w-xl leading-snug">{heroSlides[currentSlide].title}</h2>
                    <p className="text-[11px] sm:text-sm opacity-80 mt-1 sm:mt-2 font-medium max-w-md">{heroSlides[currentSlide].subtitle}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white dark:bg-slate-900/40 p-2 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm"><div className="p-2 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl"><Truck size={16} /></div><div><h4 className="text-[10px] sm:text-xs font-black">Fast Delivery</h4></div></div>
                <div className="bg-white dark:bg-slate-900/40 p-2 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm"><div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl"><RefreshCw size={16} /></div><div><h4 className="text-[10px] sm:text-xs font-black">7-Day Return</h4></div></div>
                <div className="bg-white dark:bg-slate-900/40 p-2 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 flex items-center gap-2 sm:gap-3 shadow-sm"><div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl"><Headphones size={16} /></div><div><h4 className="text-[10px] sm:text-xs font-black">24/7 Support</h4></div></div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2"><h3 className="text-sm sm:text-base font-black flex items-center gap-1.5"><Layers size={16} className="text-blue-600 dark:text-cyan-400" /> Explore Categories</h3><span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-bold">{filteredProducts.length} Items</span></div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Smartwatch', 'Headphone'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${selectedCategory === cat ? 'bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-950 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>{cat === 'All' ? '🎯 All Collection' : cat === 'Smartwatch' ? '⌚ Smartwatch' : '🎧 Headphone'}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} addReview={addReview} setPage={setPage} />
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. ADMIN MODERATOR EXECUTIVE VIEW */}
          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* 🛠️ আপডেটেড ৪টি ডাইনামিক সাব-ট্যাব বাটন কন্ট্রোল (হাই কনট্রাস্ট মোবাইল ফিক্সড কালার লেয়ার) */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button 
                  onClick={() => { setAdminTab('add'); setEditingProduct(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    adminTab === 'add' && !editingProduct 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Add New Product
                </button>

                <button 
                  onClick={() => { setAdminTab('manage'); setEditingProduct(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    adminTab === 'manage' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Manage Products ({products.length})
                </button>

                <button 
                  onClick={() => { setAdminTab('orders'); setEditingProduct(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    adminTab === 'orders' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                      : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Incoming Orders ({orders.length})
                </button>

                {/* 🔥 নতুন এন্টারপ্রাইজ মেগা বাটন: অ্যানালিটিক্স গ্রাফ চার্ট */}
                <button 
                  onClick={() => { setAdminTab('analytics'); setEditingProduct(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    adminTab === 'analytics' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                      : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Analytics & Reports 📈
                </button>
              </div>

              {/* সাব-ট্যাব কনটেন্ট লজিক গেট */}
              <div className="w-full">
                <button onClick={() => { setIsAdminLoggedIn(false); setPage('shop'); }} className="mb-4 px-3 py-1.5 text-xs font-bold rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all block cursor-pointer">Logout (Lock Panel)</button>
                
                {adminTab === 'add' || editingProduct ? (
                  <AdminPanel addProduct={addProduct} setPage={setPage} editingProduct={editingProduct} updateProduct={updateProduct} orders={orders} setOrders={setOrders} adminTab={adminTab} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />
                ) : adminTab === 'manage' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 shadow-xl">
                    <h3 className="text-lg font-black mb-4 flex items-center gap-1.5"><Settings size={18} /> Inventory Stock Controller</h3>
                    <div className="space-y-3">
                      {products.map(p => (
                        <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || p.image} alt="" className="w-12 h-12 object-contain bg-white dark:bg-slate-900 p-1 rounded-xl border dark:border-slate-800" />
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{p.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">Price: ৳{p.price} | Stock: {p.stock} pcs</p>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button onClick={() => setEditingProduct(p)} className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-2 rounded-xl font-bold cursor-pointer">Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1 text-xs bg-rose-500 text-white px-3 py-2 rounded-xl font-bold cursor-pointer">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AdminPanel addProduct={addProduct} setPage={setPage} editingProduct={editingProduct} updateProduct={updateProduct} orders={orders} setOrders={setOrders} adminTab={adminTab} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />
                )}
              </div>
            </motion.div>
          )}

          {/* 3. SHOPPING CART VIEW */}
          {page === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 🔐 Moderator Secure Gate Popup */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-2xl text-center border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4"><KeyRound size={26} /></div>
              <h3 className="text-lg font-black">Moderator Security Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please enter your secret password to unlock the admin panel.</p>
              
              <form onSubmit={handleAdminAccessSubmit} className="mt-5 space-y-3 text-left">
                <div className="relative flex items-center">
                  <input type={showPasswordText ? "text" : "password"} required placeholder="Enter Secret Code..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3.5 pr-11 text-xs rounded-xl border dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500" />
                  <button type="button" onClick={() => setShowPasswordText(!showPasswordText)} className="absolute right-3.5 text-slate-400">{showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button type="button" onClick={() => setShowLockModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer">Close</button>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-600 text-white dark:text-slate-950 font-black py-3 rounded-xl text-xs uppercase shadow-md cursor-pointer">Unlock Panel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full border-t bg-white/50 dark:bg-slate-900/20 py-6 text-center text-xs text-slate-400 font-medium backdrop-blur-md relative z-10">
        <div className="flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Khan Enterprise. All Rights Reserved. Developed with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>by Yousuf</span>
        </div>
      </footer>
    </div>
  );
}