import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-green-700 text-white p-5">
        <h1 className="text-2xl font-bold mb-10">Nutrify</h1>

        <nav className="flex flex-col gap-4">
          <button className="text-left">Dashboard</button>
          <button className="text-left">Chatbot</button>
          <button className="text-left">Scan</button>
          <button className="text-left">History</button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-gray-100">
        {/* NAVBAR */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="font-semibold text-lg">Overview</h2>

          <div>
            <p className="text-sm">Hi, John Doe</p>
          </div>
        </div>

        {/* PAGE */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;