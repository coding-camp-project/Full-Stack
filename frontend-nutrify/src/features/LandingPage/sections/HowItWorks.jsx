import { motion } from "framer-motion"

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Mulai Scan",
      description:
        "Nutrify memberikan analisis nutrisi yang akurat dan dapat dipercaya untuk membantu kamu membuat keputusan yang lebih baik.",
    },

    {
      number: "02",
      title: "Dapatkan Hasil Nutrisi",
      description:
        "Nutrify memberikan analisis nutrisi yang akurat dan dapat dipercaya untuk membantu kamu membuat keputusan yang lebih baik.",
    },

    {
      number: "03",
      title: "Riwayat Scan",
      description:
        "Nutrify memberikan analisis nutrisi yang akurat dan dapat dipercaya untuk membantu kamu membuat keputusan yang lebih baik.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#FAFFFC] py-28 px-6">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* LEFT CIRCLE */}
      <div className="absolute bottom-[-120px] left-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/10 rounded-full" />

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
            untuk <span className="text-[#3e9d7d]">Pola Makan</span> Lebih Sehat
          </h2>

        </motion.div>

        {/* STEPS */}
        <div className="relative mt-24">

          {/* LINE */}
          <div className="hidden md:block absolute top-9 left-0 w-full h-[5px] bg-[#B9E5D4] rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">

            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative flex flex-col items-center text-center"
              >

                {/* NUMBER */}
                <div className="w-20 h-20 rounded-full bg-[#179B69] text-white flex items-center justify-center text-3xl font-bold shadow-lg relative z-10">

                  {item.number}

                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-semibold text-[#111111] mt-10">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm leading-relaxed mt-5 max-w-xs">
                  {item.description}
                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </div>

    </section>
  )
}

export default HowItWorks
