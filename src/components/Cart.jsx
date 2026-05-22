import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Smartphone, CheckCircle, ArrowLeft, Truck, User, MapPin, MessageSquare, ShoppingBag, Download } from 'lucide-react';

export default function Cart({ cart, removeFromCart, clearCart, setPage, products, setProducts, orders, setOrders }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = totalPrice > 0 ? (district === 'Dhaka' ? 60 : 120) : 0;
  const finalAmount = totalPrice + deliveryCharge;

  // 📄 ব্রাউজার নেটিভ উইন্ডো প্রিন্ট ট্রিক (যা মোবাইল ও পিসি সব ব্রাউজারে ১০০% ক্যাশ মেমো ডাউনলোড করে দেবে)
  const downloadPDFInvoice = () => {
    window.print();
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !district || !fullAddress) return alert('Fill required fields!');

    const newOrder = {
      orderId: Date.now(),
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
      subTotal: totalPrice,
      deliveryCharge,
      grandTotal: finalAmount,
      status: 'Pending',
      customer: { name: customerName, phone: phoneNumber, whatsapp: whatsappNumber || phoneNumber, district, address: fullAddress },
      payment: { method: paymentMethod, sender: senderNumber || 'N/A', trxId: trxId || 'N/A' },
      date: new Date().toLocaleDateString()
    };

    if (setOrders && orders) {
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('khan_enterprise_orders', JSON.stringify(updatedOrders));
    }

    setLastOrderDetails(newOrder); 
    setIsOrdered(true);
    clearCart(); 
  };

  if (isOrdered && lastOrderDetails) {
    return (
      <div className="max-w-xl mx-auto py-6 flex flex-col items-center">
        <div id="invoice-download-area" className="w-full bg-white text-slate-900 p-6 rounded-3xl border border-slate-200 text-left font-sans text-xs space-y-4">
          <div className="flex justify-between items-start border-b pb-3 border-slate-200">
            <div><h1 className="text-base font-black uppercase text-indigo-600">Khan Enterprise</h1><p className="text-[10px] text-slate-500">Invoice Statement</p></div>
            <div className="text-right"><h2 className="text-xs font-black uppercase">Retail Invoice</h2><p className="text-[9px]">ID: #{lastOrderDetails.orderId}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2.5 rounded-xl border">
            <div><p className="text-[9px] font-bold text-slate-400">Bill To:</p><p className="font-bold">{lastOrderDetails.customer.name}</p><p>{lastOrderDetails.customer.phone}</p></div>
            <div><p className="text-[9px] font-bold text-slate-400">Address:</p><p className="leading-relaxed">{lastOrderDetails.customer.address}</p></div>
          </div>
          <div className="space-y-1">
            {lastOrderDetails.items.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b border-dashed py-1.5"><span>{item.name}</span><strong>৳{item.price}</strong></div>
            ))}
          </div>
          <div className="flex justify-between font-black text-sm border-t pt-2 text-indigo-600"><span>Grand Total Bill:</span><span>৳{lastOrderDetails.grandTotal}</span></div>
        </div>

        {/* 🚀 বাটনের অ্যাকশন ক্লিকের প্রোপস হ্যান্ডেলার সম্পূর্ণ লক করা হয়েছে */}
        <div className="mt-5 grid grid-cols-2 gap-3 w-full">
          <button onClick={downloadPDFInvoice} className="bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-1 shadow-md cursor-pointer"><Download size={14} /> Download/Print</button>
          <button onClick={() => { setPage('shop'); }} className="bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase cursor-pointer text-center">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-12">
      <div className="lg:col-span-7">
        <button onClick={() => setPage('shop')} className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400 mb-5 hover:text-blue-600 uppercase cursor-pointer"><ArrowLeft size={14} /> Return to Shop</button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><ShoppingBag size={22} /> Shopping Cart ({cart.length})</h2>
        {cart.length === 0 ? (
          <div className="text-slate-500 bg-white dark:bg-slate-900 p-12 rounded-3xl border text-center shadow-sm w-full"><p className="text-sm font-medium">Your shopping cart is empty!</p></div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex-grow"><h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</h4><span className="text-cyan-500 font-black text-sm">৳ {item.price}</span></div>
                <button onClick={() => removeFromCart(idx)} className="text-rose-500 p-2 cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="lg:col-span-5">
          <form onSubmit={handleCheckout} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-black border-b pb-2">Shipping Information</h3>
            <div><label className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">Your Full Name</label><input type="text" required placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">Mobile Number</label><input type="tel" required placeholder="017XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-white" /></div>
              <div><label className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">District</label><select required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-white"><option value="">-- Select --</option><option value="Dhaka">Inside Dhaka</option><option value="Outside">Outside Dhaka</option></select></div>
            </div>
            <div><label className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">Detailed Address</label><textarea required placeholder="Address Details" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-3 h-16 text-xs sm:text-sm rounded-xl border bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-white resize-none" /></div>
            <div className="pt-2"><label className="block text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase mb-2">Payment Method</label><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => setPaymentMethod('cod')} className={`p-2.5 rounded-xl border text-[11px] font-black ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-500/10 text-blue-600' : 'border-slate-200'}`}>COD</button><button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-2.5 rounded-xl border text-[11px] font-black ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-500/10 text-pink-600' : 'border-slate-200'}`}>bKash</button><button type="button" onClick={() => setPaymentMethod('nagad')} className={`p-2.5 rounded-xl border text-[11px] font-black ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-slate-200'}`}>Nagad</button></div></div>
            <div className="border-t pt-3 space-y-1 text-xs"><div className="flex justify-between"><span>Grand Total Bill:</span><span className="text-base font-black text-blue-600">৳ {finalAmount}</span></div></div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider mt-2 cursor-pointer">Confirm Order Placement</button>
          </form>
        </div>
      )}
    </div>
  );
}