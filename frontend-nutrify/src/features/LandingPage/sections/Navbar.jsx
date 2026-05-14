import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import logoNutrify from "@/assets/nutrify-logo.png"

const navLinks = [
  { name: "Beranda", id: "beranda" },
  { name: "Tentang", id: "tentang" },
  { name: "Layanan", id: "layanan" },
  { name: "Tim Kami", id: "tim-kami" },
  { name: "FAQ", id: "faq" },
]

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("beranda")

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
    <div className={`w-full flex justify-center fixed top-0 left-0 z-50 px-4 transition-all duration-300 ${isScrolled ? "pt-2 md:pt-3" : "pt-4 md:pt-6"}`}>
      <nav className={`relative w-full md:w-[90%] lg:w-[80%] max-w-6xl bg-white/80 backdrop-blur-xl rounded-full px-4 md:px-6 py-3 border border-white/50 transition-all duration-300 ${isScrolled ? "shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"}`}>
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
                    ? "bg-[#12B76A] text-white shadow-md hover:bg-[#0FA968] hover:-translate-y-0.5"
                    : "text-gray-600 hover:text-[#12B76A] hover:bg-green-50/50"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login">
              <Button className="hidden sm:flex bg-[#12B76A] hover:bg-[#0FA968] rounded-full px-6 md:px-8 py-5 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                Masuk
              </Button>
            </Link>
            
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

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="flex flex-col px-6 py-6 gap-2 text-center text-base font-semibold text-gray-700">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 rounded-full transition-all duration-300 ${
                    activeSection === link.id
                      ? "bg-[#12B76A] text-white shadow-sm"
                      : "hover:text-[#12B76A] hover:bg-green-50/50"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-gray-200 my-2 w-full"></div>
              <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-[#12B76A] hover:bg-[#0FA968] rounded-full py-6 text-white font-semibold shadow-md w-full">
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
