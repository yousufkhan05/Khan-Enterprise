import React from 'react';
import { Mail, Phone, ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* অংশ ১: স্টোর পরিচিতি */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="text-blue-500" size={20} /> Khan Enterprise
          </h3>
          <p className="text-sm leading-relaxed">
            আপনার নিত্যদিনের সেরা এবং কোয়ালিটি সম্পন্ন প্রোডাক্টের বিশ্বস্ত মাধ্যম। আমরা দিচ্ছি সবচেয়ে ফাস্ট হোম ডেলিভারি।
          </p>
        </div>

        {/* অংশ ২: কন্টাক্ট ডিটেইলস */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">যোগাযোগ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={16} className="text-blue-500" />
              <a href="mailto:mdyousupkhan05@gmail.com">mdyousupkhan05@gmail.com</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={16} className="text-emerald-500" />
              <a href="https://wa.me/8801771183608" target="_blank" rel="noreferrer">
                WhatsApp: 01771183608
              </a>
            </li>
          </ul>
        </div>

        {/* অংশ ৩: পেমেন্ট মেথড */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">পেমেন্ট মেথড</h3>
          <p className="text-sm mb-3">আমরা নিরাপদ পেমেন্ট সাপোর্ট করি:</p>
          <div className="flex gap-2 text-xs font-bold text-slate-900">
            <span className="bg-pink-500 text-white px-3 py-1 rounded">bKash</span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded">Nagad</span>
            <span className="bg-slate-700 text-white px-3 py-1 rounded">COD</span>
          </div>
        </div>

      </div>
      <div className="text-center text-xs mt-10 pt-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Khan Enterprise. All rights reserved.
      </div>
    </footer>
  );
}