import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"
import axios from "axios"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      })

      console.log("Registrasi manual berhasil!")
      setIsSuccess(true)
    } catch (err) {
      console.error("Gagal registrasi:", err)
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Berhasil daftar/masuk dengan Google!", result.user);
      
      // Simpan info Google User
      localStorage.setItem("userData", JSON.stringify({ name: result.user.displayName, email: result.user.email }))
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal daftar dengan Google:", error);
      alert("Gagal daftar dengan Google. Pastikan konfigurasi Firebase sudah benar.");
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-[#EBF7F0] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#D1F2DE]">
          <svg className="w-10 h-10 text-[#12B76A] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Registrasi Berhasil!</h2>
        <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
          Akun Anda telah berhasil dibuat. Silakan masuk untuk menikmati semua fitur terbaik dari Nutrify.
        </p>
        <Button 
          onClick={() => navigate("/login")}
          className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 group animate-bounce"
        >
          Masuk ke Akun Anda
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
      <p className="text-gray-500 text-sm mb-8">Daftar sekarang dan nikmati fitur lengkap Nutrify.</p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#12B76A] focus:border-[#12B76A] outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Alamat Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              placeholder="john@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#12B76A] focus:border-[#12B76A] outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-[#12B76A] focus:border-[#12B76A] outline-none transition-all bg-gray-50 focus:bg-white"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input 
              id="agree-terms" 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="h-4 w-4 text-[#12B76A] focus:ring-[#12B76A] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Saya setuju dengan Syarat & Ketentuan <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all group mt-4 shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? "Mendaftar..." : "Daftar"}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="mt-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Atau, daftar dengan</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="mt-6">
        <Button 
          type="button" 
          onClick={handleGoogleRegister} 
          variant="outline" 
          className="w-full border border-gray-200 text-gray-700 py-6 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Daftar dengan Google
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah punya akun? <Link to="/login" className="font-bold text-[#469C7B] hover:text-[#388668]">Masuk!</Link>
      </p>
    </div>
  )
}
