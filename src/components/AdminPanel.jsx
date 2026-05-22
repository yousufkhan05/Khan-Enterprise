import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Image, DollarSign, Type, Package, Trash2, Plus, ArrowLeft, Edit3, ClipboardList, BarChart3, TrendingUp, ShoppingBag, CheckCircle, Calendar, Phone, MapPin, CreditCard } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPanel({ 
  addProduct, 
  updateProduct, 
  editingProduct, 
  setPage, 
  orders, 
  adminTab, 
  updateOrderStatus, 
  deleteOrder 
}) {
  const [name, setName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('100');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(['']);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setOriginalPrice(editingProduct.originalPrice || '');
      setPrice(editingProduct.price || '');
      setStock(editingProduct.stock !== undefined ? editingProduct.stock.toString() : '100');
      setDescription(editingProduct.description || '');
      
      if (editingProduct.images && editingProduct.images.length > 0) {
        setImages(editingProduct.images);
      } else if (editingProduct.image) {
        setImages([editingProduct.image]);
      } else {
        setImages(['']);
      }
    } else {
      setName(''); setOriginalPrice(''); setPrice(''); setStock('100'); setDescription(''); setImages(['']);
    }
  }, [editingProduct]);

  // 🎯 ছবি যোগ এবং রিমুভ করার ফাংশনসমূহ (যা মিসিং হওয়ার কারণে এরর আসছিল)
  const handleAddImageField = () => {
    setImages([...images, '']);
  };
  
  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const handleRemoveImageField = (index) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  // 📊 অ্যানালিটিক্স ডাটা প্রসেসিং মেকানিজম
  const getAnalyticsData = () => {
    const salesMap = {};
    const safeOrders = orders || [];
    
    safeOrders.forEach(order => {
      const date = order.date || new Date().toLocaleDateString();
      salesMap[date] = (salesMap[date] || 0) + Number(order.grandTotal || 0);
    });
    
    const revenueData = Object.keys(salesMap).map(date => ({ date, Revenue: salesMap[date] })).reverse();

    let pendingCount = 0;
    let completedCount = 0;
    safeOrders.forEach(order => {
      if (order.status === 'Completed') completedCount++;
      else pendingCount++;
    });
    
    const statusData = [
      { name: 'Pending Orders', value: pendingCount || 0 },
      { name: 'Completed Deliveries', value: completedCount || 0 }
    ];

    let smartwatchSales = 0;
    let headphoneSales = 0;
    safeOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (item.name && item.name.toLowerCase().includes('watch')) smartwatchSales += Number(item.price || 0);
        else headphoneSales += Number(item.price || 0);
      });
    });
    
    const categoryData = [
      { name: 'Smartwatches', Sales: smartwatchSales },
      { name: 'Headphones', Sales: headphoneSales }
    ];

    const totalBusinessRevenue = safeOrders.reduce((sum, order) => sum + Number(order.grandTotal || 0), 0);

    return { revenueData, statusData, categoryData, totalBusinessRevenue, pendingCount, completedCount };
  };

  const { revenueData, statusData, categoryData, totalBusinessRevenue, pendingCount, completedCount } = getAnalyticsData();
  const PIE_COLORS = ['#f59e0b', '#10b981'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !description || !stock) return alert('Please fill up the complete form.');

    const validImages = images.filter(img => img.trim() !== '');
    const defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name, originalPrice: Number(originalPrice) || Number(price) + 500, price: Number(price), stock: Number(stock), description,
      images: validImages.length > 0 ? validImages : [defaultImg], image: validImages[0] || defaultImg, reviews: editingProduct ? (editingProduct.reviews || []) : []
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
      alert('Product successfully added to Khan Enterprise Store!');
      setName(''); setOriginalPrice(''); setPrice(''); setStock('100'); setDescription(''); setImages(['']);
      if (setPage) setPage('shop');
    }
  };

  const safeOrdersList = orders || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {/* ==================== 📊 ১. অ্যানালিটিক্স ড্যাশবোর্ড ট্যাব ভিউ ==================== */}
      {adminTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-2xl"><TrendingUp size={24} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Total Revenue</p><h3 className="text-xl font-black text-slate-800 dark:text-white">৳{totalBusinessRevenue}</h3></div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><ShoppingBag size={24} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Total Orders</p><h3 className="text-xl font-black text-slate-800 dark:text-white">{safeOrdersList.length} Units</h3></div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><CheckCircle size={24} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Success Rate</p><h3 className="text-xl font-black text-slate-800 dark:text-white">{safeOrdersList.length > 0 ? Math.round((safeOrdersList.filter(o=>o.status==='Completed').length / safeOrdersList.length)*100) : 0}%</h3></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border dark:border-slate-800 shadow-xl space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5"><BarChart3 size={14} className="text-blue-500" /> Daily Revenue Timeline</h4>
              <div className="h-64 w-full text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }} />
                    <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border dark:border-slate-800 shadow-xl space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5"><BarChart3 size={14} className="text-cyan-400" /> Category Performance</h4>
              <div className="h-64 w-full text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }} />
                    <Bar dataKey="Sales" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border dark:border-slate-800 shadow-xl space-y-4 lg:col-span-2">
              <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5"><BarChart3 size={14} className="text-amber-500" /> Fulfillment Operational Ratio</h4>
              <div className="h-56 w-full flex flex-col sm:flex-row items-center justify-around text-xs">
                <div className="h-full w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-xs font-bold w-full sm:w-1/2 px-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 text-amber-500"><div className="w-3 h-3 bg-amber-500 rounded-full"/> Pending Orders Processing: {pendingCount} units</div>
                  <div className="flex items-center gap-2 text-emerald-500"><div className="w-3 h-3 bg-emerald-500 rounded-full"/> Completed Deliveries: {completedCount} units</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================== 🛒 ২. অর্ডার ট্র্যাকিং লিস্ট ভিউ ==================== */}
      {adminTab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl">
            <h3 className="text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white"><ClipboardList className="text-emerald-500" /> Incoming Orders Live Dashboard</h3>
          </div>
          {safeOrdersList.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed dark:border-slate-800 text-slate-400">
              <ClipboardList size={40} className="mx-auto opacity-30 mb-2" />
              <p className="text-xs font-medium">No new orders available yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safeOrdersList.map((order) => (
                <motion.div key={order.orderId} layout className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-md space-y-4 text-slate-800 dark:text-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b dark:border-slate-800/60 pb-3">
                    <div className="text-xs">
                      <span className="text-slate-400">Order ID:</span> <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">#{order.orderId}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="text-slate-400 flex inline-flex items-center gap-1"><Calendar size={12} /> {order.date}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                    }`}>{order.status}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-2xl border dark:border-slate-800/40">
                      <h4 className="font-black text-[11px] uppercase tracking-wide text-blue-600 dark:text-cyan-400 flex items-center gap-1 mb-1">👤 Customer Profile</h4>
                      <div><span className="text-slate-400">Name:</span> <span className="font-bold">{order.customer?.name}</span></div>
                      <div className="flex items-center gap-1.5"><Phone size={11} className="text-slate-400" /><span className="text-slate-400">Phone:</span> <a href={`tel:${order.customer?.phone}`} className="font-bold text-blue-500 hover:underline">{order.customer?.phone}</a></div>
                      <div><span className="text-slate-400">WhatsApp:</span> <span className="font-bold">{order.customer?.whatsapp}</span></div>
                    </div>
                    <div className="space-y-1.5 bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-2xl border dark:border-slate-800/40">
                      <h4 className="font-black text-[11px] uppercase tracking-wide text-blue-600 dark:text-cyan-400 flex items-center gap-1 mb-1"><MapPin size={11} /> Shipping Address</h4>
                      <div><span className="text-slate-400">Region:</span> <span className="font-bold">{order.customer?.district === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</span></div>
                      <div><span className="text-slate-400">Address:</span> <span className="font-medium leading-relaxed">{order.customer?.address}</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-50/40 dark:bg-slate-950/20 p-3 rounded-2xl border dark:border-slate-800/20 text-xs">
                    <h4 className="font-black mb-2 text-[11px] text-slate-400 uppercase tracking-wide">🛒 Ordered Items:</h4>
                    <div className="space-y-1">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-1 border-b border-dashed dark:border-slate-800/40 last:border-none">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <span className="font-black text-blue-600 dark:text-cyan-400">৳{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-bold flex items-center gap-1 text-slate-500"><CreditCard size={13} /> Payment Method: <span className="uppercase text-slate-800 dark:text-slate-200 font-black">{order.payment?.method}</span></span>
                      {order.payment?.method !== 'cod' && (
                        <div className="text-[11px] text-slate-400 font-medium mt-1">Number: {order.payment?.sender} | TxID: <span className="text-emerald-500 font-mono font-bold">{order.payment?.trxId}</span></div>
                      )}
                    </div>
                    <div className="text-right w-full sm:w-auto pt-2 sm:pt-0"><span className="text-slate-400 mr-1">Grand Total:</span><span className="text-base font-black text-emerald-500">৳{order.grandTotal}</span></div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t dark:border-slate-800/40">
                    <button onClick={() => updateOrderStatus(order.orderId, order.status)} className="flex items-center gap-1 text-[11px] bg-emerald-500 text-white shadow-sm px-3 py-1.5 rounded-xl font-bold cursor-pointer">Update Status</button>
                    <button onClick={() => deleteOrder(order.orderId)} className="flex items-center gap-1 text-[11px] bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer"><Trash2 size={13} /> Delete Order</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ==================== 📝 ৩. প্রোডাক্ট আপলোড / এডিট ফর্ম ভিউ ==================== */}
      {(adminTab === 'add' || adminTab === 'manage') && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl relative text-slate-800 dark:text-slate-100">
          <h2 className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2">
            {editingProduct ? <><Edit3 className="text-amber-500" /> Product Info Editor</> : <><PlusCircle className="text-blue-600 dark:text-cyan-400" /> Professional Admin Dashboard</>}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{editingProduct ? `Currently updating configurations for "${editingProduct.name}".` : 'Official manager panel to add custom products, live inventory stocks, and image URLs.'}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Type size={14} /> Product Title Name</label>
              <input type="text" required placeholder="e.g., Smart Watch Series 9 Premium Edition" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><DollarSign size={14} /> Main Price (৳)</label>
                <input type="number" placeholder="e.g., 4000" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><DollarSign size={14} /> Offer Price (৳)</label>
                <input type="number" required placeholder="e.g., 3500" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Package size={14} /> Stock Unit Quantity</label>
                <input type="number" required placeholder="e.g., 100" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Detailed Description</label>
              <textarea required placeholder="Write premium specifications or core product qualities here..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1"><Image size={14} /> Multiple Image URLs</span>
                <button type="button" onClick={handleAddImageField} className="text-[11px] bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer"><Plus size={12} /> Add Field</button>
              </label>
              {images.map((imgUrl, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input type="url" placeholder={`Image Link #${index + 1}: https://example.com/image.jpg`} value={imgUrl} onChange={(e) => handleImageChange(index, e.target.value)} className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none" />
                  {images.length > 1 && (
                    <button type="button" onClick={() => handleRemoveImageField(index)} className="p-3 bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl cursor-pointer"><Trash2 size={16} /></button>
                  )}
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className={`w-full text-white font-black py-4 rounded-xl text-sm shadow-lg uppercase tracking-wider mt-2 cursor-pointer transition-colors ${editingProduct ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>{editingProduct ? 'Save General Changes' : 'Upload Product to Store'}</motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
}