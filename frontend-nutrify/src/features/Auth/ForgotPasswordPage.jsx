import { useState } from "react"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import AuthLayout from "./sections/AuthLayout"

function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
      await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      // Always show success to prevent email enumeration
      setSuccess(true)
    } catch (err) {
      console.error("Forgot password error:", err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7F0]">
            <CheckCircle className="h-8 w-8 text-[#12B76A]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Terkirim!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Kami telah mengirimkan link reset kata sandi ke:
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-8 break-all">{email}</p>
          <p className="text-xs text-gray-400 mb-8">
            Tidak menerima email? Periksa folder spam atau coba lagi.
          </p>
          <Button
            type="button"
            onClick={() => { setSuccess(false); setEmail("") }}
            variant="outline"
            className="w-full border border-gray-200 text-gray-700 py-6 rounded-xl font-medium hover:bg-gray-50 transition-all mb-4"
          >
            Coba email lain
          </Button>
          <Link
            to="/login"
            className="text-sm font-semibold text-[#12B76A] hover:text-[#0FA968] transition-colors duration-200 cursor-pointer"
          >
            ← Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Lupa Kata Sandi?</h2>
      <p className="text-gray-500 text-sm mb-8">
        Masukkan email akun Anda dan kami akan mengirimkan link untuk mereset kata sandi.
      </p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all group mt-4 shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Ingat kata sandi?{" "}
        <Link to="/login" className="font-bold text-[#469C7B] hover:text-[#388668] transition-colors duration-200">
          Masuk sekarang!
        </Link>
      </p>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout isRegister={false}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
