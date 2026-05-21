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
      className="flex min-h-dvh w-full max-w-[100vw] overflow-x-hidden"
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
      <div className="relative flex w-full min-h-dvh items-center justify-center overflow-y-auto bg-white lg:min-h-0 lg:w-1/2 lg:overflow-hidden">
        
        {/* Back Button */}
        <Link to="/" className="absolute top-4 left-4 z-20 flex items-center gap-2 text-gray-400 transition-colors group hover:text-[#12B76A] sm:top-8 sm:left-8">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Beranda</span>
        </Link>

        <div className="relative z-10 w-full max-w-md px-5 py-16 sm:px-8 sm:py-12">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
