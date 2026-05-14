import { Routes, Route } from "react-router-dom"

import LandingPage from "./features/LandingPage/LandingPage"
import LoginPage from "./features/Auth/LoginPage"
import RegisterPage from "./features/Auth/RegisterPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
  )
}

export default App
