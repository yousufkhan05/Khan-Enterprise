import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Smartphone, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Cart({ cart, removeFromCart, clearCart, setPage }) {
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber || !trxId) return alert('অনুগ্রহ করে পেমেন্ট নম্বর এবং TrxID দিন।');
    
    const orderData = { id: Date.now(), items: cart, total: totalPrice, paymentMethod, phoneNumber, trxId };
    console.log("নতুন অর্ডার এসেছে:", orderData);
    
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border text-center border-slate-100 dark:border-slate-700">
        <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">অর্ডার সফল হয়েছে!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">আপনার অর্ডারটি "Khan Enterprise"-এ জমা হয়েছে। খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</p>
        <button onClick={() => setPage('shop')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm">শপিং চালিয়ে যান</button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* বাম পাশ: কার্ট আইটেম লিস্ট */}
      <div className="lg:col-span-2">
        <button onClick={() => setPage('shop')} className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-cyan-400 mb-4 hover:underline">
          <ArrowLeft size={16} /> শপ পেজে ফিরুন
        </button>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">আপনার শপিং কার্ট</h2>
        
        {cart.length === 0 ? (
          <p className="text-slate-500 bg-white dark:bg-slate-800 p-6 rounded-2xl border text-center dark:border-slate-700">আপনার কার্টটি একদম খালি!</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div key={index} layout className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-slate-100" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">{item.name}</h4>
                  <span className="text-blue-600 dark:text-cyan-400 font-black text-sm">৳ {item.price}</span>
                </div>
                <button onClick={() => removeFromCart(index)} className="text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ডান পাশ: বিকাশ/নগদ পেমেন্ট ও সামারি */}
      {cart.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl h-fit">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">অর্ডার সামারি</h3>
          <div className="flex justify-between font-bold text-base text-slate-700 dark:text-slate-300 mb-6">
            <span>সর্বমোট মূল্য:</span>
            <span className="text-xl font-black text-blue-600 dark:text-cyan-400">৳ {totalPrice}</span>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4 border-t pt-4 border-slate-100 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">পেমেন্ট মেথড</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                <Smartphone size={16} /> bKash
              </button>
              <button type="button" onClick={() => setPaymentMethod('nagad')} className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                <Smartphone size={16} /> Nagad
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-xs border dark:border-slate-700 text-slate-600 dark:text-slate-400 leading-relaxed">
              👉 আপনার ফোনে মেথড সিলেক্ট করে আমাদের পার্সোনাল নাম্বারে (<strong>01771183608</strong>) <strong>৳{totalPrice}</strong> Send Money করুন। এরপর নিচের বক্সে তথ্য দিন।
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
              <input type="tel" required placeholder="017XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">Transaction ID (TxID)</label>
              <input type="text" required placeholder="AX78K92L" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none" />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3 rounded-xl text-sm shadow-md uppercase tracking-wider">
              অর্ডার প্লেস করুন
            </motion.button>
          </form>
        </div>
      )}
    </div>
  );
}