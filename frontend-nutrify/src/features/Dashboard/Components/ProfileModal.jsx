import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import defaultAvatar from "../../../assets/logo/Logo 2.png";

export default function ProfileModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const fileInputRef = useRef(null);

  // Load user data from localStorage and backend
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("userData");
      const token = localStorage.getItem("userToken");
      
      if (!storedUser || !token) {
        setMessage({ type: "error", text: "Sesi login kedaluwarsa. Silakan masuk kembali." });
        return;
      }

      try {
        const { id } = JSON.parse(storedUser);
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.data;
        if (userData) {
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPhoto(userData.profileImage || "");
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        // Fallback to local storage if API fails
        const { name: localName, email: localEmail, profileImage: localPhoto } = JSON.parse(storedUser);
        setName(localName || "");
        setEmail(localEmail || "");
        setPhoto(localPhoto || "");
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Ukuran file terlalu besar. Maksimal 2MB." });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Base64 string
        setMessage({ type: "", text: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
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
      const updateData = { name, profileImage: photo };
      
      await axios.put(`http://localhost:5000/api/users/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update name & photo in local storage
      const currentLocalData = JSON.parse(storedUser);
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...currentLocalData, name, profileImage: photo })
      );

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      
      // Delay reload to let the user see the success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Gagal memperbarui profil. Silakan coba lagi.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-150 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">Pengaturan Profil</h2>
          <p className="text-xs text-gray-500 mt-1">Sesuaikan informasi profil Anda di platform Nutrify</p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-5 p-3.5 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === "success" 
              ? "bg-[#EBF7F0] border-[#D1F2DE] text-[#1E7F4E]" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {/* Avatar circle */}
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#4BAA7A] shadow-md transition-all duration-300 group-hover:opacity-90">
                <img
                  src={photo || defaultAvatar}
                  alt="Profile Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Camera overlay indicator */}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white" size={24} />
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
            </div>
            
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-3 text-xs font-semibold text-[#1E7F4E] hover:text-[#17653E] transition-colors"
            >
              Ubah Foto Profil
            </button>
            <p className="text-[10px] text-gray-400 mt-1">Maksimal ukuran gambar 2MB (JPG, PNG)</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                required
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none transition-all text-[#1E1E1E]"
              />
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5 opacity-70">
              <label className="text-xs font-bold text-gray-600 block">Alamat Email (Tidak dapat diubah)</label>
              <input
                type="email"
                value={email}
                disabled
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-[#1E1E1E] cursor-not-allowed"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition-colors text-sm text-center"
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#12B76A] hover:bg-[#0FA968] text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
