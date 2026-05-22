import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle, ArrowLeft, Truck, User, MapPin, MessageSquare, ShoppingBag } from 'lucide-react';

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

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = totalPrice > 0 ? (district === 'Dhaka' ? 60 : 120) : 0;
  const finalAmount = totalPrice + deliveryCharge;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !district || !fullAddress) return alert('Please enter required values!');

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
      setOrders([newOrder, ...orders]);
      localStorage.setItem('khan_enterprise_orders', JSON.stringify([newOrder, ...orders]));
    }

    setIsOrdered(true);
    clearCart(); 
  };

  if (isOrdered) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border text-center border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Order Placed Successfully! 🎉</h2>
        <p className="text-xs text-slate-500 mt-2">Thank you! Your order has been securely recorded. Our support agent will call you shortly.</p>
        <button type="button" onClick={() => setPage('shop')} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-xs uppercase cursor-pointer">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900 dark:text-slate-100 min-h-[65vh]">
      <div className="lg:col-span-7">
        <button type="button" onClick={() => setPage('shop')} className="flex items-center gap-1.5 text-xs font-black text-slate-400 mb-5 uppercase hover:text-blue-500 cursor-pointer"><ArrowLeft size={14} /> Return to Shop</button>
        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><ShoppingBag size={20} /> Shopping Cart Overview ({cart.length})</h2>
        
        {cart.length === 0 ? (
          <div className="text-slate-400 bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center w-full"><p className="text-sm font-medium">Your shopping cart is currently empty.</p></div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <img src={item.images?.[0] || item.image} alt="" className="w-14 h-14 object-contain rounded-xl bg-white border border-slate-200 p-1" />
                <div className="flex-grow"><h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{item.name}</h4><span className="text-blue-600 dark:text-cyan-400 font-black text-sm block mt-0.5">৳ {item.price}</span></div>
                <button type="button" onClick={() => removeFromCart(idx)} className="text-rose-500 p-2 cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="lg:col-span-5">
          <form onSubmit={handleCheckout} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 text-xs">
            <h3 className="text-sm font-black border-b pb-2 dark:border-slate-800 flex items-center gap-1.5"><Truck size={16} /> Checkout Gateway</h3>
            <div><label className="block font-black text-slate-600 dark:text-slate-400 mb-1">Your Full Name</label><input type="text" required placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-blue-500" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block font-black text-slate-600 dark:text-slate-400 mb-1">Mobile Number</label><input type="tel" required placeholder="017XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block font-black text-slate-600 dark:text-slate-400 mb-1">Select Destination</label><select required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white cursor-pointer"><option value="">-- Choose --</option><option value="Dhaka">Inside Dhaka</option><option value="Outside">Outside Dhaka</option></select></div>
            </div>
            <div><label className="block font-black text-slate-600 dark:text-slate-400 mb-1">Detailed Shipping Address</label><textarea required placeholder="Detailed Location Address Info..." value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-3 h-16 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white resize-none focus:outline-none focus:border-blue-500" /></div>
            <div className="pt-2"><label className="block font-black text-slate-600 dark:text-slate-400 mb-2">Payment Method</label><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => setPaymentMethod('cod')} className={`p-2.5 rounded-xl border font-black cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-500/10 text-blue-600' : 'border-slate-200 dark:border-slate-800'}`}>COD</button><button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-2.5 rounded-xl border font-black cursor-pointer ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-500/10 text-pink-600' : 'border-slate-200 dark:border-slate-800'}`}>bKash</button><button type="button" onClick={() => setPaymentMethod('nagad')} className={`p-2.5 rounded-xl border font-black cursor-pointer ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-slate-800'}`}>Nagad</button></div></div>
            <div className="border-t pt-3 space-y-1 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium"><div className="flex justify-between"><span>Products Price:</span><span>৳ {totalPrice}</span></div><div className="flex justify-between"><span>Delivery Charge:</span><span>৳ {deliveryCharge}</span></div><div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t pt-2 dark:border-slate-800"><span>Grand Total Bill:</span><span className="text-base text-blue-600 dark:text-cyan-400">৳ {finalAmount}</span></div></div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3.5 rounded-xl uppercase cursor-pointer">Confirm Order</button>
          </form>
        </div>
      )}
    </div>
  );
}