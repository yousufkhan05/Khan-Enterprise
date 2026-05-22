import React, { useState, useEffect } from 'react';
import { PlusCircle, Image, DollarSign, Type, Package, Trash2, Plus, Edit3, ClipboardList, Settings, Layers } from 'lucide-react';

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
    if (!slideTitle || !slideSubtitle) return alert('Fill title and subtitle');
    const newSlide = { id: Date.now(), title: slideTitle, subtitle: slideSubtitle, badge: slideBadge || "EXCLUSIVE OFFERS 🔥" };
    setHeroSlides([...heroSlides, newSlide]);
    alert('Promo Banner Added!');
    setSlideTitle(''); setSlideSubtitle(''); setSlideBadge('');
  };

  const handleDeleteSlide = (id) => {
    if (window.confirm("Remove this banner?")) setHeroSlides(heroSlides.filter(s => s.id !== id));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
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
    <div className="space-y-6 bg-transparent text-slate-900 dark:text-slate-100">
      
      <div className="flex flex-wrap gap-2 bg-slate-200 dark:bg-slate-900 p-2 rounded-2xl border border-slate-300 dark:border-slate-800">
        <button type="button" onClick={() => setAdminTab('orders')} className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${adminTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>Incoming Orders ({orders.length})</button>
        <button type="button" onClick={() => { setAdminTab('add'); setEditingProduct(null); }} className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${adminTab === 'add' && !editingProduct ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>Add Product</button>
        <button type="button" onClick={() => setAdminTab('manage')} className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${adminTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>Manage Inventory</button>
        <button type="button" onClick={() => setAdminTab('slides')} className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${adminTab === 'slides' ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>Homepage Banners 🎠</button>
        <button type="button" onClick={() => setAdminTab('analytics')} className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${adminTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>Analytics 📊</button>
      </div>

      {adminTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black flex items-center gap-1.5"><ClipboardList size={16} /> Orders Monitoring Queue</h3>
          {orders.map(order => (
            <div key={order.orderId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between font-bold border-b pb-2 dark:border-slate-800"><span>ID: #{order.orderId}</span><span className="text-blue-500">{order.status}</span></div>
              <div className="text-slate-800 dark:text-slate-200"><strong>Client:</strong> {order.customer.name} | {order.customer.phone}</div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl text-slate-800 dark:text-slate-200">{order.items.map((it, i) => <div key={i} className="flex justify-between"><span>{it.name}</span><strong>৳{it.price}</strong></div>)}</div>
              <div className="flex justify-between items-center font-bold"><span>Total:</span><span className="text-sm text-emerald-500">৳{order.grandTotal}</span></div>
              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800"><button type="button" onClick={() => updateOrderStatus(order.orderId, order.status)} className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg cursor-pointer">Toggle Status</button><button type="button" onClick={() => deleteOrder(order.orderId)} className="bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-lg cursor-pointer">Delete</button></div>
            </div>
          ))}
        </div>
      )}

      {adminTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-800 dark:text-white">Active Store Inventory List</h3>
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs gap-4">
              <div className="flex items-center gap-3">
                <img src={p.images?.[0] || p.image} alt="" className="w-10 h-10 object-contain bg-white border border-slate-200 rounded-lg p-1" />
                <div><h4 className="font-bold text-slate-800 dark:text-slate-200">{p.name}</h4><p className="text-slate-400">Price: ৳{p.price} | Stock: {p.stock} pcs</p></div>
              </div>
              <div className="flex gap-2"><button type="button" onClick={() => { setEditingProduct(p); setAdminTab('add'); }} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Edit</button><button type="button" onClick={() => deleteProduct(p.id)} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Delete</button></div>
            </div>
          ))}
        </div>
      )}

      {adminTab === 'slides' && (
        <div className="space-y-6">
          <form onSubmit={handleAddSlide} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-sm">
            <h3 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-white"><Layers size={14} /> Add Promo Banner</h3>
            <div><label className="block mb-1 font-black text-slate-700 dark:text-slate-300">Banner Title</label><input type="text" required placeholder="e.g., Winter Gadget Sale" value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block mb-1 font-black text-slate-700 dark:text-slate-300">Subtitle Note</label><input type="text" required placeholder="Flat 20% discount" value={slideSubtitle} onChange={(e) => setSlideSubtitle(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
              <div><label className="block mb-1 font-black text-slate-700 dark:text-slate-300">Badge Tag</label><input type="text" placeholder="HOT DEAL 🔥" value={slideBadge} onChange={(e) => setSlideBadge(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl cursor-pointer shadow-md">Deploy to Slider</button>
          </form>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            {heroSlides.map(s => (
              <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs border border-slate-100 dark:border-slate-800">
                <div><span className="text-blue-500 font-bold text-[10px]">{s.badge}</span><h5 className="font-bold text-slate-800 dark:text-white">{s.title}</h5></div>
                <button type="button" onClick={() => handleDeleteSlide(s.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white">
          <div className="bg-emerald-500 p-5 rounded-2xl shadow-sm"><span>Net Revenue</span><h2 className="text-xl font-black mt-2">৳{totalSalesRevenue}</h2></div>
          <div className="bg-amber-500 p-5 rounded-2xl shadow-sm"><span>Pending Queue</span><h2 className="text-xl font-black mt-2">{totalPendingOrders} Pcs</h2></div>
          <div className="bg-blue-500 p-5 rounded-2xl shadow-sm"><span>Catalog Items</span><h2 className="text-xl font-black mt-2">{totalProductsCount} Items</h2></div>
        </div>
      )}

      {adminTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-sm">
          <h3 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-white"><PlusCircle size={15} /> Upload Product Configuration</h3>
          <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Product Title</label><input type="text" required placeholder="Product Title" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-blue-500" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Original Price (৳)</label><input type="number" placeholder="4000" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Offer Price (৳)</label><input type="number" required placeholder="3500" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
            <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Stocks Quantity</label><input type="number" required placeholder="100" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" /></div>
          </div>
          <div><label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Product Description</label><textarea required placeholder="Write details..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 h-24 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none resize-none" /></div>
          <div className="space-y-2">
            <label className="font-black text-slate-700 dark:text-slate-300 flex justify-between items-center"><span>Image Destination Link URLs</span><button type="button" onClick={() => setImages([...images, ''])} className="text-[10px] bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-1 rounded-lg font-bold cursor-pointer">+ Add Field</button></label>
            {images.map((img, i) => (
              <div key={i} className="flex gap-2"><input type="url" placeholder="https://example.com/image.jpg" value={img} onChange={(e) => handleImageChange(i, e.target.value)} className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none" />{images.length > 1 && <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="p-3 bg-rose-50 text-rose-500 rounded-xl cursor-pointer"><Trash2 size={14} /></button>}</div>
            ))}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase shadow-md cursor-pointer mt-2">{editingProduct ? 'Update Changes' : 'Publish Product'}</button>
        </form>
      )}
    </div>
  );
}