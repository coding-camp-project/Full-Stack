import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"

const faqs = [
  {
    question: "Apa itu Nutrify?",
    answer:
      "Nutrify adalah platform berbasis AI yang membantu kamu mengenali makanan, menganalisis nutrisi, dan memberikan rekomendasi pola makan yang lebih sehat.",
  },

  {
    question: "Bagaimana cara scan makanan di Nutrify?",
    answer:
      "Kamu cukup upload atau ambil foto makanan menggunakan kamera, lalu AI Nutrify akan mendeteksi jenis makanan dan menampilkan informasi nutrisinya secara otomatis.",
  },

  {
    question: "Apakah Nutrify bisa digunakan untuk diet tertentu?",
    answer:
      "Ya, Nutrify dapat memberikan rekomendasi berdasarkan kebutuhan kesehatan dan pola diet tertentu seperti diabetes, hipertensi, atau program penurunan berat badan.",
  },

  {
    question: "Apakah data riwayat makanan saya tersimpan?",
    answer:
      "Tentu, semua riwayat scan makanan dan analisis nutrisi akan tersimpan di dashboard agar kamu bisa memantau perkembangan pola makan harianmu.",
  },

  {
    question: "Apakah Nutrify gratis digunakan?",
    answer:
      "Sebagian fitur dasar Nutrify dapat digunakan secara gratis, namun beberapa fitur premium dan analisis lanjutan tersedia melalui paket berlangganan.",
  },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative overflow-hidden bg-[#FAFFFC] py-28 px-6">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* LEFT CIRCLE */}
      <div className="absolute bottom-[-120px] left-[-120px] w-[260px] h-[260px] border border-[#8DB9FF]/20 rounded-full" />

      <div className="absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px] border border-[#8DB9FF]/10 rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* BADGE */}
        <div className="flex justify-center">

          <div className="bg-[#DDF5EC] text-[#3e9d7d] px-5 py-2 rounded-full text-sm font-medium">
            FAQ
          </div>

        </div>

        {/* TITLE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.3 }}
          className="text-center mt-6"
        >

          <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">
            Pertanyaan yang Sering Diajukan
          </h2>

          <p className="text-gray-500 mt-4 text-sm md:text-base">
            Semua yang perlu kamu ketahui tentang layanan nutrisi kami
          </p>

        </motion.div>

        {/* FAQ LIST */}
        <div className="mt-16 space-y-5">

          {faqs.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
              >

                {/* QUESTION */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-6 py-6 text-left"
                >

                  <h3 className="font-semibold text-[#111111] text-sm md:text-base">
                    {item.question}
                  </h3>

                  <div className="text-[#3e9d7d]">

                    {isOpen ? (
                      <Minus size={22} />
                    ) : (
                      <Plus size={22} />
                    )}

                  </div>

                </button>

                {/* ANSWER */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >

                  <div className="overflow-hidden">

                    <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                      {item.answer}
                    </p>

                  </div>

                </div>

              </motion.div>
            )
          })}

        </div>

      </div>

    </section>
  )
}

export default FAQSection
