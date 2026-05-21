import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Smartphone, CheckCircle, ArrowLeft, Truck, User, MapPin, MessageSquare, ShoppingBag } from 'lucide-react';

export default function Cart({ cart, removeFromCart, clearCart, setPage, products, setProducts, orders, setOrders }) {
  // কাস্টমার ইনফো স্টেট
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  
  // পেমেন্ট স্টেট
  const [paymentMethod, setPaymentMethod] = useState('cod'); // ডিফল্ট ক্যাশ অন ডেলিভারি
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  // মোট মূল্য হিসাব
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = totalPrice > 0 ? (district === 'Dhaka' ? 60 : 120) : 0;
  const finalAmount = totalPrice + deliveryCharge;

  const handleCheckout = (e) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!customerName || !phoneNumber || !district || !fullAddress) {
      return alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর, জেলা এবং সম্পূর্ণ ঠিকানা সঠিকভাবে দিন।');
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!senderNumber || !trxId)) {
      return alert('ডিজিটাল পেমেন্টের জন্য অনুগ্রহ করে প্রেরক নম্বর এবং TrxID প্রদান করুন।');
    }

    // 🚀 ১. লাইভ স্টক কমানোর লজিক (Inventory Update)
    if (setProducts && products) {
      const updatedProducts = products.map(product => {
        const itemsInCart = cart.filter(item => item.id === product.id).length;
        if (itemsInCart > 0) {
          const currentStock = product.stock !== undefined ? product.stock : 100;
          const newStock = Math.max(0, currentStock - itemsInCart);
          return { ...product, stock: newStock };
        }
        return product;
      });
      
      setProducts(updatedProducts);
      localStorage.setItem('khan_enterprise_products', JSON.stringify(updatedProducts));
    }

    // 📦 ২. অর্ডার ডাটা অবজেক্ট তৈরি
    const newOrder = {
      orderId: Date.now(),
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })), // প্রোডাক্টের সংক্ষিপ্ত ডাটা
      subTotal: totalPrice,
      deliveryCharge,
      grandTotal: finalAmount,
      status: 'Pending', // ডিফল্ট স্ট্যাটাস পেন্ডিং থাকবে
      customer: {
        name: customerName,
        phone: phoneNumber,
        whatsapp: whatsappNumber || phoneNumber,
        district,
        address: fullAddress
      },
      payment: {
        method: paymentMethod,
        sender: paymentMethod !== 'cod' ? senderNumber : 'N/A',
        trxId: paymentMethod !== 'cod' ? trxId : 'N/A'
      },
      date: new Date().toLocaleDateString()
    };

    // 🎯 ৩. মডারেটর ড্যাশবোর্ডের জন্য গ্লোবাল অর্ডারে পুশ করা
    if (setOrders && orders) {
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('khan_enterprise_orders', JSON.stringify(updatedOrders));
    }

    console.log("Khan Enterprise - নতুন অর্ডার মডারেটর ড্যাশবোর্ডে পাঠানো হয়েছে:", newOrder);
    
    setIsOrdered(true);
    clearCart(); // অর্ডার শেষে কার্ট খালি করা
  };

  // অর্ডার সফল হলে দেখানোর স্ক্রিন
  if (isOrdered) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border text-center border-slate-200/60 dark:border-slate-800"
      >
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={48} className="animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">অর্ডারটি সফল হয়েছে! 🎉</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          আপনার অর্ডারটি <span className="font-bold text-blue-600 dark:text-cyan-400">Khan Enterprise</span> স্টোরে নথিভুক্ত করা হয়েছে। আমাদের প্রতিনিধি কিছুক্ষণের মধ্যে কল করে অর্ডারটি কনফার্ম করবেন।
        </p>
        
        <button 
          onClick={() => setPage('shop')} 
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-lg hover:opacity-90 transition-all"
        >
          আরো শপিং করুন
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-12">
      
      {/* বাম পাশ: কার্ট রিভিউ এলিমেন্টস */}
      <div className="lg:col-span-7">
        <button 
          onClick={() => setPage('shop')} 
          className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400 mb-5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft size={14} /> শপ কালেকশনে ফিরুন
        </button>
        
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
          <ShoppingBag size={22} className="text-blue-600 dark:text-cyan-400" /> আপনার শপিং কার্ট ({cart.length})
        </h2>
        
        {cart.length === 0 ? (
          <div className="text-slate-500 bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-medium">আপনার কার্টটি একদম খালি! কোনো পণ্য পছন্দ হলে যুক্ত করুন।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div 
                key={index} 
                layout 
                className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all"
              >
                <img src={item.images?.[0] || item.image} alt={item.name} className="w-16 h-16 object-contain rounded-xl bg-slate-50 dark:bg-slate-950 p-1 border dark:border-slate-800" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-1">{item.name}</h4>
                  <span className="text-slate-900 dark:text-cyan-400 font-black text-sm block mt-0.5">৳ {item.price}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(index)} 
                  className="text-rose-500 p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ডান পাশ: দারাজ স্টাইল প্রফেশনাল মাল্টি-স্টেপ চেকআউট ফর্ম */}
      {cart.length > 0 && (
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800">
              <Truck size={18} className="text-blue-500" /> শিপিং ও পেমেন্ট বিবরণী
            </h3>

            <form onSubmit={handleCheckout} className="space-y-4">
              
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><User size={12} /> আপনার সম্পূর্ণ নাম</label>
                <input type="text" required placeholder="যেমন: মো: ইউসুফ খান" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">📱 সচল মোবাইল নম্বর</label>
                  <input type="tel" required placeholder="01XXXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><MessageSquare size={12} /> হোয়াটসঅ্যাপ নম্বর</label>
                  <input type="tel" placeholder="01XXXXXXXXX (ঐচ্ছিক)" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin size={12} /> জেলা নির্বাচন করুন</label>
                <select required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                  <option value="">-- জেলা সিলেক্ট করুন --</option>
                  <option value="Dhaka">ঢাকা (ঢাকার ভিতরে ডেলিভারি 80৳)</option>
                  <option value="Outside">ঢাকার বাইরে (অন্যান্য জেলা 120৳)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">সম্পূর্ণ ঠিকানা (গ্রাম, থানা, রোড, বাসা নং)</label>
                <textarea required placeholder="আপনার পণ্যটি যে ঠিকানায় ডেলিভারি করা হবে তা বিস্তারিত লিখুন..." value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-3 h-16 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none resize-none" />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">পেমেন্ট মেথড সিলেক্ট করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-2.5 rounded-xl border text-[11px] sm:text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Truck size={14} /> Cash on Delivery
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-2