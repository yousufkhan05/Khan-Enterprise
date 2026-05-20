import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, MessageSquare, ThumbsUp, CornerDownRight, ChevronDown, ChevronUp, Package, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, addToCart, addReview, setPage }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [likes, setLikes] = useState({});
  const [replyText, setReplyText] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);

  // ডিফল্ট স্টক যদি অ্যাডমিন প্যানেল থেকে না দেওয়া হয়, তবে ব্যাকআপ হিসেবে ১০০ ধরে নেবে
  const currentStock = product.stock !== undefined ? product.stock : 100;

  const originalPrice = product.originalPrice || product.price + 500;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(product.id, { 
      id: Date.now(),
      rating, 
      comment, 
      date: new Date().toLocaleDateString(),
      replies: []
    });
    setComment('');
    setShowReviewForm(false);
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) return; // স্টক না থাকলে কেনা যাবে না
    addToCart(product);
    setPage('cart');
  };

  const toggleLike = (reviewId) => {
    setLikes(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
  };

  const handleReplySubmit = (e, reviewId) => {
    e.preventDefault();
    if (!replyText[reviewId]?.trim()) return;
    
    if(product.reviews) {
      const targetReview = product.reviews.find(r => r.id === reviewId || r.date === reviewId);
      if(targetReview) {
        if(!targetReview.replies) targetReview.replies = [];
        targetReview.replies.push({
          text: replyText[reviewId],
          date: new Date().toLocaleDateString()
        });
      }
    }
    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    setActiveReplyBox(null);
  };

  return (
    <motion.div 
      whileHover={{ y: -6, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col h-full transition-all duration-350 relative"
    >
      {/* ১. ইমেজ গ্যালারি সেকশন */}
      <div className="relative h-64 bg-slate-50 dark:bg-slate-950 overflow-hidden group">
        <img 
          src={images[activeImageIndex] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
          alt={product.name}
          className={`w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${currentStock === 0 ? 'grayscale opacity-60' : ''}`}
        />
        
        {/* স্টক স্ট্যাটাস ব্যাজ (০ হলে আউট অফ স্টক, কম থাকলে লিমিটেড স্টক দেখাবে) */}
        {currentStock === 0 ? (
          <span className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-lg uppercase tracking-wider z-10">
            আউট অফ স্টক 🚫
          </span>
        ) : currentStock <= 5 ? (
          <span className="absolute top-4 left-4 bg-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-lg uppercase tracking-wider z-10 animate-pulse">
            সীমিত স্টক ({currentStock} টি বাকি)
          </span>
        ) : discountPercent > 0 ? (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg uppercase tracking-wider">
            {discountPercent}% ছাড়
          </span>
        ) : null}

        <span className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          অরিজিনাল গ্যাজেট
        </span>
      </div>

      {/* মাল্টিপল থাম্বনেইল ইন্ডিকেটর */}
      {images.length > 1 && (
        <div className="flex gap-2 px-5 py-2 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/40">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border-2 transition-all ${
                idx === activeImageIndex ? 'border-blue-500 shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}

      {/* ২. প্রোডাক্ট ডিটেইলস */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </div>
        
        {/* লাইভ স্টক কাউন্টার ডিসপ্লে */}
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Package size={13} className={currentStock > 0 ? "text-emerald-500" : "text-rose-500"} />
          <span>অবশিষ্ট স্টক: {currentStock > 0 ? `${currentStock} টি` : <span className="text-rose-500 font-bold">স্টক শেষ</span>}</span>
        </div>
        
        {/* ডেসক্রিপশন টগল অপশন */}
        <div 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 cursor-pointer group"
        >
          <p className={isDescExpanded ? "line-clamp-none" : "line-clamp-2"}>
            {product.description}
          </p>
          <span className="text-[11px] font-bold text-blue-500 dark:text-cyan-400 flex items-center gap-0.5 mt-1 opacity-80 group-hover:opacity-100">
            {isDescExpanded ? <>কম দেখান <ChevronUp size={12} /></> : <>আরও পড়ুন <ChevronDown size={12} /></>}
          </span>
        </div>
        
        {/* প্রফেশনাল প্রাইসিং */}
        <div className="mt-5 flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-cyan-400 tracking-tight">
            ৳ {product.price}
          </span>
          <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 line-through font-medium">
            ৳ {originalPrice}
          </span>
        </div>

        {/* ৩. দ্বৈত অ্যাকশন বাটন (স্টক ০ হলেও কার্ট বাটন সচল থাকবে, কিন্তু এখনই কিনুন লক হয়ে যাবে) */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200/40 dark:border-slate-700/50 transition-all"
          >
            <ShoppingCart size={16} /> কার্ট
          </motion.button>

          <motion.button
            whileTap={currentStock > 0 ? { scale: 0.96 } : {}}
            onClick={handleBuyNow}
            disabled={currentStock === 0} // স্টক ০ হলে বাটন সম্পূর্ণ ডিজেবল
            className={`flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              currentStock > 0 
                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 tracking-wide cursor-pointer" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300/20"
            }`}
          >
            {currentStock > 0 ? "এখনই কিনুন" : "স্টক আউট"}
          </motion.button>
        </div>

        <hr className="my-5 border-slate-100 dark:border-slate-800/60" />

        {/* ৪. কাস্টমার ইন্টারেক্টিভ রিভিউ */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span 
              className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors" 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              <MessageSquare size={14} /> কাস্টমার রিভিউ ({product.reviews?.length || 0})
            </span>
          </div>

          {/* রিভিউ লেখার ফর্ম */}
          {showReviewForm && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleReviewSubmit} 
              className="mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner"
            >
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} size={15} 
                    className={`cursor-pointer transition-all ${star <= rating ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-300 dark:text-slate-700"}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea 
                placeholder="পণ্যের মান কেমন? আপনার সৎ মতামত লিখুন..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                rows="2"
              />
              <button type="submit" className="mt-2 bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-[10px] px-4 py-1.5 rounded-lg font-black uppercase tracking-wider shadow-sm">
                রিভিউ পাঠান
              </button>
            </motion.form>
          )}

          {/* রিভিউ লিস্ট ডিসপ্লে */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {product.reviews?.map((rev, idx) => {
              const reviewId = rev.id || rev.date + idx;
              return (
                <div key={idx} className="text-xs bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                  <div className="flex items-center justify-between">
                    <span className="flex gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, s) => (
                        <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">{rev.comment}</p>
                  
                  <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-100/50 dark:border-slate-800/30 text-[10px] text-slate-400 dark:text-slate-500">
                    <button 
                      onClick={() => toggleLike(reviewId)} 
                      className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-cyan-400 font-bold transition-colors"
                    >
                      <ThumbsUp size={11} /> লাইক ({likes[reviewId] || 0})
                    </button>
                    <button 
                      onClick={() => setActiveReplyBox(activeReplyBox === reviewId ? null : reviewId)} 
                      className="flex items-center gap-1 hover:text-emerald-500 font-bold transition-colors"
                    >
                      <CornerDownRight size={11} /> কমেন্ট করুন
                    </button>
                  </div>

                  <AnimatePresence>
                    {activeReplyBox === reviewId && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => handleReplySubmit(e, reviewId)}
                        className="mt-2 flex gap-1.5 items-center overflow-hidden"
                      >
                        <input 
                          type="text" 
                          placeholder="রিপ্লাই লিখুন..."
                          value={replyText[reviewId] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [reviewId]: e.target.value })}
                          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] p-1.5 rounded-lg focus:outline-none"
                        />
                        <button type="submit" className="bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px]">
                          পাঠান
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {rev.replies && rev.replies.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-emerald-500/40 space-y-1 bg-emerald-500/5 p-1.5 rounded-r-lg">
                      {rev.replies.map((rep, rIdx) => (
                        <div key={rIdx} className="text-[11px]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1">Khan Enterprise:</span>
                          <span className="text-slate-600 dark:text-slate-300">{rep.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}