import { Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"
import ChatbotPage from "./features/Chatbot/pages/ChatbotPage";
import ScanPage from "./features/Scan/pages/ScanPage";
import HistoryPage from "./features/History/pages/HistoryPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
        
      </Routes>
  )
}

export default App
