import scanImage from "@/assets/image1.png"
import analisisImage from "@/assets/image2.png"
import rekomendasiImage from "@/assets/image3.png"
import pantauImage from "@/assets/image4.png"
import { motion } from "framer-motion"

const features = [
  {
    image: scanImage,
    title: "Scan Makanan",
    description:
      "Ambil foto makananmu dan biarkan Nutrify mengenali jenis makanan serta menampilkan informasi nutrisinya secara instan.",
  },

  {
    image: analisisImage,
    title: "Analisis Nutrisi",
    description:
      "Lihat kandungan nutrisi seperti kalori, protein, karbohidrat, serta potensi risiko kesehatan dari setiap makanan.",
  },

  {
    image: rekomendasiImage,
    title: "Rekomendasi Personal",
    description:
      "Dapatkan saran makanan dan pola konsumsi yang disesuaikan dengan kondisi kesehatan seperti diabetes, hipertensi, dan lainnya.",
  },

  {
    image: pantauImage,
    title: "Pantau Pola Makan",
    description:
      "Pantau riwayat konsumsi, lihat perkembangan nutrisi harian, dan pahami pola makanmu untuk hidup lebih sehat.",
  },
]

function NutrifyFeatures() {
  return (
    <section className="relative overflow-hidden bg-[#FAFFFC] px-4 py-16 sm:px-6 sm:py-20 lg:py-28">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* CIRCLE EFFECT */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] border border-[#8DB9FF]/30 rounded-full" />

      <div className="absolute top-[-60px] left-[-60px] w-[220px] h-[220px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] border border-[#8DB9FF]/10 rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* BADGE */}
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
            untuk <span className="text-[#3e9d7d]">Pola Makan Lebih Sehat</span>
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Nutrify membantu kamu memahami makanan,
            mengenali nutrisi, dan memberikan rekomendasi
            kesehatan secara personal dalam satu platform.
          </p>

        </motion.div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">

          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center gap-5 rounded-[28px] border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-center sm:gap-6 sm:p-8 sm:text-left"
            >

              {/* IMAGE */}
              <div className="relative shrink-0 sm:shrink-0">

                {/* GLOW */}
                <div className="absolute inset-0 bg-[#3e9d7d]/10 blur-2xl rounded-full" />

                <img
                  src={item.image}
                  alt={item.title}
                  className="relative mx-auto h-auto w-[90px] object-contain sm:mx-0 md:w-[140px]"
                />

              </div>

              {/* CONTENT */}
              <div className="min-w-0 flex-1">

                <h3 className="text-xl font-semibold text-[#111111]">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mt-4">
                  {item.description}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default NutrifyFeatures
