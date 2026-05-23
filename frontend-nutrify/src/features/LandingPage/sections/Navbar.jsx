import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import logoNutrify from "@/assets/Nutrify-Logo.png"
import { useUserSession } from "@/hooks/useUserSession"
import { AnimatePresence, motion } from "framer-motion"

const navLinks = [
  { name: "Beranda", id: "beranda" },
  { name: "Tentang", id: "tentang" },
  { name: "Layanan", id: "layanan" },
  { name: "Tim Kami", id: "tim-kami" },
  { name: "Blog", id: "blog" },
  { name: "FAQ", id: "faq" },
]

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("beranda")
  const { isPersonalized, userData } = useUserSession()
  const isLoggedIn = Boolean(userData && userData.email)

  // Listen for scroll events to change navbar styling dynamically
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Active section tracking
      const scrollPosition = window.scrollY + 120 // offset for fixed navbar
      
      for (const link of navLinks) {
        const element = document.getElementById(link.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(link.id)
          }
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`fixed left-0 top-0 z-50 flex w-full max-w-[100vw] flex-col items-center px-3 transition-all duration-300 sm:px-4 ${isScrolled ? "pt-2 md:pt-3" : "pt-3 sm:pt-4 md:pt-6"}`}>
      <nav className={`relative w-full max-w-6xl rounded-full border border-white/50 bg-white/80 px-3 py-2.5 backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-3 md:w-[90%] md:px-6 lg:w-[80%] ${isScrolled ? "shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"}`}>
        <div className="flex items-center justify-between w-full">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <img
              src={logoNutrify}
              alt="Nutrify Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">
              nutrify
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 text-sm font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-4 py-2.5 rounded-full transition-all duration-300 ${
                  activeSection === link.id
                    ? "bg-[#E7FFF5] text-[#12B76A] font-bold shadow-xs"
                    : "text-gray-600 hover:text-[#12B76A] hover:bg-green-50/50"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoggedIn ? (
              <Link to={isPersonalized ? "/dashboard" : "/personalisasi"}>
                <Button className="hidden sm:flex bg-[#12B76A] hover:bg-[#0FA968] rounded-full px-6 md:px-8 py-5 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="hidden sm:flex bg-[#12B76A] hover:bg-[#0FA968] rounded-full px-6 md:px-8 py-5 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Masuk
                </Button>
              </Link>
            )}
            
            {/* MOBILE MENU TOGGLE */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`w-full bg-white border border-gray-200 rounded-[24px] shadow-xl md:hidden transition-all duration-200 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "mt-2 opacity-100 translate-y-0 max-h-[450px] p-4 visible"
            : "opacity-0 -translate-y-2 max-h-0 p-0 border-none invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 text-base font-semibold text-gray-700">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-colors duration-150 ${
                activeSection === link.id
                  ? "bg-[#E7FFF5] text-[#12B76A] font-extrabold"
                  : "text-gray-600 active:bg-gray-50"
              }`}
            >
              <span>{link.name}</span>
              {activeSection === link.id && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />
              )}
            </a>
          ))}
          
          <div className="h-px bg-gray-200/60 my-2.5 w-full"></div>
          
          {isLoggedIn ? (
            <Link to={isPersonalized ? "/dashboard" : "/personalisasi"} className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="bg-[#12B76A] hover:bg-[#0FA968] active:scale-98 rounded-full py-5 text-white font-semibold shadow-md w-full transition-transform">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="bg-[#12B76A] hover:bg-[#0FA968] active:scale-98 rounded-full py-5 text-white font-semibold shadow-md w-full transition-transform">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
