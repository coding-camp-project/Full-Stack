import nutrifyLogo from "@/assets/nutrify-logo.png"
import mockupImg from "@/assets/logo/Logo 2.png"

export default function AuthLayout({ children, isRegister }) {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Green Background */}
      <div className={`hidden lg:flex w-1/2 bg-[#12B76A] relative overflow-hidden flex-col items-center justify-center p-12 ${isRegister ? 'order-2' : ''}`}>
        
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAFAFA] relative">
        {/* Subtle Vertical Stripes Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, #000 40px, #000 80px)" }}></div>
        
        <div className="w-full max-w-md px-8 py-12 relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          {children}
        </div>
      </div>
    </div>
  )
}
