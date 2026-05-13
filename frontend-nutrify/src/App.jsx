import { Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./features/Dashboard/pages/DashboardPage"
import ChatbotPage from "./features/Chatbot/pages/ChatbotPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
        
      </Routes>
  )
}

export default App
