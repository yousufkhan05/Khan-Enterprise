import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';

// শুরুর ডেমো প্রোডাক্ট ডেটা (যদি লোকাল স্টোরেজে কিছু না থাকে)
const initialProducts = [
  { id: 1, name: "Smart Watch Series 9", price: 3500, description: "অ্যামোলেড ডিসপ্লে, রিয়েল টাইম হার্ট রেট এবং ব্লাড অক্সিজেন মনিটরিং ট্র্যাকার সহ ওয়াটারপ্রুফ স্মার্টওয়াচ।", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500", reviews: [] },
  { id: 2, name: "Wireless Bluetooth Earbuds", price: 1800, description: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) এবং একটানা ৩০ ঘণ্টা ব্যাকআপ ক্ষমতা সম্পন্ন প্রিমিয়াম ইয়ারবাডস।", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", reviews: [] }
];

function MainApp() {
  const { darkMode } = useTheme();
  const [page, setPage] = useState('shop'); // পেজ স্টেট: 'shop', 'cart', 'admin'
  const [products, setProducts] = useState(() => {
    const localData = localStorage.getItem('khan_enterprise_products');
    return localData ? JSON.parse(localData) : initialProducts;
  });
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('khan_enterprise_cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  // প্রোডাক্ট ডেটা লোকাল স্টোরেজে সেভ রাখা
  useEffect(() => {
    localStorage.setItem('khan_enterprise_products', JSON.stringify(products));
  }, [products]);

  // কার্ট ডেটা লোকাল স্টোরেজে সেভ রাখা
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
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'animated-bg-dark text-white' : 'animated-bg text-slate-900'}`}>
      
      {/* নেভিগেশন বার */}
      <Navbar cartCount={cart.length} setPage={setPage} currentPage={page} />
      
      {/* মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {page === 'shop' && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase drop-shadow-sm">আমাদের এক্সক্লুসিভ কালেকশন</h1>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">খান এন্টারপ্রাইজের অরিজিনাল গ্যাজেট ও লাইফস্টাইল পণ্য সামগ্রী</p>
            </div>
            
            {/* প্রোডাক্ট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} addReview={addReview} />
              ))}
            </div>
          </div>
        )}

        {page === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} setPage={setPage} />}
        {page === 'admin' && <AdminPanel addProduct={addProduct} />}
      </main>

      {/* ফুটার */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}