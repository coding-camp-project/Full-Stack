import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"
import axios from "axios"
import { setUserSession } from "@/utils/userSession"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    const userDataStr = localStorage.getItem("userData") || sessionStorage.getItem("userData");
    if (token || userDataStr) {
      try {
        const userData = JSON.parse(userDataStr || "{}");
        const destination = userData.isPersonalized ? "/dashboard" : "/personalisasi";
        navigate(destination, { replace: true });
      } catch (e) {
        console.error("Failed to parse user session during auto-redirect:", e);
      }
    }
  }, [navigate]);

  // Handle redirect result from Google sign-in (especially for mobile devices)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          console.log("Berhasil masuk dengan Google (Redirect)!", result.user);
          
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const response = await axios.post(`${API_URL}/api/users/google-login`, {
            name: result.user.displayName,
            email: result.user.email,
            profilePicture: result.user.photoURL,
          });

          const { token, name, email: userEmail, _id, profilePicture, isPersonalized } = response.data.data;
          setUserSession(token, { id: _id, name, email: userEmail, profilePicture, isPersonalized }, rememberMe);
          
          setSuccess("Berhasil masuk dengan Google! Mengalihkan...");
          const destination = isPersonalized ? "/dashboard" : "/personalisasi";
          setTimeout(() => navigate(destination), 300);
        }
      } catch (err) {
        console.error("Gagal masuk dengan Google (Redirect):", err);
        const errorMessage = err.response?.data?.message || err.message || "Gagal masuk dengan Google. Pastikan domain IP HP Anda sudah didaftarkan di Authorized Domains Firebase Console.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, [navigate, rememberMe]);

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      })

      // Simpan token JWT dan data user menggunakan setUserSession
      const { token, name, email: userEmail, _id, profilePicture, isPersonalized } = response.data.data
      setUserSession(token, { id: _id, name, email: userEmail, profilePicture, isPersonalized }, rememberMe)

      console.log("Login manual berhasil!")
      setSuccess("Login berhasil! Mengalihkan...")
      const destination = isPersonalized ? "/dashboard" : "/personalisasi"
      setTimeout(() => navigate(destination), 300)
    } catch (err) {
      console.error("Gagal login:", err)
      const errorMessage = err.response?.data?.message || "Email atau kata sandi salah."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      // signInWithPopup works on all devices (desktop & mobile modern browsers)
      // If popup is blocked, fallback to redirect
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr) {
        // popup blocked or closed by browser — fallback to redirect
        if (popupErr.code === "auth/popup-blocked" || popupErr.code === "auth/popup-closed-by-user") {
          console.log("Popup diblok browser, beralih ke redirect...");
          await signInWithRedirect(auth, googleProvider);
          return; // redirect will reload page, result handled in useEffect below
        }
        throw popupErr;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_URL}/api/users/google-login`, {
        name: result.user.displayName,
        email: result.user.email,
        profilePicture: result.user.photoURL,
      });

      const { token, name, email: userEmail, _id, profilePicture, isPersonalized } = response.data.data;
      setUserSession(token, { id: _id, name, email: userEmail, profilePicture, isPersonalized }, rememberMe);

      setSuccess("Berhasil masuk dengan Google! Mengalihkan...")
      const destination = isPersonalized ? "/dashboard" : "/personalisasi";
      setTimeout(() => navigate(destination), 300)
    } catch (err) {
      console.error("Gagal masuk dengan Google:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal login Google. Coba gunakan login Email & Password.";
      setError(errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Halo, Selamat Datang Kembali!</h2>
      <p className="text-gray-500 text-sm mb-8">Silakan masuk ke akun Anda untuk melanjutkan.</p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-3.5 bg-[#EBF7F0] border border-[#A6E6C5] text-[#12B76A] rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Alamat Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              placeholder="Masukkan email Anda di sini"
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
              placeholder="Ketik password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              id="remember-me" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#12B76A] focus:ring-[#12B76A] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Biarkan saya tetap masuk
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#12B76A] hover:text-[#0FA968] cursor-pointer transition-colors duration-200"
            style={{ pointerEvents: "auto", position: "relative", zIndex: 10 }}
          >
            Lupa kata sandi?
          </Link>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all group mt-4 shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? "Masuk..." : "Masuk"}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="mt-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Atau, masuk dengan</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="mt-6">
        <Button 
          type="button" 
          onClick={handleGoogleLogin} 
          variant="outline" 
          className="w-full border border-gray-200 text-gray-700 py-6 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Masuk dengan Google
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Belum punya akun? <Link to="/register" className="font-bold text-[#469C7B] hover:text-[#388668]">Daftar sekarang!</Link>
      </p>
    </div>
  )
}
