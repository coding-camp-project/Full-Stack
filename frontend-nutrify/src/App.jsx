import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import LandingPage from "./features/LandingPage/LandingPage"
import LoginPage from "./features/Auth/LoginPage"
import RegisterPage from "./features/Auth/RegisterPage"
import ForgotPasswordPage from "./features/Auth/ForgotPasswordPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"
import ChatbotPage from "./features/Chatbot/pages/ChatbotPage";
import ScanPage from "./features/Scan/pages/ScanPage";
import HistoryPage from "./features/History/pages/HistoryPage";
import HistoryDetailPage from "./features/History/pages/HistoryDetailPage";
import PersonalizationPage from "./features/Personalisasi/pages/PersonalizationPage";
import ArticlePage from "./features/LandingPage/pages/ArticlePage";

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        
        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
          <Route path="/personalisasi" element={<PersonalizationPage />} />
          <Route path="/personalization" element={<Navigate to="/personalisasi" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App;
