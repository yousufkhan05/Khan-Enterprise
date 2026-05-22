import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Image, DollarSign, Type, Package, Trash2, Plus, ArrowLeft, Edit3, ClipboardList, Settings } from 'lucide-react';

export default function AdminPanel({ 
  addProduct, updateProduct, editingProduct, setPage, orders, 
  adminTab, setAdminTab, updateOrderStatus, deleteOrder, products, setEditingProduct, deleteProduct 
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
      setImages(editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['']);
    }
  }, [editingProduct]);

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
    <div className="space-y-5">
      {/* Sub tabs bar setup with high visibility styles */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-800">
        <button onClick={() => setAdminTab('orders')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${adminTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-400'}`}>Incoming Orders ({orders.length})</button>
        <button onClick={() => { setAdminTab('add'); setEditingProduct(null); }} className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${adminTab === 'add' && !editingProduct ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-400'}`}>Add Product</button>
        <button onClick={() => setAdminTab('manage')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${adminTab === 'manage' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-400'}`}>Manage Inventory</button>
      </div>

      {adminTab === 'orders' ? (
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5"><ClipboardList size={16} className="text-emerald-500" /> Live Orders Panel</h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-3xl text-slate-400 text-xs">No orders available right now.</div>
          ) : (
            orders.map(order => (
              <div key={order.orderId} className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-3">
                <div className="flex justify-between items-center border-b dark:border-slate-800/50 pb-2">
                  <span className="font-bold font-mono text-blue-500">#{order.orderId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{order.status}</span>
                </div>
                <div><strong>Client Name:</strong> {order.customer.name} | <strong>Phone:</strong> {order.customer.phone}</div>
                <div><strong>Location Address:</strong> {order.customer.address}</div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                  {order.items.map((it, i) => <div key={i} className="flex justify-between"><span>{it.name}</span><strong>৳{it.price}</strong></div>)}
                </div>
                <div className="flex justify-between items-center font-bold"><span>Total: {order.payment.method}</span><span className="text-sm text-emerald-500">৳{order.grandTotal}</span></div>
                <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800/40">
                  <button onClick={() => updateOrderStatus(order.orderId, order.status)} className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-bold">Toggle Status</button>
                  <button onClick={() => deleteOrder(order.orderId)} className="bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-xl font-bold">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : adminTab === 'manage' ? (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-black flex items-center gap-1.5"><Settings size={15} /> Store Products List</h3>
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border dark:border-slate-800/50 text-xs">
              <div><h4 className="font-bold">{p.name}</h4><p className="text-slate-400 mt-0.5">Price: ৳{p.price} | Stock: {p.stock} pcs</p></div>
              <div className="flex gap-1.5">
                <button onClick={() => { setEditingProduct(p); setAdminTab('add'); }} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Form Layer Container Component */
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 space-y-4 text-xs">
          <div><label className="block font-bold mb-1">Product Title</label><input type="text" required placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border bg-transparent" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block font-bold mb-1">Price (৳)</label><input type="number" required placeholder="3500" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 rounded-xl border bg-transparent" /></div>
            <div><label className="block font-bold mb-1">Stock (pcs)</label><input type="number" required placeholder="100" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3 rounded-xl border bg-transparent" /></div>
          </div>
          <div><label className="block font-bold mb-1">Description</label><textarea required placeholder="Write details..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 h-24 rounded-xl border bg-transparent resize-none" /></div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl uppercase tracking-wider">{editingProduct ? 'Save Changes' : 'Upload Product'}</button>
        </form>
      )}
    </div>
  );
}