import { CheckCircle2 } from "lucide-react"
import foodImage from "@/assets/healthy-food-img.png"
import { motion } from "framer-motion"

const benefits = [
  "Strategi nutrisi berbasis sains",
  "Rekomendasi sehat terpersonalisasi",
  "Lacak nutrisi harian dengan mudah",
  "Analisis makanan didukung AI",
  "Bangun kebiasaan makan yang sehat",
]

function WhyChoose() {
  return (
    <section id="tentang" className="relative overflow-hidden bg-[#F8FFFC]">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* CIRCLE EFFECT */}
      <div className="absolute top-[-80px] md:top-[-120px] right-[-80px] md:right-[-120px] w-[180px] md:w-[340px] h-[180px] md:h-[340px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute top-[-40px] md:top-[-60px] right-[-40px] md:right-[-60px] w-[120px] md:w-[240px] h-[120px] md:h-[240px] border border-[#8DB9FF]/10 rounded-full" />

      {/* MAIN SECTION */}
      <div className="relative z-10 bg-gradient-to-r from-[#0FA968] to-[#087F5B] ">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-16 lg:py-28">

          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">

            {/* LEFT CONTENT */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl text-white text-center lg:text-left"
            >

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Mengapa Memilih
                <br />
                Program Nutrify?
              </h2>

              <p className="text-green-100 mt-6 leading-relaxed text-sm md:text-base max-w-xl mx-auto lg:mx-0">
                Pendekatan kami memadukan bukti ilmiah dengan strategi nutrisi
                praktis yang mudah diterapkan dalam gaya hidup harianmu.
              </p>

              {/* BENEFITS */}
              <div className="mt-10 space-y-5">

                {benefits.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-left"
                  >

                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">

                      <CheckCircle2
                        size={16}
                        className="text-white" 
                      />

                    </div>

                    <p className="text-green-50 text-sm md:text-base leading-relaxed">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="relative"
            >

              {/* GLOW */}
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-110" />

              {/* IMAGE */}
              <img
                src={foodImage}
                alt="Healthy Food"
                className="relative w-[280px] sm:w-[340px] md:w-[430px] rounded-[28px] object-cover shadow-2xl"
              />

              {/* FLOATING CARD */}
              <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 bg-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-xl flex items-center gap-2 md:gap-3 scale-90 md:scale-100">

                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#DDF5EC] flex items-center justify-center text-sm md:text-base">
                  💚
                </div>

                <div>

                  <h4 className="text-xs md:text-sm font-semibold text-[#111111]">
                    100%
                  </h4>

                  <p className="text-[10px] md:text-xs text-gray-500">
                    Makanan Sehat
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default WhyChoose
