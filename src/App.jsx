import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';

const initialProducts = [
  { id: 1, name: "Smart Watch Series 9", price: 3500, description: "অ্যামোলেড ডিসপ্লে, রিয়েল টাইম হার্ট রেট এবং ব্লাড অক্সিজেন মনিটরিং ট্র্যাকার সহ ওয়াটারপ্রুফ স্মার্টওয়াচ।", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500", reviews: [] },
  { id: 2, name: "Wireless Bluetooth Earbuds", price: 1800, description: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) এবং একটানা ৩০ ঘণ্টা ব্যাকআপ ক্ষমতা সম্পন্ন প্রিমিয়াম ইয়ারবাডস।", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", reviews: [] }
];

function MainApp() {
  const { darkMode } = useTheme();
  const [page, setPage] = useState('shop'); 
  const [products, setProducts] = useState(() => {
    const localData = localStorage.getItem('khan_enterprise_products');
    return localData ? JSON.parse(localData) : initialProducts;
  });
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('khan_enterprise_cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('khan_enterprise_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('khan_enterprise_cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = (newProduct) => setProducts([...products, newProduct]);
  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);
  
  const addReview = (productId, review) => {
    setProducts(products.map(p => p.id === productId ? { ...p, reviews: [...p.reviews, review] } : p));
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden flex flex-col transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      
      {darkMode && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/5 via-indigo-500/0 to-transparent blur-3xl pointer-events-none z-0" />
      )}
      
      <Navbar cartCount={cart.length} setPage={setPage} currentPage={page} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
        {page === 'shop' && (
          <div>
            <div className="text-center mb-10 sm:mb-16">
              {/* text-slate-950 dark:text-white ব্যবহারের ফলে লাইট মোডে লেখা একদম কুচকুচে কালো ও স্পষ্ট দেখাবে */}
              <h1 className="text-3xl sm:text-6xl font-black tracking-tight uppercase text-slate-950 dark:text-white drop-shadow-sm">
                এক্সক্লুসিভ কালেকশন
              </h1>
              <p className="text-xs sm:text-base text-slate-600 dark:text-cyan-400 font-semibold tracking-wide mt-3 max-w-md mx-auto">
                খান এন্টারপ্রাইজের অরিজিনাল গ্যাজেট ও আধুনিক লাইফস্টাইল পণ্য সামগ্রী
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 mx-auto mt-4 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} addReview={addReview} />
              ))}
            </div>
          </div>
        )}

        {page === 'cart' && (
          <div className="w-full max-w-4xl mx-auto">
            <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} />
          </div>
        )}
        
        {page === 'admin' && (
          <div className="w-full max-w-3xl mx-auto">
            <AdminPanel addProduct={addProduct} setPage={setPage} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  return <MainApp />;
}