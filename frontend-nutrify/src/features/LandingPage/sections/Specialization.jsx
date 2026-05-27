import {
  Leaf,
  ChartPie,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const features = [
  {
    icon: Leaf,
    title: "Scan Makanan",
    to: "/scan",
    description:
      "Cukup ambil foto makananmu, Nutrify akan mengenali jenis makanan dan menampilkan kandungan nutrisinya secara otomatis.",
  },

  {
    icon: ChartPie,
    title: "Analisis Nutrisi",
    to: "/scan",
    description:
      "Dapatkan informasi lengkap seperti kalori, protein, karbohidrat, lemak, dan kandungan lainnya untuk setiap makanan.",
  },

  {
    icon: ShieldCheck,
    title: "Chatbot",
    to: "/chatbot",
    description:
      "Tanyakan apa saja seputar nutrisi, kondisi kesehatan, atau rekomendasi makanan, dan dapatkan jawaban instan dari AI.",
  },

  {
    icon: LayoutDashboard,
    title: "Dashboard",
    to: "/dashboard",
    description:
      "Lihat riwayat makanan, pantau nutrisi harian, dan pahami pola makanmu untuk hidup lebih sehat.",
  },
]

function Specialization() {
  return (
    <section id="layanan" className="relative overflow-hidden bg-[#F8FFFC] py-28 px-6">

      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* CIRCLE EFFECT */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 h-[300px] w-[300px] rounded-full border border-[#3e9d7d]/20" />
      <div className="pointer-events-none absolute top-10 right-10 z-0 h-[200px] w-[200px] rounded-full border border-[#3e9d7d]/10" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* TAG */}
        <div className="flex justify-center">
          <div className="bg-[#DDF5EC] text-[#3e9d7d] px-5 py-2 rounded-full text-sm font-medium">
            Proses Simple
          </div>
        </div>

        {/* TITLE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="text-center mt-6"
        >

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#111111]">
            Semua yang Kamu Butuhkan
            <br />
            untuk <span className="text-[#3e9d7d]">Hidup </span>
            Lebih Sehat
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Semua yang kamu butuhkan untuk memahami makanan dan menjaga kesehatan,
            dalam satu platform.
          </p>

        </motion.div>

        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 items-stretch">

          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative z-10 flex h-full flex-col bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* ICON */}
                <div className="w-12 h-12 rounded-full bg-[#E8F6F0] flex items-center justify-center">

                  <Icon
                    size={22}
                    className="text-[#3e9d7d]"
                  />

                </div>

                {/* TITLE */}
                <h3 className="text-xl font-semibold mt-6 text-[#111111]">
                  {item.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-500 text-sm leading-relaxed mt-4">
                  {item.description}
                </p>

                {/* LINK */}
                <Link
                  to={item.to}
                  className="relative z-20 mt-auto pt-8 inline-flex cursor-pointer items-center text-sm font-medium text-[#3e9d7d] transition-all hover:translate-x-1 hover:text-[#2d8a6a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3e9d7d]/40 focus-visible:ring-offset-2 rounded-sm"
                >
                  Lihat Selengkapnya →
                </Link>

              </motion.div>
            )
          })}

        </div>

      </div>

    </section>
  )
}

export default Specialization
