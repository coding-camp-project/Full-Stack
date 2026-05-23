import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import heroBot from "@/assets/hero-bot.png"
import { ArrowRight, ScanLine } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { auth } from "@/config/firebase"

// Standalone isolated typing text component to prevent re-rendering the whole Hero section
function TypingText() {
  const words = ["Nutrisi Pintar", "Hidup Lebih Sehat", "Diet Seimbang", "Gizi Ideal"]
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    let timer;
    const fullText = words[currentWordIdx]

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1))
        setTypingSpeed(90)

        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 2500)
          return
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1))
        setTypingSpeed(45)

        if (currentText === "") {
          setIsDeleting(false)
          setCurrentWordIdx((prev) => (prev + 1) % words.length)
        }
      }
    }

    timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIdx, typingSpeed])

  return (
    <span className="text-white relative">
      {currentText}
      <span className="inline-block w-[3px] h-[0.85em] bg-white ml-1.5 align-middle animate-pulse will-change-[opacity]" />
    </span>
  )
}

function Hero() {
  const navigate = useNavigate()

  const handleAction = () => {
    // Mengecek apakah ada user yang sedang login
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (auth.currentUser || token) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <section id="beranda" className="relative flex min-h-screen items-center overflow-hidden bg-[#12B76A] rounded-b-[40px] md:rounded-b-[60px]">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#12B76A] via-[#0FA968] to-[#0B8F61] z-0" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.05] z-0">
        <div className="w-full h-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px] md:bg-[size:80px_80px]" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute right-[-15%] top-[-10%] z-0 h-[40vw] max-h-80 w-[40vw] max-w-80 rounded-full bg-white/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] z-0 h-[35vw] max-h-72 w-[35vw] max-w-72 rounded-full bg-[#0B8F61]/50 blur-[100px]" />

      {/* CONTENT W/ Z-INDEX TO STAY ABOVE BACKGROUND */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20 md:pt-40 md:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* LEFT / TEXT */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-1/2 text-white flex flex-col text-center lg:text-left items-center lg:items-start"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight min-h-[2.2em]">
            Jalan Menuju <br className="hidden sm:block" />
            <TypingText />
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

        {/* RIGHT / MASCOT */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="relative mt-10 flex w-full min-w-0 justify-center lg:mt-0 lg:w-1/2"
        >
          {/* GLOW – behind mascot */}
          <div
            className="pointer-events-none absolute left-1/2 top-[55%] z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white/30 blur-[80px] sm:h-[320px] sm:w-[320px] md:h-[350px] md:w-[350px]"
            aria-hidden="true"
          />

          {/* Mascot – contained inside hero, no extra scroll */}
          <div className="relative z-10 mx-auto w-full max-w-full px-2 sm:px-4">
            <img
              src={heroBot}
              alt="Nutrify Bot"
              className="relative z-10 mx-auto block h-auto w-full max-w-[280px] object-contain object-[50%_48%] drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] transition-transform duration-700 sm:max-w-[380px] md:max-w-[450px] lg:max-w-[520px] lg:hover:-translate-y-4 lg:hover:scale-105"
            />
            
            {/* Floating Element 1 */}
            <div
              className="absolute top-[18%] left-1 z-20 block rounded-xl bg-white/90 px-2.5 py-1 text-xs font-bold text-[#12B76A] shadow-xl backdrop-blur animate-bounce sm:left-0 sm:px-4 sm:py-2 sm:text-sm md:left-2"
              style={{ animationDuration: "3s" }}
            >
              🥑 120 kkal
            </div>
            
            {/* Floating Element 2 */}
            <div
              className="absolute bottom-[22%] right-1 z-20 block rounded-xl bg-white/90 px-2.5 py-1 text-xs font-bold text-[#12B76A] shadow-xl backdrop-blur animate-bounce sm:right-0 sm:px-4 sm:py-2 sm:text-sm md:right-2"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            >
              🥗 Tinggi Protein
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
