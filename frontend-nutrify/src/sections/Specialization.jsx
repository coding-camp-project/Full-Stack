import {
  Leaf,
  ChartPie,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Scan Makanan",
    description:
      "Cukup ambil foto makananmu, Nutrify akan mengenali jenis makanan dan menampilkan kandungan nutrisinya secara otomatis.",
  },

  {
    icon: ChartPie,
    title: "Analisis Nutrisi",
    description:
      "Dapatkan informasi lengkap seperti kalori, protein, karbohidrat, lemak, dan kandungan lainnya untuk setiap makanan.",
  },

  {
    icon: ShieldCheck,
    title: "Rekomendasi",
    description:
      "Nutrify memberikan saran makanan berdasarkan kondisi kesehatanmu seperti diabetes, hipertensi, dan lainnya.",
  },

  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Lihat riwayat makanan, pantau nutrisi harian, dan pahami pola makanmu untuk hidup lebih sehat.",
  },
]

function Specialization() {
  return (
    <section className="relative overflow-hidden bg-[#F8FFFC] py-28 px-6">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* CIRCLE EFFECT */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] border border-[#3e9d7d]/20 rounded-full" />
      <div className="absolute top-10 right-10 w-[200px] h-[200px] border border-[#3e9d7d]/10 rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* TAG */}
        <div className="flex justify-center">
          <div className="bg-[#DDF5EC] text-[#3e9d7d] px-5 py-2 rounded-full text-sm font-medium">
            Proses Simple
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mt-6">

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#111111]">
            Semua yang Kamu Butuhkan Lebih
            <br />
            untuk <span className="text-[#3e9d7d]">Hidup </span>
            Lebih Sehat
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Semua yang kamu butuhkan untuk memahami makanan dan menjaga kesehatan,
            dalam satu platform.
          </p>

        </div>

        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300"
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
                <button className="mt-8 text-[#3e9d7d] font-medium text-sm hover:translate-x-1 transition-all">
                  Lihat Selengkapnya →
                </button>

              </div>
            )
          })}

        </div>

      </div>

    </section>
  )
}

export default Specialization