import {
  Lock,
  User,
  Activity,
  Leaf,
  Target,
  Info,
  Calendar,
  Weight,
  Ruler,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

function PersonalizationPage() {
  const [formData, setFormData] = useState({
    nama: "",
    tanggalLahir: "",
    jenisKelamin: "Perempuan",
    tinggi: "",
    berat: "",
    aktivitas: "Sedang",
    riwayatKesehatan: [],
    penyakitLain: "",
    alergi: [],
    pantangan: [],
    tujuan: "Menjaga Berat Badan",
    preferensi: [],
    catatan: ""
  });

  const penyakitOptions = ["Diabetes", "Hipertensi", "Kolesterol Tinggi", "Asam Urat", "Alergi Makanan", "Maag / GERD", "Tidak Ada"];
  const preferensiOptions = ["Sayuran", "Buah", "Daging", "Ikan", "Telur", "Kacang-kacangan"];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalisasi</h1>
        <p className="text-gray-500 mb-6">Lengkapi informasi dirimu agar kami dapat memberikan rekomendasi gizi yang lebih akurat dan sesuai kebutuhanmu.</p>
        
        <div className="inline-flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] px-4 py-3 rounded-lg border border-[#A6F4C5] text-sm font-medium">
          <Lock className="w-4 h-4" />
          Data kamu aman dan hanya digunakan untuk memberikan rekomendasi gizi personal.
        </div>
      </div>

      {/* 1. DATA DIRI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
          <User className="w-5 h-5 text-[#12B76A]" />
          1. Data Diri
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" placeholder="Isi nama lengkap kamu di sini" defaultValue={formData.nama} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Tanggal Lahir</label>
            <input 
              type="text" 
              placeholder="Isi tanggal lahir kamu di sini" 
              defaultValue={formData.tanggalLahir} 
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm bg-white" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
            <select defaultValue={formData.jenisKelamin} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm bg-white">
              <option>Perempuan</option>
              <option>Laki-laki</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Tinggi Badan</label>
            <div className="relative">
              <input type="number" placeholder="Isi tinggi badan kamu di sini" defaultValue={formData.tinggi} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Berat Badan</label>
            <div className="relative">
              <input type="number" placeholder="Isi berat badan kamu di sini" defaultValue={formData.berat} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Tingkat Aktivitas</label>
            <select defaultValue={formData.aktivitas} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm bg-white">
              <option>Ringan</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. RIWAYAT KESEHATAN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
          <Activity className="w-5 h-5 text-[#12B76A]" />
          2. Riwayat Kesehatan
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Penyakit / Kondisi</label>
              <div className="flex flex-wrap gap-3">
                {penyakitOptions.map(p => (
                  <label key={p} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${formData.riwayatKesehatan.includes(p) ? 'border-[#12B76A] bg-[#F6FEF9] text-[#12B76A]' : 'border-gray-200 text-gray-600'} cursor-pointer hover:bg-gray-50 transition-colors text-sm`}>
                    <input type="checkbox" defaultChecked={formData.riwayatKesehatan.includes(p)} className="hidden" />
                    {formData.riwayatKesehatan.includes(p) && <div className="w-4 h-4 rounded bg-[#12B76A] text-white flex items-center justify-center text-[10px]">✓</div>}
                    {!formData.riwayatKesehatan.includes(p) && <div className="w-4 h-4 rounded border border-gray-300"></div>}
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Riwayat Penyakit Lain (Opsional)</label>
              <input type="text" placeholder="Contoh: pernah operasi usus buntu tahun 2022, dll." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-[#F6FEF9] border border-[#D1FADF] rounded-xl p-5 h-fit">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-[#12B76A] shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Tips Pengisian</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Semakin lengkap data yang kamu berikan, semakin akurat rekomendasi yang kami berikan untukmu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. ALERGI & PANTANGAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
            <Leaf className="w-5 h-5 text-[#12B76A]" />
            3. Alergi & Pantangan
          </h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Alergi</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.alergi.map(a => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FEF9] text-[#12B76A] text-sm border border-[#D1FADF]">
                    {a}
                    <button className="hover:text-[#027A48]">×</button>
                  </span>
                ))}
              </div>
              <input type="text" placeholder="Tambah alergi (opsional)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pantangan Makanan / Bahan</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.pantangan.map(p => (
                  <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FEF9] text-[#12B76A] text-sm border border-[#D1FADF]">
                    {p}
                    <button className="hover:text-[#027A48]">×</button>
                  </span>
                ))}
              </div>
              <input type="text" placeholder="Tambah pantangan (opsional)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* 4. PREFERENSI & TUJUAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
            <Target className="w-5 h-5 text-[#12B76A]" />
            4. Preferensi & Tujuan
          </h2>
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tujuan Utama</label>
              <select defaultValue={formData.tujuan} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm bg-white">
                <option>Menjaga Berat Badan</option>
                <option>Menurunkan Berat Badan</option>
                <option>Menaikkan Berat Badan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preferensi Makanan</label>
              <div className="flex flex-wrap gap-2">
                {preferensiOptions.map(p => {
                  const isSelected = formData.preferensi.includes(p);
                  return (
                    <span key={p} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer ${isSelected ? 'bg-[#F6FEF9] text-[#12B76A] border-[#D1FADF]' : 'border-gray-200 text-gray-600'}`}>
                      {isSelected && <span className="text-xs">✓</span>}
                      {p}
                      {isSelected && <button className="ml-1 hover:text-[#027A48]">×</button>}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan (Opsional)</label>
              <textarea placeholder="Tuliskan catatan lain terkait kondisi atau preferensi makananmu..." rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-[#12B76A] focus:border-[#12B76A] outline-none text-sm resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        
        {/* RINGKASAN */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
            <AlertCircle className="w-4 h-4 text-[#12B76A]" />
            Ringkasan Profil Kesehatanmu
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Usia</p>
                <p className="text-sm font-semibold">22 Tahun</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Jenis Kelamin</p>
                <p className="text-sm font-semibold">Perempuan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tinggi / Berat</p>
                <p className="text-sm font-semibold">160 cm / 55 kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Aktivitas</p>
                <p className="text-sm font-semibold">Sedang</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Kondisi</p>
                <p className="text-sm font-semibold">Alergi Makanan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tujuan</p>
                <p className="text-sm font-semibold">Menjaga Berat Badan</p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <button className="w-full bg-[#12B76A] hover:bg-[#0FA968] text-white font-semibold py-4 rounded-xl transition-colors shadow-sm">
            Simpan Perubahan
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl border border-gray-200 transition-colors">
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}

export default PersonalizationPage;
