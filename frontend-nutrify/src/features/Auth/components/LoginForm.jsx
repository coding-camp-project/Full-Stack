import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Hi, Welcome Back!</h2>
      <p className="text-gray-500 text-sm mb-8">Start 14-day full-featured trial. No credit card required</p>

      <form className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
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
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="8+ character required"
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
              className="h-4 w-4 text-[#12B76A] focus:ring-[#12B76A] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Keep me signed in
            </label>
          </div>
          <a href="#" className="text-sm font-semibold text-[#12B76A] hover:text-[#0FA968]">
            Forgot password?
          </a>
        </div>

        <Button className="w-full bg-[#469C7B] hover:bg-[#388668] text-white py-6 rounded-xl text-base font-semibold transition-all group mt-4 shadow-md">
          Sign in
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="mt-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Or, log in with your email</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full border border-gray-200 text-gray-700 py-6 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-2 shadow-sm transition-all">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Sign in with Google
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account yet? <Link to="/register" className="font-bold text-[#469C7B] hover:text-[#388668]">Try for free!</Link>
      </p>
    </div>
  )
}
