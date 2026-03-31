import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a1208] text-[#f8f0d7] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-black">E</span>
              </div>
              <span className="text-xl font-black text-white">Event<span className="text-[#c4922a]">Hive</span></span>
            </div>
            <p className="text-sm text-[#a09070] leading-relaxed mb-4">
              Your one-stop marketplace for event decorations — buy, rent, or book complete setup.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#c4922a] uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#a09070]">
              {[['/', 'Home'], ['/shop', 'Shop Products'], ['/events', 'Event Packages'], ['/register', 'Become a Vendor']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-[#c4922a] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-[#c4922a] uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-[#a09070]">
              {['Balloons', 'Lights & LEDs', 'Floral Decor', 'Props & Backdrops', 'Birthday Packages', 'Wedding Packages'].map(c => (
                <li key={c}><span className="hover:text-[#c4922a] transition-colors cursor-pointer">{c}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-[#c4922a] uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[#a09070]">
              <li className="flex items-center gap-2">support@eventhive.in</li>
              <li className="flex items-center gap-2">+91 98765 43210</li>
              <li className="flex items-start gap-2">Bengaluru, Karnataka, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2d1f0e] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#5a4a35]">
          <p>© 2025 EventHive Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#c4922a]">Privacy Policy</a>
            <a href="#" className="hover:text-[#c4922a]">Terms of Service</a>
            <a href="#" className="hover:text-[#c4922a]">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
