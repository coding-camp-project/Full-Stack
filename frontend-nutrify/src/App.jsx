import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import LandingPage from "./features/LandingPage/LandingPage"
import LoginPage from "./features/Auth/LoginPage"
import RegisterPage from "./features/Auth/RegisterPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"
import ChatbotPage from "./features/Chatbot/pages/ChatbotPage";
import ScanPage from "./features/Scan/pages/ScanPage";
import HistoryPage from "./features/History/pages/HistoryPage";
import PersonalizationPage from "./features/Personalisasi/pages/PersonalizationPage";

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/personalisasi" element={<PersonalizationPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App;
