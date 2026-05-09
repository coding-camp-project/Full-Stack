import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import DashboardLayout from "./layout/DashboardLayout";
import DashboardPage from "./features/Dashboard/pages/DashboardPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* dashboard layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

