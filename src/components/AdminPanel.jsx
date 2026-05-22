import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Image, DollarSign, Type, Package, Trash2, Plus, ArrowLeft, Edit3, ClipboardList, Settings, BarChart3, TrendingUp, Users, ShoppingCart, Layers } from 'lucide-react';

export default function AdminPanel({ 
  addProduct, updateProduct, editingProduct, setPage, orders, 
  adminTab, setAdminTab, updateOrderStatus, deleteOrder, products, setEditingProduct, deleteProduct,
  heroSlides, setHeroSlides
}) {
  const [name, setName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('100');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(['']);

  // স্লাইডারের জন্য কাস্টম নতুন স্টেট
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideBadge, setSlideBadge] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setOriginalPrice(editingProduct.originalPrice || '');
      setPrice(editingProduct.price || '');
      setStock(editingProduct.stock !== undefined ? editingProduct.stock.toString() : '100');
      setDescription(editingProduct.description || '');
      setImages(editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['']);
    } else {
      setName(''); setOriginalPrice(''); setPrice(''); setStock('100'); setDescription(''); setImages(['']);
    }
  }, [editingProduct]);

  const totalSalesRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.grandTotal, 0);
  const totalPendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalProductsCount = products.length;

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!slideTitle || !slideSubtitle) return alert('Please fill banner title and subtitle');
    
    const newSlide = {
      id: Date.now(),
      title: slideTitle,
      subtitle: slideSubtitle,
      badge: slideBadge || "EXCLUSIVE OFFERS 🔥"
    };

    setHeroSlides([...heroSlides, newSlide]);
    alert('New Promo Banner Added to Shop Slider!');
    setSlideTitle(''); setSlideSubtitle(''); setSlideBadge('');
  };

  const handleDeleteSlide = (id) => {
    if (window.confirm("Remove this banner from homepage?")) {
      setHeroSlides(heroSlides.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validImages = images.filter(img => img.trim() !== '');
    const defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name,
      originalPrice: Number(originalPrice) || Number(price) + 500,
      price: Number(price),
      stock: Number(stock),
      description,
      images: validImages.length > 0 ? validImages : [defaultImg],
      image: validImages[0] || defaultImg,
      reviews: editingProduct ? (editingProduct.reviews || []) : []
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
      alert('Product Added Successfully!');
      setName(''); setOriginalPrice(''); setPrice(''); setStock('100'); setDescription(''); setImages(['']);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      <div className="flex flex-wrap gap-2 bg-slate-200 dark:bg-slate-950 p-2 rounded-2xl border border-slate-300 dark:border-slate-800">
        <button onClick={() => setAdminTab('orders')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${adminTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-300 text-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}>Incoming Orders ({orders.length})</button>
        <button onClick={() => { setAdminTab('add'); setEditingProduct(null); }} className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${adminTab === 'add' && !editingProduct ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-300 text-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}>Add Product</button>
        <button onClick={() => setAdminTab('manage')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${adminTab === 'manage' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-300 text-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}>Manage Inventory</button>
        <button onClick={() => setAdminTab('slides')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${adminTab === 'slides' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-300 text-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}>Homepage Banners 🎠</button>
        <button onClick={() => setAdminTab('analytics')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${adminTab === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-300 text-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}>Analytics & Reports 📊</button>
      </div>

      {/* ==================== 🎠 নতুন ব্যানার কন্ট্রোলার মডিউল ==================== */}
      {adminTab === 'slides' && (
        <div className="space-y-6">
          <form onSubmit={handleAddSlide} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-md">
            <h3 className="text-sm font-black flex items-center gap-1.5"><Layers size={16} /> Create Dynamic Slider Banner</h3>
            <div><label className="block font-black mb-1">Banner Title</label><input type="text" required placeholder="e.g., Ultra Smart Watch Season Sale" value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block font-black mb-1">Subtitle Note</label><input type="text" required placeholder="e.g., Get up to 40% absolute discount" value={slideSubtitle} onChange={(e) => setSlideSubtitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" /></div>
              <div><label className="block font-black mb-1">Badge Tag</label><input type="text" placeholder="e.g., HOT DEAL 🔥" value={slideBadge} onChange={(e) => setSlideBadge(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" /></div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-3 rounded-xl uppercase shadow-md cursor-pointer">Deploy Banner to Slider</button>
          </form>

          {/* বর্তমান স্লাইডার তালিকা */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400">Active Homepage Banners ({heroSlides.length})</h4>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border dark:border-slate-800 text-xs">
                <div><span className="text-[10px] text-blue-500 font-bold">{slide.badge}</span><h5 className="font-bold text-slate-800 dark:text-white text-sm">{slide.title}</h5><p className="text-slate-400">{slide.subtitle}</p></div>
                <button onClick={() => handleDeleteSlide(slide.id)} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl font-bold cursor-pointer"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black flex items-center gap-1.5"><ClipboardList size={16} className="text-emerald-500" /> Live Orders Panel</h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-3xl text-slate-400 text-xs">No orders available right now.</div>
          ) : (
            orders.map(order => (
              <div key={order.orderId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-3">
                <div className="flex justify-between items-center border-b dark:border-slate-800/50 pb-2">
                  <span className="font-bold font-mono text-blue-500">#{order.orderId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{order.status}</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200"><strong>Client:</strong> {order.customer.name} | <strong>Phone:</strong> {order.customer.phone}</div>
                <div className="text-slate-700 dark:text-slate-300"><strong>Address:</strong> {order.customer.address}</div>
                <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-xl text-slate-800 dark:text-slate-200">
                  {order.items.map((it, i) => <div key={i} className="flex justify-between"><span>{it.name}</span><strong>৳{it.price}</strong></div>)}
                </div>
                <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-200"><span>Payment: {order.payment.method}</span><span className="text-sm text-emerald-500">৳{order.grandTotal}</span></div>
                <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800/40">
                  <button onClick={() => updateOrderStatus(order.orderId, order.status)} className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl font-bold cursor-pointer">Toggle Status</button>
                  <button onClick={() => deleteOrder(order.orderId)} className="bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-xl font-bold cursor-pointer">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {adminTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
          <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900 dark:text-white"><Settings size={15} /> Store Products List</h3>
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0] || p.image} alt="" className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Price: ৳{p.price} | Stock: <span className="font-bold text-blue-600 dark:text-cyan-400">{p.stock} pcs</span></p>
                  </div>
                </div>
                <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                  <button onClick={() => { setEditingProduct(p); setAdminTab('add'); }} className="bg-amber-500 text-white px-3 py-2 rounded-xl font-black cursor-pointer">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="bg-rose-500 text-white px-3 py-2 rounded-xl font-black cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-sm font-black uppercase flex items-center gap-1.5"><BarChart3 size={16} className="text-blue-500" /> Business Performance Dashboard</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-sm">
              <div className="flex justify-between items-center"><span>Total Net Revenue</span><TrendingUp size={16} /></div>
              <h2 className="text-xl font-black mt-2">৳{totalSalesRevenue}</h2>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white shadow-sm">
              <div className="flex justify-between items-center"><span>Pending Orders</span><ShoppingCart size={16} /></div>
              <h2 className="text-xl font-black mt-2">{totalPendingOrders} Pcs</h2>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl text-white shadow-sm">
              <div className="flex justify-between items-center"><span>Active Catalog</span><Users size={16} /></div>
              <h2 className="text-xl font-black mt-2">{totalProductsCount} Items</h2>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-md">
          <h3 className="text-sm font-black flex items-center gap-1.5 text-slate-900 dark:text-white"><PlusCircle size={16} /> Product Setup Sheets</h3>
          <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Product Title</label><input type="text" required placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Main Price (৳)</label><input type="number" placeholder="Original Price" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Offer Price (৳)</label><input type="number" required placeholder="Selling Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Stock Quantity (pcs)</label><input type="number" required placeholder="100" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
          </div>
          <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Product Description</label><textarea required placeholder="Write parameters..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 h-24 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none resize-none" /></div>
          <div className="space-y-2">
            <label className="font-black text-slate-700 dark:text-slate-300 flex justify-between items-center"><span>Image URLs</span><button type="button" onClick={handleAddImageField} className="text-[10px] bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-1 rounded-lg font-bold cursor-pointer">+ Add Image</button></label>
            {images.map((imgUrl, index) => (
              <div key={index} className="flex gap-2"><input type="url" placeholder={`https://example.com/image${index+1}.jpg`} value={imgUrl} onChange={(e) => handleImageChange(index, e.target.value)} className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" />{images.length > 1 && (<button type="button" onClick={() => handleRemoveImageField(index)} className="p-3 bg-rose-50 text-rose-500 dark:bg-rose-500/10 rounded-xl cursor-pointer"><Trash2 size={14} /></button>)}</div>
            ))}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl uppercase cursor-pointer shadow-md mt-2">{editingProduct ? 'Save Changes' : 'Upload Product'}</button>
        </form>
      )}
    </div>
  );
}