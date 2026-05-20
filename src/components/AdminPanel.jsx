import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Image, DollarSign, Type, Package, Trash2, Plus, ArrowLeft } from 'lucide-react';

export default function AdminPanel({ addProduct, setPage }) {
  const [name, setName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('100'); // ডিফল্ট স্টক ১০০
  const [description, setDescription] = useState('');
  
  // একাধিক ছবির লিংকের জন্য অ্যারে স্টেট (শুরুতে ১টি খালি ইনপুট থাকবে)
  const [images, setImages] = useState(['']);

  // নতুন ছবির ইনপুট বক্স যোগ করার ফাংশন
  const handleAddImageField = () => {
    setImages([...images, '']);
  };

  // নির্দিষ্ট ইনপুট বক্সের লিংক আপডেট করার ফাংশন
  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  // ছবির ইনপুট বক্স মুছে ফেলার ফাংশন
  const handleRemoveImageField = (index) => {
    if (images.length === 1) return; // কমপক্ষে ১টি বক্স রাখতে হবে
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !description || !stock) {
      return alert('অনুগ্রহ করে ফর্মটি সম্পূর্ণ পূরণ করুন।');
    }

    // খালি বা স্পেস দেওয়া ইমেজ লিংকগুলো ফিল্টার করে বাদ দেওয়া
    const validImages = images.filter(img => img.trim() !== '');

    const newProduct = {
      id: Date.now(),
      name,
      originalPrice: Number(originalPrice) || Number(price) + 500, // না দিলে অফার প্রাইসের চেয়ে ৫০০ বেশি ধরে নেবে
      price: Number(price),
      stock: Number(stock),
      description,
      // যদি কোনো ছবি না দেয়, তবে ডিফল্ট একটা ছবি সেট হবে
      images: validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      image: validImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', // ব্যাকওয়ার্ড সামঞ্জস্য
      reviews: []
    };

    addProduct(newProduct);
    alert('অভিনন্দন! নতুন প্রোডাক্টটি সফলভাবে খান এন্টারপ্রাইজ স্টোরে যুক্ত হয়েছে।');
    
    // ফর্ম সম্পূর্ণ ক্লিয়ার করা
    setName('');
    setOriginalPrice('');
    setPrice('');
    setStock('100');
    setDescription('');
    setImages(['']);
    
    if (setPage) setPage('shop'); // প্রোডাক্ট অ্যাড করার পর সরাসরি শপ পেজে নিয়ে যাবে
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* ব্যাক বাটন */}
      <button 
        onClick={() => setPage && setPage('shop')}
        className="mb-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft size={14} /> শপ পেজে ফিরে যান
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl relative"
      >
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <PlusCircle className="text-blue-600 dark:text-cyan-400" /> প্রফেশনাল অ্যাডমিন ড্যাশবোর্ড
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">খান এন্টারপ্রাইজে নতুন প্রোডাক্টের মূল্য, স্টক এবং গ্যালারি ইমেজ সেট করার অফিশিয়াল ফর্ম প্যানেল।</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ১. প্রোডাক্টের নাম */}
          <div>
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Type size={14} /> প্রোডাক্টের নাম (Title)
            </label>
            <input 
              type="text" 
              required 
              placeholder="যেমন: Smart Watch Series 9 Premium Edition" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all" 
            />
          </div>

          {/* ২. মূল্য ও স্টক সেকশন (গ্রিড লেআউট) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* আসল বা মেইন প্রাইস */}
            <div>
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign size={14} /> মেইন প্রাইস (৳)
              </label>
              <input 
                type="number" 
                placeholder="যেমন: 4000" 
                value={originalPrice} 
                onChange={(e) => setOriginalPrice(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all" 
              />
            </div>

            {/* অফার বা ডিসকাউন্ট প্রাইস */}
            <div>
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign size={14} /> অফার প্রাইস (৳)
              </label>
              <input 
                type="number" 
                required 
                placeholder="যেমন: 3500" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all" 
              />
            </div>

            {/* স্টক ইনপুট ফিল্ড */}
            <div>
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Package size={14} /> স্টক পরিমাণ (পিস)
              </label>
              <input 
                type="number" 
                required 
                placeholder="যেমন: 100" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all" 
              />
            </div>

          </div>

          {/* ৩. বিস্তারিত বিবরণ */}
          <div>
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              বিস্তারিত বিবরণ (Description)
            </label>
            <textarea 
              required 
              placeholder="পণ্যটির বিশেষ বিশেষ আকর্ষনীয় ফিচার বা বিবরণ এখানে প্যারাগ্রাফ আকারে লিখুন..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-3.5 h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all resize-none" 
            />
          </div>

          {/* ৪. ডাইনামিক মাল্টিপল ইমেজ ইউআরএল গ্যালারি */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1"><Image size={14} /> পণ্যের ছবিসমূহ (Multiple Image URLs)</span>
              <button 
                type="button" 
                onClick={handleAddImageField}
                className="text-[11px] bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold hover:opacity-80"
              >
                <Plus size={12} /> ছবি যোগ করুন
              </button>
            </label>

            {images.map((imgUrl, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="url" 
                  placeholder={`ছবির লিংক নম্বর ${index + 1}: https://example.com/image.jpg`} 
                  value={imgUrl} 
                  onChange={(e) => handleImageChange(index, e.target.value)} 
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-all" 
                />
                {images.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImageField(index)}
                    className="p-3 bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <p className="text-[10px] text-slate-400 mt-1">💡 টিপস: ImgBB বা Imgur সাইটে পণ্যটির বিভিন্ন কোণের ২ বা ৩টি ছবি আপলোড করে তাদের Direct Link গুলো এখানে দিন।</p>
          </div>

          {/* সাবমিট বাটন */}
          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }} 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-black py-4 rounded-xl text-sm shadow-lg shadow-blue-500/10 dark:shadow-cyan-500/10 uppercase tracking-wider mt-2"
          >
            স্টোরে নতুন প্রোডাক্ট যুক্ত করুন
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}