import nutrifyLogo from "@/assets/Nutrify-Logo.png"
import mockupImg from "@/assets/Login.png"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({ children, isRegister }) {
  // Variasi animasi untuk seluruh halaman (fade + slight scale)
  const pageVariants = {
    initial: { opacity: 0, x: isRegister ? 50 : -50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: isRegister ? 50 : -50, transition: { duration: 0.4, ease: "easeIn" } }
  };

  return (
    <motion.div 
      className="h-screen overflow-hidden flex w-full"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Left Side - Green Background */}
      <div className={`hidden lg:flex w-1/2 bg-gradient-to-br from-[#12B76A] to-[#087F5B] relative overflow-hidden flex-col items-center justify-center p-12 ${isRegister ? 'order-2' : ''}`}>
        
        {/* Top Logo */}
        <div className={`absolute top-8 ${isRegister ? 'right-8 flex-row-reverse' : 'left-8'} flex items-center gap-2 z-20`}>
          <img src={nutrifyLogo} alt="Nutrify" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl tracking-wide">nutrify</span>
        </div>

        {/* Decorative Circles */}
        <div className={`absolute top-[-20%] ${isRegister ? 'right-[-10%]' : 'left-[-10%]'} w-[600px] h-[600px] rounded-full border border-white/20 z-0`}></div>
        <div className={`absolute top-[-10%] ${isRegister ? 'right-[-5%]' : 'left-[-5%]'} w-[400px] h-[400px] rounded-full border border-white/20 z-0`}></div>
        
        <div className={`absolute bottom-[-20%] ${isRegister ? 'left-[-10%]' : 'right-[-10%]'} w-[500px] h-[500px] rounded-full border border-white/20 z-0`}></div>
        <div className={`absolute bottom-[-10%] ${isRegister ? 'left-[-5%]' : 'right-[-5%]'} w-[300px] h-[300px] rounded-full border border-white/20 z-0`}></div>

        {/* Mockup Image */}
        <div className="relative z-10 w-full max-w-lg mt-8">
          <img src={mockupImg} alt="Nutrify App Mockup" className="w-full h-auto object-contain drop-shadow-2xl" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative">
        
        {/* Back Button */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#12B76A] transition-colors z-20 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Beranda</span>
        </Link>

        <div className="w-full max-w-md px-8 py-12 relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
