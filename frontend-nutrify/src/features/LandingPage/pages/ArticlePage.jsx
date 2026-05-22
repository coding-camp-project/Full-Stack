import { useEffect } from "react";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import healthyFood from "@/assets/healthy-food.png";
import healthyFood2 from "@/assets/healthy-food-2.png";
import healthyFood3 from "@/assets/healthy-food-3.png";

const articles = {
  "bulking-prep": {
    image: healthyFood,
    category: "Perencanaan Makanan",
    title: "10 Ide Persiapan Makanan Mudah untuk Bulking",
    readTime: "Waktu baca 8 mnt",
    date: "21 Mei 2026",
    content: (
      <>
        <p className="text-xl text-gray-800 font-medium leading-relaxed">
          Bulking bukan berarti Anda bisa makan sembarangan. Untuk menaikkan berat badan dan massa otot dengan sehat, persiapan makanan (meal prep) adalah kunci utama agar Anda tetap konsisten.
        </p>

        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">1. Oatmeal Kaya Protein untuk Sarapan</h2>
        <p>
          Mulai hari Anda dengan surplus kalori yang sehat. Campurkan oatmeal dengan susu whole milk, whey protein rasa coklat, dan taburan kacang almond. Selain mudah dibuat, makanan ini bisa disimpan di kulkas semalaman (overnight oats).
        </p>

        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">2. Dada Ayam dan Nasi Merah Porsi Ganda</h2>
        <p>
          Klasik tapi efektif. Siapkan beberapa kontainer berisi dada ayam panggang, nasi merah, dan brokoli. Untuk menambah kalori, siram dengan sedikit minyak zaitun extra virgin sebelum dihangatkan.
        </p>

        <div className="bg-[#F4F7F5] p-6 rounded-2xl border-l-4 border-[#3e9d7d] my-8">
          <p className="font-semibold text-gray-800 m-0">
            💡 Tip Nutrify: Jangan takut pada lemak sehat. Alpukat, kacang-kacangan, dan minyak zaitun adalah cara termudah untuk menambah kalori tanpa merasa kekenyangan berlebihan.
          </p>
        </div>

        <p>
          Dengan mempersiapkan makanan di akhir pekan, Anda tidak perlu lagi pusing memikirkan menu setiap harinya. Cukup buka kulkas, panaskan, dan penuhi kebutuhan kalori harian Anda untuk hasil bulking yang optimal!
        </p>
      </>
    )
  },
  "protein-olahraga": {
    image: healthyFood2,
    category: "Nutrisi & Kesehatan",
    title: "Pentingnya Asupan Protein Setelah Olahraga",
    readTime: "Waktu baca 5 mnt",
    date: "18 Mei 2026",
    content: (
      <>
        <p className="text-xl text-gray-800 font-medium leading-relaxed">
          Pernahkah Anda merasa pegal-pegal yang luar biasa sehari setelah berolahraga? Ini disebut DOMS (Delayed Onset Muscle Soreness), dan asupan protein yang tepat bisa membantu meredakannya.
        </p>
        
        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Jendela Anabolik: Mitos atau Fakta?</h2>
        <p>
          Dulu, orang percaya kita harus minum protein shake dalam 30 menit setelah olahraga atau otot tidak akan tumbuh. Penelitian terbaru menunjukkan "jendela" ini jauh lebih lebar, namun mengonsumsi protein sesegera mungkin tetap memberikan manfaat pemulihan yang lebih cepat.
        </p>

        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Berapa Banyak Protein yang Dibutuhkan?</h2>
        <p>
          Rekomendasi umum adalah 20-40 gram protein setelah sesi latihan beban yang intens. Jumlah ini cukup untuk memaksimalkan sintesis protein otot (Muscle Protein Synthesis).
        </p>

        <div className="bg-[#F4F7F5] p-6 rounded-2xl border-l-4 border-[#3e9d7d] my-8">
          <p className="font-semibold text-gray-800 m-0">
            💡 Tip Nutrify: Telur rebus, yogurt Yunani, atau segelas susu coklat murni adalah alternatif yang luar biasa murah dan efektif jika Anda tidak memiliki suplemen protein bubuk.
          </p>
        </div>
      </>
    )
  },
  "diet-sehat": {
    image: healthyFood3,
    category: "Tips Diet",
    title: "Cara Menurunkan Berat Badan Tanpa Tersiksa",
    readTime: "Waktu baca 6 mnt",
    date: "12 Mei 2026",
    content: (
      <>
        <p className="text-xl text-gray-800 font-medium leading-relaxed">
          Diet ketat yang menyiksa justru sering berujung pada efek yoyo (berat badan turun cepat, namun naik lagi lebih cepat). Kunci dari penurunan berat badan yang awet adalah perubahan gaya hidup yang bisa dinikmati.
        </p>

        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Makan Sesuai Volume (Volume Eating)</h2>
        <p>
          Ini adalah teknik di mana Anda mengonsumsi makanan yang volumenya besar tapi kalorinya rendah. Contoh terbaik adalah sayuran berdaun hijau, semangka, sup kaldu bening, dan stroberi. Anda bisa makan hingga kenyang tanpa merusak target defisit kalori Anda!
        </p>

        <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Perhatikan Minuman Anda</h2>
        <p>
          Seringkali kita tidak sadar meminum ratusan kalori dari kopi susu kekinian, boba, atau teh manis. Ganti secara perlahan ke versi "less sugar" atau beralih ke teh tawar dan kopi hitam.
        </p>

        <div className="bg-[#F4F7F5] p-6 rounded-2xl border-l-4 border-[#3e9d7d] my-8">
          <p className="font-semibold text-gray-800 m-0">
            💡 Tip Nutrify: Gunakan aturan 80/20. 80% dari asupan kalori Anda berasal dari makanan padat nutrisi utuh (whole foods), dan sisa 20% bebas Anda gunakan untuk makanan kesukaan seperti cokelat atau es krim.
          </p>
        </div>
      </>
    )
  }
};

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Ambil artikel sesuai id, atau gunakan artikel pertama sebagai fallback
  const article = articles[id] || articles["bulking-prep"];

  return (
    <div className="min-h-screen bg-[#FAFFFC]">
      {/* Navbar Minimalis */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#3e9d7d] transition-colors bg-transparent border-none cursor-pointer outline-none"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali ke Beranda</span>
          </button>
        </div>
      </nav>

      {/* Konten Artikel */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Artikel */}
        <header className="mb-10 text-center">
          <div className="inline-block bg-[#DDF5EC] text-[#3e9d7d] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            {article.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#111111] leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Tim Nutrify</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Gambar Utama */}
        <div className="rounded-[32px] overflow-hidden mb-12 shadow-lg">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Isi Artikel */}
        <article className="max-w-none text-gray-600 space-y-6 leading-relaxed">
          {article.content}
        </article>
      </main>
    </div>
  );
}

export default ArticlePage;
