import { ArrowRight } from "lucide-react"
import healthyFood from "@/assets/healthy-food.png"
import { motion } from "framer-motion"

const blogs = [
  {
    image: healthyFood,
    category: "Meals Planning",
    title: "10 Easy Meal Prep Ideas for Bulky",
    readTime: "8 min read",
  },

  {
    image: healthyFood,
    category: "Meals Planning",
    title: "10 Easy Meal Prep Ideas for Bulky",
    readTime: "8 min read",
  },

  {
    image: healthyFood,
    category: "Meals Planning",
    title: "10 Easy Meal Prep Ideas for Bulky",
    readTime: "8 min read",
  },
]

function BlogSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFFFC] py-28 px-6">

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
            Models
          </div>

        </div>

        {/* TITLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="text-center mt-6"
        >

          <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">
            Nutrition Blog & Article
          </h2>

          <p className="text-gray-500 mt-4 text-sm md:text-base">
            Everything you need to know about our nutrition services
          </p>

        </motion.div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {blogs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border border-[#E5E7EB] rounded-[28px] overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden h-[260px]">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* CATEGORY */}
                <div className="absolute top-4 left-4 bg-[#3e9d7d] text-white text-xs px-4 py-2 rounded-full shadow-md">
                  {item.category}
                </div>

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <h3 className="text-2xl font-semibold leading-snug text-[#111111]">
                  {item.title}
                </h3>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-8">

                  <p className="text-sm text-gray-400">
                    {item.readTime}
                  </p>

                  <button className="w-10 h-10 rounded-full bg-[#F4F7F5] hover:bg-[#3e9d7d] hover:text-white transition-all duration-300 flex items-center justify-center text-[#111111]">

                    <ArrowRight size={18} />

                  </button>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default BlogSection