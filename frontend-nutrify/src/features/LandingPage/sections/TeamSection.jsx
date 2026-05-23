import {
  BriefcaseBusiness,
  BrainCircuit,
  Database,
} from "lucide-react"
import { motion } from "framer-motion"

import team1 from "@/assets/team-1.png"
import team2 from "@/assets/team-2.png"
import team3 from "@/assets/team-3.png"
import team4 from "@/assets/team-4.png"
import team5 from "@/assets/team-5.png"
import team6 from "@/assets/team-6.png"

import logoDbs from "@/assets/logo-dbs.png"
import logoDicoding from "@/assets/logo-dicoding.png"

const teams = [
  {
    image: team1,
    name: "Iqbal Apriand Juartono",
    university: "Universitas Gunadarma",
    role: "Fullstack Developer",
    icon: BriefcaseBusiness,
    color: "text-[#3e9d7d]",
    mobileOrder: "order-1",
  },

  {
    image: team2,
    name: "Danar Mas Saputra",
    university: "Universitas Gunadarma",
    role: "AI Engineer",
    icon: BrainCircuit,
    color: "text-pink-500",
    mobileOrder: "order-3",
  },

  {
    image: team3,
    name: "Vlaura",
    university: "Universitas Gunadarma",
    role: "Data Scientist",
    icon: Database,
    color: "text-yellow-500",
    mobileOrder: "order-5",
  },

  {
    image: team4,
    name: "Faqih Ikhtibar",
    university: "Universitas Gunadarma",
    role: "Fullstack Developer",
    icon: BriefcaseBusiness,
    color: "text-[#3e9d7d]",
    mobileOrder: "order-2",
  },

  {
    image: team5,
    name: "Raya Sesan",
    university: "Universitas Gunadarma",
    role: "AI Engineer",
    icon: BrainCircuit,
    color: "text-pink-500",
    mobileOrder: "order-4",
  },

  {
    image: team6,
    name: "Faiz Akhsan",
    university: "Universitas Gunadarma",
    role: "Data Scientist",
    icon: Database,
    color: "text-yellow-500",
    mobileOrder: "order-6",
  },
]

function TeamSection() {
  return (
    <section id="tim-kami" className="relative overflow-hidden bg-[#FAFFFC] py-28 px-6">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* LEFT CIRCLE */}
      <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute top-[-60px] left-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/10 rounded-full" />

      {/* RIGHT CIRCLE */}
      <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute bottom-[-60px] right-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/10 rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* BADGE */}
        <div className="flex justify-center">

          <div className="bg-[#DDF5EC] text-[#3e9d7d] px-5 py-2 rounded-full text-sm font-medium">
            Tim Kami
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
            Orang-Orang di Balik
            <br />
            Layar
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Nutrify membantu kamu memahami makanan,
            mengenali nutrisi, dan memberikan rekomendasi
            kesehatan secara personal dalam satu platform.
          </p>

        </motion.div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {teams.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white border border-[#D1F2E5] rounded-[28px] overflow-hidden hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(73,174,132,0.15)] hover:border-[#49AE84] transition-all duration-300 ${item.mobileOrder} sm:order-none`}
              >

                {/* IMAGE */}
                <div className="relative h-[400px] flex items-end justify-center overflow-hidden bg-gray-50">
                  {/* LOGOS ON CORNERS */}
                  <div className="absolute top-6 left-6 z-20 w-[95px] xs:w-[105px] sm:w-[115px] drop-shadow-sm select-none">
                    <img src={logoDbs} alt="DBS Foundation" className="w-full h-auto object-contain" />
                  </div>
                  <div className="absolute top-[32px] right-6 z-20 w-[55px] xs:w-[62px] sm:w-[70px] drop-shadow-sm select-none">
                    <img src={logoDicoding} alt="Dicoding" className="w-full h-auto object-contain" />
                  </div>

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3e9d7d]/50 via-[#3e9d7d]/10 to-transparent" />

                  {/* TEXT */}
                  <div className="absolute bottom-6 left-6 z-10 text-white">

                    <h3 className="font-semibold text-lg leading-tight tracking-wide">
                      {item.name}
                    </h3>

                    <p className="text-xs text-white mt-1">
                      {item.university}
                    </p>

                  </div>

                </div>

                {/* ROLE */}
                <div className="flex items-center gap-3 px-6 py-5 bg-[#F4FFF9] border-t border-[#E7FFF5]">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-[#E7FFF5]">
                    <Icon
                      size={18}
                      className={item.color}
                    />
                  </div>

                  <p className="font-semibold text-sm text-[#1E1E1E] tracking-wide">
                    {item.role}
                  </p>

                </div>

              </motion.div>
            )
          })}

        </div>

      </div>

    </section>
  )
}

export default TeamSection
