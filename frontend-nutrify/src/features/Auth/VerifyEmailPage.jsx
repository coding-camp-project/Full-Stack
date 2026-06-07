import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthLayout from "./sections/AuthLayout"
import axios from "axios"

function VerifyEmailForm() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  const token = searchParams.get("token")

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setErrorMessage("Token verifikasi tidak ditemukan di URL. Pastikan Anda menyalin tautan dengan benar.")
        setLoading(false)
        return
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
        const response = await axios.get(`${API_URL}/api/users/verify-email?token=${token}`)
        
        if (response.data.success) {
          setSuccess(true)
        } else {
          setErrorMessage(response.data.message || "Gagal memverifikasi email.")
        }
      } catch (err) {
        console.error("Verification error:", err)
        setErrorMessage(err.response?.data?.message || "Token verifikasi tidak valid atau sudah kedaluwarsa.")
      } finally {
        setLoading(false)
      }
    }

    performVerification()
  }, [token])

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center text-center py-8">
        <Loader2 className="h-12 w-12 text-[#469C7B] animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Memverifikasi Email Anda</h2>
        <p className="text-gray-500 text-sm">
          Harap tunggu sementara kami memverifikasi akun Anda...
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7F0]">
            <CheckCircle className="h-8 w-8 text-[#12B76A]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifikasi Berhasil!</h2>
          <p className="text-gray-500 text-sm mb-8">
            Akun Anda telah berhasil diaktifkan. Anda sekarang dapat masuk menggunakan email dan kata sandi Anda.
          </p>
          <Link to="/login" className="w-full">
            <Button
              type="button"
              className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all shadow-md"
            >
              Masuk ke Akun
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center py-4">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
        <p className="text-red-500 text-sm mb-8 font-medium">
          {errorMessage}
        </p>
        <p className="text-xs text-gray-400 mb-8">
          Jika Anda terus mengalami masalah ini, silakan hubungi dukungan pelanggan kami atau coba daftarkan akun kembali.
        </p>
        <div className="w-full flex flex-col gap-3">
          <Link to="/login" className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full border border-gray-200 text-gray-700 py-6 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Kembali ke Login
            </Button>
          </Link>
          <Link to="/register" className="w-full">
            <Button
              type="button"
              className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all shadow-md"
            >
              Daftar Ulang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout isRegister={false}>
      <VerifyEmailForm />
    </AuthLayout>
  )
}
