import { Button } from "@/components/ui/button"
import heroBot from "@/assets/hero-bot.png"
import { ArrowRight, ScanLine } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { auth } from "@/config/firebase"

function Hero() {
  const navigate = useNavigate()

  const handleAction = () => {
    // Mengecek apakah ada user yang sedang login
    if (auth.currentUser) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <section id="beranda" className="relative overflow-hidden bg-[#12B76A] min-h-screen rounded-b-[40px] md:rounded-b-[60px] flex items-center">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#12B76A] via-[#0FA968] to-[#0B8F61] z-0" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.05] z-0">
        <div className="w-full h-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px] md:bg-[size:80px_80px]" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute right-[-20%] top-[-10%] w-[50vw] h-[50vw] bg-white/10 blur-[100px] rounded-full z-0" />
      <div className="absolute left-[-10%] bottom-[-10%] w-[40vw] h-[40vw] bg-[#0B8F61]/50 blur-[100px] rounded-full z-0" />

      {/* CONTENT W/ Z-INDEX TO STAY ABOVE BACKGROUND */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20 md:pt-40 md:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* LEFT / TEXT */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-1/2 text-white flex flex-col text-center lg:text-left items-center lg:items-start"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Jalan Menuju <br className="hidden sm:block" />
            <span className="text-white">Nutrisi Pintar</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-green-50 leading-relaxed max-w-xl">
            Pindai makananmu, pahami nutrisinya, dan dapatkan rekomendasi personal untuk pilihan yang lebih sehat setiap hari.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10 w-full sm:w-auto">
            <Button onClick={handleAction} className="w-full sm:w-auto bg-white text-[#12B76A] hover:bg-gray-100 rounded-2xl px-8 py-6 md:py-7 text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
              Mulai Perjalananmu
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={handleAction}
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#12B76A] rounded-2xl px-8 py-6 md:py-7 text-base md:text-lg font-bold shadow-lg transition-all hover:-translate-y-1 group"
            >
              <ScanLine className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Mulai Scan
            </Button>
          </div>
          
          {/* Social Proof Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/20 w-full lg:max-w-md">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">10k+</span>
              <span className="text-green-100 text-sm">Pengguna Aktif</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold">50k+</span>
              <span className="text-green-100 text-sm">Makanan Di-scan</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT / IMAGE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-1/2 relative flex justify-center mt-10 lg:mt-0"
        >
          {/* GLOW */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-white/30 blur-[80px] rounded-full animate-pulse" />

          {/* HERO IMAGE */}
          <div className="relative group perspective-1000">
            <img
              src={heroBot}
              alt="Nutrify Bot"
              className="relative z-10 w-[280px] sm:w-[380px] md:w-[450px] lg:w-[520px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-105 hover:-translate-y-4"
            />
            
            {/* Floating Element 1 */}
            <div className="absolute top-10 -left-6 sm:-left-10 bg-white/90 backdrop-blur text-[#12B76A] font-bold px-4 py-2 rounded-xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
              🥑 120 kkal
            </div>
            
            {/* Floating Element 2 */}
            <div className="absolute bottom-20 -right-6 sm:-right-10 bg-white/90 backdrop-blur text-[#12B76A] font-bold px-4 py-2 rounded-xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              🥗 Tinggi Protein
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
