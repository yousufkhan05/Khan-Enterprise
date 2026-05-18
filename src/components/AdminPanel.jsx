import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Image, DollarSign, Type } from 'lucide-react';

export default function AdminPanel({ addProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !description) return alert('অনুগ্রহ করে ফর্মটি সম্পূর্ণ পূরণ করুন।');

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      description,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      reviews: []
    };

    addProduct(newProduct);
    alert('প্রোডাক্ট সফলভাবে অ্যাড হয়েছে!');
    
    // ফর্ম ক্লিয়ার করা
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <PlusCircle className="text-blue-500" /> অ্যাডমিন ড্যাশবোর্ড
        </h2>
        <p className="text-xs text-slate-400 mb-6">খান এন্টারপ্রাইজে নতুন প্রোডাক্ট যোগ করার অফিশিয়াল ফর্ম প্যানেল।</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Type size={14} /> প্রোডাক্টের নাম</label>
            <input type="text" required placeholder="যেমন: Premium Wireless Headphones" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign size={14} /> মূল্য (টাকা)</label>
            <input type="number" required placeholder="যেমন: 2500" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">বিস্তারিত বিবরণ (Description)</label>
            <textarea required placeholder="প্রোডাক্টের বিবরণ বা গুণাবলী এখানে লিখুন..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 h-28 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Image size={14} /> ছবির লিংক (Image URL)</label>
            <input type="url" placeholder="https://example.com/product.jpg" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none" />
            <p className="text-[10px] text-slate-400 mt-1">💡 আপনি ImgBB বা অন্য যেকোনো সাইটে ছবি আপলোড করে তার Direct Link এখানে দিতে পারেন। ফাঁকা রাখলে ডিফল্ট একটি ছবি সেট হবে।</p>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3.5 rounded-xl text-sm shadow-lg uppercase tracking-wider">
            স্টোরে প্রোডাক্ট যুক্ত করুন
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}