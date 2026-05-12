import {
  Mail,
  Phone,
  Globe,
} from "lucide-react"

import nutrifyLogo from "@/assets/hero-bot.png"

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0D3B66] px-6 pt-20 pb-10">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_right,#38bdf810_1px,transparent_1px)] bg-[size:90px_90px]" />
      </div>

      {/* LEFT CIRCLE */}
      <div className="absolute bottom-[-120px] left-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/30 rounded-full" />

      <div className="absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/20 rounded-full" />

      {/* RIGHT CIRCLE */}
      <div className="absolute top-[-120px] right-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/30 rounded-full" />

      <div className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* TOP FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* BRAND */}
          <div>

            {/* LOGO */}
            <div className="flex items-center gap-4">

              <img
                src={nutrifyLogo}
                alt="Nutrify"
                className="w-14 h-14 object-contain"
              />

              <h2 className="text-3xl font-bold text-white">
                nutrify
              </h2>

            </div>

            {/* DESCRIPTION */}
            <p className="text-[#D4E5F7] mt-6 leading-relaxed text-sm">
              Empowering healthier lives through personalized
              nutrition and evidence based guidance.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4 mt-8">

              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#3e9d7d] transition-all duration-300 flex items-center justify-center text-white">

                <Mail size={18} />

              </button>

              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#3e9d7d] transition-all duration-300 flex items-center justify-center text-white">

                <Globe size={18} />

              </button>

              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#3e9d7d] transition-all duration-300 flex items-center justify-center text-white">

                <Phone size={18} />

              </button>

            </div>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h3 className="text-white text-xl font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4 mt-6 text-[#D4E5F7] text-sm">

              <a href="#" className="hover:text-white transition">
                Home
              </a>

              <a href="#" className="hover:text-white transition">
                About
              </a>

              <a href="#" className="hover:text-white transition">
                Features
              </a>

              <a href="#" className="hover:text-white transition">
                FAQ
              </a>

            </div>

          </div>

          {/* SERVICES */}
          <div>

            <h3 className="text-white text-xl font-semibold">
              Services
            </h3>

            <div className="flex flex-col gap-4 mt-6 text-[#D4E5F7] text-sm">

              <a href="#" className="hover:text-white transition">
                Nutrition Analysis
              </a>

              <a href="#" className="hover:text-white transition">
                AI Recommendation
              </a>

              <a href="#" className="hover:text-white transition">
                Food Tracking
              </a>

              <a href="#" className="hover:text-white transition">
                Healthy Lifestyle
              </a>

            </div>

          </div>

          {/* CONTACT */}
          <div>

            <h3 className="text-white text-xl font-semibold">
              Contact
            </h3>

            <div className="flex flex-col gap-4 mt-6 text-[#D4E5F7] text-sm">

              <p>
                nutrify@gmail.com
              </p>

              <p>
                +62 812 3456 7890
              </p>

              <p>
                Depok, Indonesia
              </p>

              <p>
                Gunadarma University
              </p>

            </div>

          </div>

        </div>

        {/* LINE */}
        <div className="w-full h-[1px] bg-white/10 mt-16" />

        {/* COPYRIGHT */}
        <div className="text-center text-[#D4E5F7] text-sm mt-8 leading-relaxed">

          © 2026 Nutrify. All rights reserved |
          Privacy Policy |
          Terms of Service

        </div>

      </div>

    </footer>
  )
}

export default Footer
