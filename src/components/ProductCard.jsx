import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';

export default function ProductCard({ product, addToCart, addReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(product.id, { rating, comment, date: new Date().toLocaleDateString() });
    setComment('');
    setShowReviewForm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700/50 flex flex-col h-full"
    >
      {/* প্রোডাক্ট ইমেজ */}
      <div className="relative h-56 bg-slate-100 dark:bg-slate-700 overflow-hidden group">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          নতুন পণ্য
        </span>
      </div>

      {/* প্রোডাক্ট ডিটেইলস */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">৳ {product.price}</span>
          
          {/* অ্যানিমেটেড কার্ট বাটন */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md"
          >
            <ShoppingCart size={16} /> কার্ট
          </motion.button>
        </div>

        <hr className="my-4 border-slate-100 dark:border-slate-700" />

        {/* কাস্টমার রিভিউ সেকশন */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 cursor-pointer font-semibold hover:text-blue-500" onClick={() => setShowReviewForm(!showReviewForm)}>
              <MessageSquare size={14} /> রিভিউ লিখুন ({product.reviews?.length || 0})
            </span>
          </div>

          {/* রিভিউ ফর্ম */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mt-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} size={14} 
                    className={`cursor-pointer ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea 
                placeholder="আপনার মতামত..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2 rounded border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                rows="2"
              />
              <button type="submit" className="mt-1 bg-slate-800 dark:bg-slate-700 text-white text-[10px] px-3 py-1 rounded font-bold">
                সাবমিট
              </button>
            </form>
          )}

          {/* রিভিউ লিস্ট (সর্বশেষ ২টি দেখাবে) */}
          <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
            {product.reviews?.slice(-2).reverse().map((rev, i) => (
              <div key={i} className="text-[11px] bg-slate-50/50 dark:bg-slate-700/30 p-2 rounded border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, s) => (
                      <Star key={s} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span className="text-[9px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}