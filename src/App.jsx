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

const heroSlides = [
  { title: "The Future of Smart Gadgets Now in Your Hands", subtitle: "Exclusive Collection from Khan Enterprise", bg: "from-blue-600 to-indigo-800 dark:from-slate-900 dark:to-slate-950", badge: "MEGA EID SALE 🔥" },
  { title: "Premium Audio Experience, Zero Noise!", subtitle: "Flat 30% Off on Wireless Headphones Collection", bg: "from-purple-600 to-pink-700 dark:from-slate-900 dark:to-slate-900", badge: "LIMITED OFFER ⚡" },
  { title: "Smart Lifestyle, Intelligent Tracking", subtitle: "Get Guaranteed Cashback on Genuine Smartwatches", bg: "from-cyan-600 to-teal-700 dark:from-slate-950 dark:to-slate-900", badge: "100% GENUINE PRODUCT 🛡️" }
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
      setAdminTab('orders'); // লগইন করার পর সরাসরি লাইভ অর্ডার ড্যাশবোর্ডে নিয়ে যাবে
      setAdminPassword('');
    } else {
      alert('🚫 Invalid Password!');
      setAdminPassword('');
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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${
      darkMode ? 'bg-[rgba(7,11,23,1)] text-slate-100' : 'bg-slate-50 text-slate-900'
    } relative overflow-x-hidden`}>
      
      {/* 🌟 Mobile-Responsive Header (Flex-wrap fixed) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div onClick={() => setPage('shop')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Khan <span className="text-blue-600 dark:text-cyan-400">Enterprise</span>
              </h1>
            </div>
          </div>

          {/* Navigation Controls Wrapper */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button onClick={() => setPage('shop')} className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${page === 'shop' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <LayoutGrid size={14} /> <span>Shop</span>
            </button>

            <button onClick={handleAdminButtonClick} className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${page === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <Lock size={13} /> <span>Admin</span>
            </button>

            <button onClick={() => setPage('cart')} className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 relative ${page === 'cart' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
              <ShoppingBag size={14} /> <span>Cart</span>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">
              {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* 🌀 Main Dynamic Body */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 z-10 w-full">
        <AnimatePresence mode="wait">
          {page === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Premium Slider Banner */}
              <div className="relative h-40 sm:h-56 rounded-3xl overflow-hidden shadow-md">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].bg} p-6 flex flex-col justify-center text-white`}>
                    <h2 className="text-base sm:text-2xl font-black max-w-md">{heroSlides[currentSlide].title}</h2>
                    <p className="text-[10px] sm:text-xs opacity-80 mt-1">{heroSlides[currentSlide].subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} addReview={addReview} setPage={setPage} />)}
              </div>
            </motion.div>
          )}

          {page === 'admin' && isAdminLoggedIn && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <AdminPanel products={products} setProducts={setProducts} addProduct={addProduct} updateProduct={updateProduct} editingProduct={editingProduct} setPage={setPage} orders={orders} setOrders={setOrders} adminTab={adminTab} setAdminTab={setAdminTab} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} setEditingProduct={setEditingProduct} deleteProduct={deleteProduct} />
            </motion.div>
          )}

          {page === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🔐 Gatekeeper Access Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-xl text-center">
            <h3 className="text-sm font-black">Moderator Security Code</h3>
            <form onSubmit={handleAdminAccessSubmit} className="mt-4 space-y-3">
              <input type="password" required placeholder="Enter Secret Code..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 text-xs rounded-xl border bg-transparent text-center font-mono" />
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setShowLockModal(false)} className="bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl text-xs font-bold">Close</button>
                <button type="submit" className="bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 Absolute Sticky Footer Fix */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-900 bg-white/50 dark:bg-slate-900/20 py-4 text-center text-[10px] text-slate-400 backdrop-blur-md">
        © {new Date().getFullYear()} Khan Enterprise. All Rights Reserved. Developed by Yousuf
      </footer>
    </div>
  );
}