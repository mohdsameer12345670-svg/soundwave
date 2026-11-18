// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { X, Truck, Zap, ChevronRight } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export const AnnouncementBar: React.FC = () => {
//   const [visible, setVisible] = useState(true);

//     const announcements = [
//     { icon: Truck, text: 'Free shipping on orders over $75', cta: 'Shop Now', href: '/shop' },
//     { icon: Zap, text: 'Limited time: Save $50 on Apex Pro ANC', cta: 'Grab Deal', href: '/product/soundwave-apex-pro-anc' },


//   ];

//   const [current, setCurrent] = React.useState(0);

//   React.useEffect(() => {
//     const timer = setInterval(() => setCurrent(c => (c + 1) % announcements.length), 4000);
//     return () => clearInterval(timer);
//   }, []);

//   if (!visible) return null;

//   const { icon: Icon, text, cta, href } = announcements[current];

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           initial={{ height: 0, opacity: 0 }}
//           animate={{ height: 'auto', opacity: 1 }}
//           exit={{ height: 0, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-gradient-to-r from-sonic-950 via-brand-orange/10 to-sonic-950 border-b border-brand-orange/20 relative overflow-hidden"
//         >
//           {/* Shimmer overlay */}
//           <div className="absolute inset-0 shimmer pointer-events-none" />
          
//           <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 relative">
//             <div className="flex-1 flex items-center justify-center gap-3">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={current}
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -8 }}
//                   transition={{ duration: 0.3 }}
//                   className="flex items-center gap-2.5"
//                 >
//                   <Icon size={13} className="text-brand-orange shrink-0" />
//                   <span className="text-xs text-sonic-200 font-medium">{text}</span>
//                   <Link href={href} className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover transition-colors">
//                     {cta}
//                     <ChevronRight size={11} />
//                   </Link>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//             <button
//               onClick={() => setVisible(false)}
//               className="text-sonic-500 hover:text-sonic-300 transition-colors p-1 rounded shrink-0"
//               aria-label="Dismiss announcement"
//             >
//               <X size={13} />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
