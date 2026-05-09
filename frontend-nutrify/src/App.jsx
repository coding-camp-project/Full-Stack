import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import DashboardPage from "./features/Dashboard/pages/DashboardPage";

function App() {
  return (
    
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    
  );
}

export default App;