import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    navigate("/dashboard")
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Berhasil daftar/masuk dengan Google!", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal daftar dengan Google:", error);
      alert("Gagal daftar dengan Google. Pastikan konfigurasi Firebase sudah benar.");
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
      <p className="text-gray-500 text-sm mb-8">Daftar sekarang dan nikmati fitur lengkap Nutrify.</p>

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
              placeholder="Minimal 8 karakter"
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
              className="h-4 w-4 text-[#12B76A] focus:ring-[#12B76A] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Saya setuju dengan Syarat & Ketentuan
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all group mt-4 shadow-md">
          Daftar
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
