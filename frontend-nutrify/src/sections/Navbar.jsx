import { Button } from "@/components/ui/button"

function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500"></div>

          <h1 className="text-2xl font-bold text-black">
            Nutrify
          </h1>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-green-600">
            Home
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Features
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Dashboard
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Contact
          </a>
        </div>

        {/* Button */}
        <Button className="bg-green-500 hover:bg-green-600">
          Get Started
        </Button>

      </div>
    </nav>
  )
}

export default Navbar