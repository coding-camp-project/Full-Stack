import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Calendar,
  ChevronDown,
  Info,
  Shield,
  Plus,
  X,
  Target,
  Scale,
  Activity,
  Heart,
  FileText,
  RefreshCw,
  Save,
  AlertCircle
} from "lucide-react";

export default function PersonalizationPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "Perempuan",
    height: "",
    weight: "",
    activityLevel: "Sedang",
    healthConditions: [],
    otherConditions: "",
    allergies: ["Udang"], // default from mockup
    foodRestrictions: ["Santan", "Gorengan"], // default from mockup
    primaryGoal: "Menjaga Berat Badan", // default from mockup
    foodPreferences: ["Sayuran", "Buah", "Ikan", "Kacang-kacangan"], // default from mockup
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Custom Dropdown Tag Search States
  const [allergySearch, setAllergySearch] = useState("");
  const [showAllergies, setShowAllergies] = useState(false);
  const commonAllergies = ["Udang", "Kepiting", "Kerang", "Kacang Tanah", "Susu Sapi", "Telur", "Gandum", "Kedelai", "Ikan"];

  const [restrictionSearch, setRestrictionSearch] = useState("");
  const [showRestrictions, setShowRestrictions] = useState(false);
  const commonRestrictions = ["Santan", "Gorengan", "Daging Merah", "Gula Berlebih", "Garam Berlebih", "Kafein", "Gluten"];

  // Load existing data from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("userData");
      const token = localStorage.getItem("userToken");
      
      if (!storedUser || !token) {
        setFetching(false);
        return;
      }

      try {
        const { id } = JSON.parse(storedUser);
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.data;
        if (userData) {
          setFormData({
            name: userData.name || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "Perempuan",
            height: userData.height || "",
            weight: userData.weight || "",
            activityLevel: userData.activityLevel || "Sedang",
            healthConditions: userData.healthConditions || [],
            otherConditions: userData.otherConditions || "",
            allergies: userData.allergies?.length ? userData.allergies : ["Udang"],
            foodRestrictions: userData.foodRestrictions?.length ? userData.foodRestrictions : ["Santan", "Gorengan"],
            primaryGoal: userData.primaryGoal || "Menjaga Berat Badan",
            foodPreferences: userData.foodPreferences?.length ? userData.foodPreferences : ["Sayuran", "Buah", "Ikan", "Kacang-kacangan"],
            additionalNotes: userData.additionalNotes || "",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, []);

  // Age Calculator based on birthDate
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "-";
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} Tahun`;
  };

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Health Conditions checkboxes
  const handleConditionChange = (condition) => {
    setFormData((prev) => {
      let updatedConditions = [...prev.healthConditions];
      
      if (condition === "Tidak Ada") {
        return { ...prev, healthConditions: ["Tidak Ada"] };
      }

      // If checking anything else, remove "Tidak Ada"
      updatedConditions = updatedConditions.filter((c) => c !== "Tidak Ada");

      if (updatedConditions.includes(condition)) {
        updatedConditions = updatedConditions.filter((c) => c !== condition);
      } else {
        updatedConditions.push(condition);
      }

      return { ...prev, healthConditions: updatedConditions };
    });
  };

  // Remove Allergy Tag
  const handleRemoveAllergy = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Remove Restriction Tag
  const handleRemoveRestriction = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      foodRestrictions: prev.foodRestrictions.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle Food Preferences checkboxes
  const handlePreferenceChange = (pref) => {
    setFormData((prev) => {
      const updated = prev.foodPreferences.includes(pref)
        ? prev.foodPreferences.filter((p) => p !== pref)
        : [...prev.foodPreferences, pref];
      return { ...prev, foodPreferences: updated };
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const storedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("userToken");

    if (!storedUser || !token) {
      setMessage({ type: "error", text: "Sesi login kedaluwarsa. Silakan masuk kembali." });
      setLoading(false);
      return;
    }

    try {
      const { id } = JSON.parse(storedUser);
      await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update name in local storage if changed
      const currentLocalData = JSON.parse(storedUser);
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...currentLocalData, name: formData.name })
      );

      setMessage({ type: "success", text: "Personalisasi data kesehatan berhasil disimpan!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Gagal menyimpan perubahan. Silakan coba lagi.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  // Reset Form to initial empty states
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua isian?")) {
      setFormData({
        name: "",
        birthDate: "",
        gender: "Perempuan",
        height: "",
        weight: "",
        activityLevel: "Sedang",
        healthConditions: [],
        otherConditions: "",
        allergies: [],
        foodRestrictions: [],
        primaryGoal: "Menjaga Berat Badan",
        foodPreferences: [],
        additionalNotes: "",
      });
      setMessage({ type: "success", text: "Isian formulir berhasil disetel ulang!" });
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-[#1E7F4E]" />
          <p className="text-gray-500 font-medium">Memuat profil kesehatan Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-7 lg:px-7 space-y-6">
      
      {/* HEADER SECTION (Direct layout matching mockup, no card wrapper) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-2 relative">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E1E1E] tracking-tight mb-2">Personalisasi</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              Lengkapi informasi dirimu agar kami dapat memberikan rekomendasi gizi yang lebih akurat dan sesuai kebutuhanmu.
            </p>
          </div>

          {/* Secure Alert Banner */}
          <div 
            className="inline-flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-sm font-medium shadow-2xs"
            style={{ backgroundColor: "#EBF7F0", borderColor: "#D1F2DE", color: "#1E7F4E" }}
          >
            <span className="text-base">🔒</span>
            Data kamu aman dan hanya digunakan untuk memberikan rekomendasi gizi personal.
          </div>
        </div>

        {/* Vector Illustration matching mockup */}
        <div className="hidden lg:block shrink-0 pr-4 select-none">
          <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Soft circles */}
            <circle cx="120" cy="90" r="70" fill="#EBF7F0" opacity="0.7" />
            <circle cx="180" cy="120" r="30" fill="#EBF7F0" opacity="0.9" />
            
            {/* Decorative Leaves */}
            <path d="M210 120C225 105 235 125 220 140C205 155 195 135 210 120Z" fill="#A5D6A7" opacity="0.4" />
            <path d="M30 140C15 125 5 145 20 160C35 175 45 155 30 140Z" fill="#A5D6A7" opacity="0.4" />
            
            {/* Clipboard */}
            <rect x="70" y="20" width="80" height="110" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.05))" />
            
            {/* Clip */}
            <rect x="95" y="14" width="30" height="12" rx="3" fill="#A5D6A7" />
            <rect x="103" y="8" width="14" height="8" rx="2" fill="#718096" />
            
            {/* User Icon */}
            <circle cx="110" cy="45" r="8" fill="#EBF7F0" stroke="#1E7F4E" strokeWidth="1.5" />
            <path d="M100 62C100 57 104 55 110 55C116 55 120 57 120 62" fill="none" stroke="#1E7F4E" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Checklists */}
            <path d="M85 80L90 85L98 75" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="80" x2="135" y2="80" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            
            <path d="M85 98L90 103L98 93" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="98" x2="130" y2="98" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            
            <path d="M85 116L90 121L98 111" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="116" x2="125" y2="116" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

            {/* Salad bowl */}
            <ellipse cx="170" cy="140" rx="35" ry="10" fill="#E2E8F0" opacity="0.6" />
            <path d="M135 120C135 142 150 145 170 145C190 145 205 142 205 120H135Z" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
            
            <circle cx="150" cy="115" r="12" fill="#A5D6A7" />
            <circle cx="165" cy="112" r="14" fill="#81C784" />
            <circle cx="180" cy="114" r="13" fill="#A5D6A7" />
            <circle cx="192" cy="116" r="10" fill="#C8E6C9" />
            
            <circle cx="158" cy="118" r="7" fill="#F87171" />
            <circle cx="158" cy="118" r="4" fill="#EF4444" />
            <circle cx="178" cy="116" r="8" fill="#F87171" />
            <circle cx="178" cy="116" r="5" fill="#EF4444" />
            <circle cx="168" cy="122" r="6" fill="#E8F5E9" stroke="#1E7F4E" strokeWidth="1.5" />
            <circle cx="186" cy="120" r="5" fill="#E8F5E9" stroke="#1E7F4E" strokeWidth="1.5" />

            {/* Green Apple */}
            <path d="M210 135C207 135 204 137 202 139C200 137 197 135 194 135C188 135 184 140 184 146C184 153 192 159 198 161C200 161 204 161 206 161C212 159 220 153 220 146C220 140 216 135 210 135Z" fill="#81C784" />
            <path d="M202 135C202 131 204 129 205 128" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M205 128C208 128 211 130 211 131C211 132 208 132 205 128Z" fill="#4CAF50" />
          </svg>
        </div>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-[#EBF7F0] border-[#D1F2DE] text-[#1E7F4E]" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? <Shield className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: DATA DIRI */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
            <span 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
            >
              <User size={16} />
            </span>
            1. Data Diri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nama Lengkap (Robust padding-left inline style) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aisyah Putri"
                required
                className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all text-[#1E1E1E]"
                style={{ paddingLeft: "16px", paddingRight: "16px" }}
              />
            </div>

            {/* Tanggal Lahir (Robust padding-left inline style) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Tanggal Lahir</label>
              <div style={{ position: "relative" }}>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all bg-white text-[#1E1E1E]"
                  style={{ paddingLeft: "16px", paddingRight: "16px" }}
                />
              </div>
            </div>

            {/* Jenis Kelamin (Highly robust native styling bypass to hide double arrows with robust padding-left) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Jenis Kelamin</label>
              <div style={{ position: "relative" }}>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all bg-white text-[#1E1E1E]"
                  style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingLeft: "16px", paddingRight: "40px" }}
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
                <ChevronDown 
                  className="text-gray-400" 
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} 
                  size={18} 
                />
              </div>
            </div>

            {/* Tinggi Badan (Robust padding-left & padding-right inline style) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Tinggi Badan</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="160"
                  required
                  min="50"
                  max="300"
                  className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all text-[#1E1E1E]"
                  style={{ paddingLeft: "16px", paddingRight: "48px" }}
                />
                <span 
                  className="text-sm text-gray-400 font-medium"
                  style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  cm
                </span>
              </div>
            </div>

            {/* Berat Badan (Robust padding-left & padding-right inline style) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Berat Badan</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="55"
                  required
                  min="20"
                  max="500"
                  className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all text-[#1E1E1E]"
                  style={{ paddingLeft: "16px", paddingRight: "48px" }}
                />
                <span 
                  className="text-sm text-gray-400 font-medium"
                  style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  kg
                </span>
              </div>
            </div>

            {/* Tingkat Aktivitas (Highly robust native styling bypass to hide double arrows with robust padding-left) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-755 block">Tingkat Aktivitas</label>
              <div style={{ position: "relative" }}>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  required
                  className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all bg-white text-[#1E1E1E]"
                  style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingLeft: "16px", paddingRight: "40px" }}
                >
                  <option value="Sangat Jarang">Sangat Jarang</option>
                  <option value="Ringan">Ringan (1-3 hari/minggu)</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sangat Aktif">Sangat Aktif (6-7 hari/minggu)</option>
                </select>
                <ChevronDown 
                  className="text-gray-400" 
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} 
                  size={18} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: RIWAYAT KESEHATAN (Highly robust Flexbox split to avoid any grid tracking issues) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
            <span 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
            >
              <Heart size={16} />
            </span>
            2. Riwayat Kesehatan
          </h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form Inputs (75% width on desktop) */}
            <div className="w-full lg:w-[75%] space-y-5">
              {/* Checkbox Button Pills with Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block mb-1">Penyakit / Kondisi</label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Diabetes",
                    "Hipertensi",
                    "Kolesterol Tinggi",
                    "Asam Urat",
                    "Alergi Makanan",
                    "Maag / GERD",
                    "Tidak Ada",
                  ].map((condition) => {
                    const isChecked = formData.healthConditions.includes(condition);
                    return (
                      <button
                        type="button"
                        key={condition}
                        onClick={() => handleConditionChange(condition)}
                        className="rounded-xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                        style={
                          isChecked
                            ? { 
                                backgroundColor: "#EBF7F0", 
                                borderColor: "#1E7F4E", 
                                color: "#1E7F4E", 
                                fontWeight: "600",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                                paddingTop: "10px",
                                paddingBottom: "10px"
                              }
                            : { 
                                backgroundColor: "#FFFFFF", 
                                borderColor: "#E2E8F0", 
                                color: "#4A5568",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                                paddingTop: "10px",
                                paddingBottom: "10px"
                              }
                        }
                      >
                        {/* Custom checkbox box */}
                        <span 
                          className="w-4 h-4 rounded border flex items-center justify-center text-[9px] transition-all"
                          style={
                            isChecked
                              ? { backgroundColor: "#1E7F4E", borderColor: "#1E7F4E", color: "#FFFFFF" }
                              : { borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" }
                          }
                        >
                          {isChecked && "✓"}
                        </span>
                        {condition}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Riwayat Penyakit Lain */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block">Riwayat Penyakit Lain (Opsional)</label>
                <textarea
                  name="otherConditions"
                  rows="3"
                  value={formData.otherConditions}
                  onChange={handleChange}
                  placeholder="Contoh: pernah operasi usus buntu tahun 2022, dll."
                  className="block w-full border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all resize-none text-[#1E1E1E]"
                  style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                />
              </div>
            </div>

            {/* Tips Card (25% width on desktop - Guaranteed visible green bg using inline styles) */}
            <div 
              className="w-full lg:w-[25%] p-5 rounded-2xl border flex flex-col justify-start gap-2 self-start"
              style={{ backgroundColor: "#F1F8F5", borderColor: "#D1F2DE" }}
            >
              <div className="flex items-center gap-2 text-[#1E7F4E] font-bold text-xs">
                <span className="text-sm">💡</span>
                <span>Tips Pengisian</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Semakin lengkap data yang kamu berikan, semakin akurat rekomendasi yang kami berikan untukmu.
              </p>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SECTION: ALERGI & PREFERENSI (Perfect 50% split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SECTION 3: ALERGI & PANTANGAN */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs flex flex-col justify-between min-h-[360px] relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
                  <span 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                  >
                    🍏
                  </span>
                  3. Alergi & Pantangan
                </h2>
                
                {/* Custom top-right illustration */}
                <div className="text-gray-400 select-none">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="16" fill="#E8F5E9" opacity="0.6" />
                    <path d="M14 22C14 26 16 28 22 28C28 28 30 26 30 22H14Z" fill="#A5D6A7" />
                    <circle cx="22" cy="22" r="10" fill="white" stroke="#EF5350" strokeWidth="2" />
                    <line x1="15" y1="15" x2="29" y2="29" stroke="#EF5350" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {/* Alergi Tags - Single integrated selector box (matches mockup exactly with robust padding-left) */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Alergi</label>
                  
                  <div 
                    className="flex flex-wrap gap-1.5 border border-gray-200 rounded-xl bg-white min-h-[48px] items-center relative cursor-pointer focus-within:ring-2 focus-within:ring-[#1E7F4E] focus-within:border-[#1E7F4E] transition-all"
                    onClick={() => setShowAllergies(true)}
                    style={{ paddingLeft: "12px", paddingRight: "40px", paddingTop: "8px", paddingBottom: "8px" }}
                  >
                    {formData.allergies.map((allergy, index) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 border text-xs font-semibold rounded-lg shrink-0"
                        style={{ 
                          backgroundColor: "#EBF7F0", 
                          borderColor: "#D1F2DE", 
                          color: "#1E7F4E", 
                          paddingLeft: "10px", 
                          paddingRight: "10px",
                          paddingTop: "4px",
                          paddingBottom: "4px"
                        }}
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAllergy(index);
                          }}
                          className="hover:text-red-500 transition-colors cursor-pointer text-gray-400 ml-1.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    
                    {/* Inline typing field */}
                    <input
                      type="text"
                      placeholder={formData.allergies.length === 0 ? "Pilih atau cari alergi..." : ""}
                      value={allergySearch}
                      onChange={(e) => {
                        setAllergySearch(e.target.value);
                        setShowAllergies(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (allergySearch.trim() && !formData.allergies.includes(allergySearch.trim())) {
                            setFormData(prev => ({
                              ...prev,
                              allergies: [...prev.allergies, allergySearch.trim()]
                            }));
                            setAllergySearch("");
                          }
                        }
                      }}
                      className="flex-1 min-w-[120px] bg-transparent outline-none border-none text-xs text-gray-700 placeholder-gray-400 py-1"
                      style={{ paddingLeft: "8px" }}
                    />
                    
                    <ChevronDown 
                      className="absolute right-3.5 text-gray-400 pointer-events-none transition-transform duration-200" 
                      style={{ transform: showAllergies ? "rotate(180deg)" : "rotate(0deg)", top: "50%", translateY: "-50%", right: "14px" }}
                      size={18} 
                    />
                  </div>

                  {/* Floating dropdown select menu */}
                  {showAllergies && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowAllergies(false)} />
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1.5">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Pilihan Populer
                        </div>
                        {commonAllergies
                          .filter(item => item.toLowerCase().includes(allergySearch.toLowerCase()))
                          .map(item => {
                            const isSelected = formData.allergies.includes(item);
                            return (
                              <button
                                type="button"
                                key={item}
                                disabled={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isSelected) {
                                    setFormData(prev => ({ ...prev, allergies: [...prev.allergies, item] }));
                                  }
                                  setAllergySearch("");
                                  setShowAllergies(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                                  isSelected 
                                    ? "text-gray-300 bg-gray-50 cursor-not-allowed" 
                                    : "text-gray-700 hover:bg-[#F1F8F5] hover:text-[#1E7F4E]"
                                }`}
                              >
                                <span>{item}</span>
                                {isSelected && <span className="text-[#1E7F4E] font-semibold">✓ Terpilih</span>}
                              </button>
                            );
                          })}
                        {allergySearch.trim() && !formData.allergies.includes(allergySearch.trim()) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, allergies: [...prev.allergies, allergySearch.trim()] }));
                              setAllergySearch("");
                              setShowAllergies(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-[#1E7F4E] hover:bg-[#F1F8F5] font-semibold border-t border-gray-150 transition-colors"
                          >
                            Tambah "{allergySearch}"
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Pantangan Makanan Tags - Single integrated selector box (matches mockup exactly with robust padding-left) */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Pantangan Makanan / Bahan</label>
                  
                  <div 
                    className="flex flex-wrap gap-1.5 border border-gray-200 rounded-xl bg-white min-h-[48px] items-center relative cursor-pointer focus-within:ring-2 focus-within:ring-[#1E7F4E] focus-within:border-[#1E7F4E] transition-all"
                    onClick={() => setShowRestrictions(true)}
                    style={{ paddingLeft: "12px", paddingRight: "40px", paddingTop: "8px", paddingBottom: "8px" }}
                  >
                    {formData.foodRestrictions.map((restriction, index) => (
                      <span
                        key={restriction}
                        className="inline-flex items-center gap-1 border text-xs font-semibold rounded-lg shrink-0"
                        style={{ 
                          backgroundColor: "#EBF7F0", 
                          borderColor: "#D1F2DE", 
                          color: "#1E7F4E", 
                          paddingLeft: "10px", 
                          paddingRight: "10px",
                          paddingTop: "4px",
                          paddingBottom: "4px"
                        }}
                      >
                        {restriction}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRestriction(index);
                          }}
                          className="hover:text-red-500 transition-colors cursor-pointer text-gray-400 ml-1.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    
                    {/* Inline typing field */}
                    <input
                      type="text"
                      placeholder={formData.foodRestrictions.length === 0 ? "Pilih atau cari pantangan..." : ""}
                      value={restrictionSearch}
                      onChange={(e) => {
                        setRestrictionSearch(e.target.value);
                        setShowRestrictions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (restrictionSearch.trim() && !formData.foodRestrictions.includes(restrictionSearch.trim())) {
                            setFormData(prev => ({
                              ...prev,
                              foodRestrictions: [...prev.foodRestrictions, restrictionSearch.trim()]
                            }));
                            setRestrictionSearch("");
                          }
                        }
                      }}
                      className="flex-1 min-w-[120px] bg-transparent outline-none border-none text-xs text-gray-700 placeholder-gray-400 py-1"
                      style={{ paddingLeft: "8px" }}
                    />
                    
                    <ChevronDown 
                      className="absolute right-3.5 text-gray-400 pointer-events-none transition-transform duration-200" 
                      style={{ transform: showRestrictions ? "rotate(180deg)" : "rotate(0deg)", top: "50%", translateY: "-50%", right: "14px" }}
                      size={18} 
                    />
                  </div>

                  {/* Floating dropdown select menu */}
                  {showRestrictions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRestrictions(false)} />
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1.5">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Pilihan Populer
                        </div>
                        {commonRestrictions
                          .filter(item => item.toLowerCase().includes(restrictionSearch.toLowerCase()))
                          .map(item => {
                            const isSelected = formData.foodRestrictions.includes(item);
                            return (
                              <button
                                type="button"
                                key={item}
                                disabled={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isSelected) {
                                    setFormData(prev => ({ ...prev, foodRestrictions: [...prev.foodRestrictions, item] }));
                                  }
                                  setRestrictionSearch("");
                                  setShowRestrictions(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                                  isSelected 
                                    ? "text-gray-300 bg-gray-50 cursor-not-allowed" 
                                    : "text-gray-700 hover:bg-[#F1F8F5] hover:text-[#1E7F4E]"
                                }`}
                              >
                                <span>{item}</span>
                                {isSelected && <span className="text-[#1E7F4E] font-semibold">✓ Terpilih</span>}
                              </button>
                            );
                          })}
                        {restrictionSearch.trim() && !formData.foodRestrictions.includes(restrictionSearch.trim()) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, foodRestrictions: [...prev.foodRestrictions, restrictionSearch.trim()] }));
                              setRestrictionSearch("");
                              setShowRestrictions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-[#1E7F4E] hover:bg-[#F1F8F5] font-semibold border-t border-gray-150 transition-colors"
                          >
                            Tambah "{restrictionSearch}"
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PREFERENSI & TUJUAN */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs flex flex-col justify-between min-h-[360px] relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
                  <span 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                  >
                    <Target size={16} />
                  </span>
                  4. Preferensi & Tujuan
                </h2>
                
                {/* Custom top-right illustration */}
                <div className="text-gray-400 select-none">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="16" fill="#E8F5E9" opacity="0.6" />
                    <circle cx="22" cy="22" r="10" fill="white" stroke="#81C784" strokeWidth="1.5" />
                    <circle cx="22" cy="22" r="5" fill="#EF5350" />
                    <path d="M30 14L24 20" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" />
                    <path d="M24 20L23 21" stroke="#EF5350" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tujuan Utama (Highly robust native styling bypass to hide double arrows with robust padding-left) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Tujuan Utama</label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleChange}
                      required
                      className="block w-full py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all bg-white text-[#1E1E1E]"
                      style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingLeft: "16px", paddingRight: "40px" }}
                    >
                      <option value="Menurunkan Berat Badan">Menurunkan Berat Badan</option>
                      <option value="Menjaga Berat Badan">Menjaga Berat Badan</option>
                      <option value="Menaikkan Berat Badan">Menaikkan Berat Badan</option>
                      <option value="Membangun Otot">Membangun Otot</option>
                    </select>
                    <ChevronDown 
                      className="text-gray-400" 
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} 
                      size={18} 
                    />
                  </div>
                </div>

                {/* Preferensi Makanan Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Preferensi Makanan</label>
                  <div className="flex flex-wrap gap-2">
                    {["Sayuran", "Buah", "Daging", "Ikan", "Telur", "Kacang-kacangan"].map((pref) => {
                      const isChecked = formData.foodPreferences.includes(pref);
                      return (
                        <button
                          type="button"
                          key={pref}
                          onClick={() => handlePreferenceChange(pref)}
                          className="rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          style={
                            isChecked
                              ? { 
                                  backgroundColor: "#EBF7F0", 
                                  borderColor: "#1E7F4E", 
                                  color: "#1E7F4E",
                                  paddingLeft: "12px",
                                  paddingRight: "12px",
                                  paddingTop: "6px",
                                  paddingBottom: "6px"
                                }
                              : { 
                                  backgroundColor: "#FFFFFF", 
                                  borderColor: "#E2E8F0", 
                                  color: "#4A5568",
                                  paddingLeft: "12px",
                                  paddingRight: "12px",
                                  paddingTop: "6px",
                                  paddingBottom: "6px"
                                }
                          }
                        >
                          {pref}
                          {isChecked && <span className="text-gray-400 font-normal ml-1 text-[10px]">✕</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">Catatan Tambahan (Opsional)</label>
                  <textarea
                    name="additionalNotes"
                    rows="2"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Tuliskan catatan lain terkait kondisi atau preferensi makananmu..."
                    className="block w-full border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all resize-none text-[#1E1E1E]"
                    style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION & SUMMARY SECTION (Highly robust Flexbox split to bypass any grid track parsing bugs) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
          
          {/* SUMMARY BOX (75% width on desktop) */}
          <div className="w-full lg:w-[75%] bg-white p-6 md:p-8 rounded-[28px] border border-[#E7E7E7] shadow-xs flex flex-col justify-center select-none">
            
            {/* Header Area */}
            <div className="flex items-start gap-4 mb-6">
              {/* Icon Badge */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
              >
                <FileText size={26} />
              </div>
              {/* Header Text */}
              <div>
                <h3 className="text-[18px] font-bold text-[#1E1E1E]">Ringkasan Profil Kesehatanmu</h3>
                <p className="text-[13px] text-gray-500 mt-1">Berikut ringkasan informasi kesehatan berdasarkan data yang kamu berikan.</p>
              </div>
            </div>
            
            {/* 6 Grid columns side-by-side on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* Usia */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <Calendar size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Usia</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full">
                  {calculateAge(formData.birthDate) || "-"}
                </p>
              </div>

              {/* Jenis Kelamin */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <User size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Jenis Kelamin</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full">
                  {formData.gender || "-"}
                </p>
              </div>

              {/* Tinggi / Berat */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <Scale size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Tinggi / Berat</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full">
                  {formData.height && formData.weight ? `${formData.height} cm / ${formData.weight} kg` : "-"}
                </p>
              </div>

              {/* Aktivitas */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <Activity size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Aktivitas</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full">
                  {formData.activityLevel || "-"}
                </p>
              </div>

              {/* Kondisi */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <Heart size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Kondisi</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full" title={formData.healthConditions.filter(c => c !== "Tidak Ada").join(", ") || "Tidak Ada"}>
                  {formData.healthConditions.filter(c => c !== "Tidak Ada").join(", ") || "Tidak Ada"}
                </p>
              </div>

              {/* Tujuan */}
              <div className="flex flex-col items-center bg-white border border-[#E7E7E7] rounded-2xl px-2.5 py-5 md:px-4 text-center min-h-[175px] justify-between">
                <div 
                  className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
                >
                  <Target size={20} />
                </div>
                <p className="text-[12px] font-semibold text-gray-400 mt-2.5">Tujuan</p>
                <div className="w-full border-t border-dashed border-gray-200 my-2.5" />
                <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 break-normal w-full" title={formData.primaryGoal}>
                  {formData.primaryGoal || "-"}
                </p>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS (25% width on desktop - Guaranteed visible green bg using inline styles) */}
          <div className="w-full lg:w-[25%] bg-white p-5 rounded-3xl border border-[#E7E7E7] shadow-xs flex flex-col justify-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none outline-none"
              style={{ 
                backgroundColor: "#1E7F4E", 
                paddingTop: "16px", 
                paddingBottom: "16px", 
                paddingLeft: "24px", 
                paddingRight: "24px",
                fontSize: "15px",
                fontWeight: "700"
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ 
                paddingTop: "16px", 
                paddingBottom: "16px", 
                paddingLeft: "24px", 
                paddingRight: "24px",
                fontSize: "15px",
                fontWeight: "700"
              }}
            >
              Reset
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
