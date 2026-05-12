import { Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
  )
}

export default App
