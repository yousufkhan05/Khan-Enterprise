import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Smartphone, CheckCircle, ArrowLeft, Truck, User, MapPin, MessageSquare, ShoppingBag, Download } from 'lucide-react';
// html2pdf লাইব্রেরি ইমপোর্ট করা
import html2pdf from 'html2pdf.js';

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
  // শেষ হওয়া অর্ডারের মেমোরি ধরে রাখার স্টেট (PDF এর জন্য)
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = totalPrice > 0 ? (district === 'Dhaka' ? 60 : 120) : 0;
  const finalAmount = totalPrice + deliveryCharge;

  // 📄 অটোমেটিক PDF ক্যাশ মেমো জেনারেট করার ফাংশন
  const downloadPDFInvoice = () => {
    if (!lastOrderDetails) return;

    const element = document.getElementById('invoice-download-area');
    const options = {
      margin: 10,
      filename: `Invoice_${lastOrderDetails.orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (!customerName || !phoneNumber || !district || !fullAddress) {
      return alert('Please enter your Name, Phone Number, and Complete Address details.');
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!senderNumber || !trxId)) {
      return alert('For digital payments, sender number and transaction TxID are required.');
    }

    if (setProducts && products) {
      const updatedProducts = products.map(product => {
        const itemsInCart = cart.filter(item => item.id === product.id).length;
        if (itemsInCart > 0) {
          const currentStock = product.stock !== undefined ? product.stock : 100;
          const newStock = Math.max(0, currentStock - itemsInCart);
          return { ...product, stock: newStock };
        }
        return product;
      });
      
      setProducts(updatedProducts);
      localStorage.setItem('khan_enterprise_products', JSON.stringify(updatedProducts));
    }

    const newOrder = {
      orderId: Date.now(),
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
      subTotal: totalPrice,
      deliveryCharge,
      grandTotal: finalAmount,
      status: 'Pending',
      customer: {
        name: customerName,
        phone: phoneNumber,
        whatsapp: whatsappNumber || phoneNumber,
        district,
        address: fullAddress
      },
      payment: {
        method: paymentMethod,
        sender: paymentMethod !== 'cod' ? senderNumber : 'N/A',
        trxId: paymentMethod !== 'cod' ? trxId : 'N/A'
      },
      date: new Date().toLocaleDateString()
    };

    if (setOrders && orders) {
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('khan_enterprise_orders', JSON.stringify(updatedOrders));
    }

    setLastOrderDetails(newOrder); // PDF এর জন্য সেটাপ লক করা
    setIsOrdered(true);
    clearCart(); 
  };

  // 🎉 অর্ডার সাকসেস স্ক্রিন + প্রফেশনাল ক্যাশ মেমো ভিউ
  if (isOrdered && lastOrderDetails) {
    return (
      <div className="max-w-xl mx-auto my-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={36} className="animate-bounce" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Order Confirmed Successfully!</h2>
          <p className="text-xs text-slate-400 mt-1">Thank you for shopping with us. Your invoice is ready below.</p>
        </div>

        {/* ==================== 📄 রিয়েল PDF ক্যাশ মেমো লেআউট (এটি প্রিন্ট হবে) ==================== */}
        <div 
          id="invoice-download-area" 
          className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm text-left font-sans text-xs space-y-4"
          style={{ color: '#0f172a', backgroundColor: '#ffffff' }} // PDF এ কালার ফিক্স রাখার জন্য হার্ডকোডেড
        >
          {/* মেমো হেডার */}
          <div className="flex justify-between items-start border-b pb-4 border-slate-200">
            <div>
              <h1 className="text-base font-black uppercase text-indigo-600">Khan Enterprise</h1>
              <p className="text-[10px] text-slate-500">Premium Gadget Store Platform</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-black uppercase text-slate-700">Retail Invoice</h2>
              <p className="text-[10px] text-slate-500">ID: #{lastOrderDetails.orderId}</p>
              <p className="text-[10px] text-slate-500">Date: {lastOrderDetails.date}</p>
            </div>
          </div>

          {/* কাস্টমার বিলিং ইনফো */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Billing To:</p>
              <p className="font-bold">{lastOrderDetails.customer.name}</p>
              <p className="text-slate-600">{lastOrderDetails.customer.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Shipping Address:</p>
              <p className="text-slate-600 leading-relaxed">{lastOrderDetails.customer.address}</p>
              <p className="font-bold text-slate-700">{lastOrderDetails.customer.district === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
            </div>
          </div>

          {/* প্রোডাক্ট টেবিল */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold bg-slate-100 p-2 rounded-lg text-slate-700 uppercase text-[10px]">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            {lastOrderDetails.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 px-1 border-b border-dashed border-slate-200">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="font-bold">৳{item.price}</span>
              </div>
            ))}
          </div>

          {/* ফাইনাল হিসাব ব্রেকডাউন */}
          <div className="flex justify-between items-center pt-2">
            <div className="text-[11px] text-slate-500">
              <p>Payment Method: <span className="font-bold uppercase text-slate-800">{lastOrderDetails.payment.method}</span></p>
              <p>Status: <span className="font-bold text-amber-600">Pending Verification</span></p>
            </div>
            <div className="w-40 text-right space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500"><span>Subtotal:</span><span>৳{lastOrderDetails.subTotal}</span></div>
              <div className="flex justify-between text-slate-500"><span>Delivery:</span><span>৳{lastOrderDetails.deliveryCharge}</span></div>
              <div className="flex justify-between font-black text-sm border-t pt-1.5 text-indigo-600"><span>Total Paid:</span><span>৳{lastOrderDetails.grandTotal}</span></div>
            </div>
          </div>

          {/* মেমো ফুটার */}
          <div className="border-t pt-4 text-center text-[10px] text-slate-400 font-medium">
            Thank you for your business! For any support, contact 01771183608.
          </div>
        </div>

        {/* অ্যাকশন বাটন কন্ট্রোল */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button 
            onClick={downloadPDFInvoice}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
          >
            <Download size={14} /> Download Receipt (PDF)
          </button>
          <button 
            onClick={() => setPage('shop')} 
            className="w-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-black py-3 rounded-xl text-xs uppercase cursor-pointer hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-12">
      {/* বাম পাশ: কার্ট রিভিউ */}
      <div className="lg:col-span-7">
        <button onClick={() => setPage('shop')} className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400 mb-5 hover:text-blue-600 dark:hover:text-cyan-400 uppercase cursor-pointer"><ArrowLeft size={14} /> Return to Shop</button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2"><ShoppingBag size={22} className="text-blue-600 dark:text-cyan-400" /> Shopping Cart ({cart.length})</h2>
        
        {cart.length === 0 ? (
          <div className="text-slate-500 bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-medium">Your shopping cart is empty!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div key={index} layout className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <img src={item.images?.[0] || item.image} alt={item.name} className="w-16 h-16 object-contain rounded-xl bg-slate-50 dark:bg-slate-950 p-1 border dark:border-slate-800" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-1">{item.name}</h4>
                  <span className="text-slate-900 dark:text-cyan-400 font-black text-sm block mt-0.5">৳ {item.price}</span>
                </div>
                <button onClick={() => removeFromCart(index)} className="text-rose-500 p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl cursor-pointer"><Trash2 size={18} /></button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ডান পাশ: চেকআউট ফর্ম */}
      {cart.length > 0 && (
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800"><Truck size={18} className="text-blue-500" /> Shipping & Payment Information</h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><User size={12} /> Your Full Name</label>
                <input type="text" required placeholder="e.g., Md. Yousuf Khan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">📱 Mobile Number</label>
                  <input type="tel" required placeholder="01XXXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1"><MessageSquare size={12} /> WhatsApp (Optional)</label>
                  <input type="tel" placeholder="01XXXXXXXXX" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1"><MapPin size={12} /> Select District</label>
                <select required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                  <option value="">-- Select Destination --</option>
                  <option value="Dhaka">Inside Dhaka (Delivery 60৳)</option>
                  <option value="Outside">Outside Dhaka (Delivery 120৳)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Detailed Address (Village, Thana, Road No)</label>
                <textarea required placeholder="Write complete structural address details here..." value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-3 h-16 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none resize-none" />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-2.5 rounded-xl border text-[11px] sm:text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Truck size={14} /> Cash On Delivery</button>
                  <button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-2.5 rounded-xl border text-[11px] sm:text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-500/10 text-pink-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Smartphone size={14} /> bKash</button>
                  <button type="button" onClick={() => setPaymentMethod('nagad')} className={`p-2.5 rounded-xl border text-[11px] sm:text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}><Smartphone size={14} /> Nagad</button>
                </div>
              </div>

              {paymentMethod !== 'cod' && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border dark:border-slate-800">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">👉 Please Send Money total <strong>৳{finalAmount}</strong> to our Personal Number (<strong>01771183608</strong>) and input credentials below.</p>
                  <div><input type="tel" required placeholder="Sender Wallet Account Number" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} className="w-full p-2.5 text-xs rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" /></div>
                  <div><input type="text" required placeholder="Transaction ID (TxID)" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full p-2.5 text-xs rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none" /></div>
                </motion.div>
              )}

              <div className="border-t pt-4 border-slate-100 dark:border-slate-800/80 text-xs space-y-2 text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex justify-between"><span>Subtotal Price:</span><span>৳ {totalPrice}</span></div>
                <div className="flex justify-between"><span>Delivery Charge:</span><span>৳ {deliveryCharge}</span></div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t pt-2 dark:border-slate-800/40"><span>Grand Total Bill:</span><span className="text-base font-black text-blue-600 dark:text-cyan-400">৳ {finalAmount}</span></div>
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3.5 rounded-xl text-xs sm:text-sm shadow-md uppercase tracking-wider mt-2 cursor-pointer">Confirm Order Placement</motion.button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}