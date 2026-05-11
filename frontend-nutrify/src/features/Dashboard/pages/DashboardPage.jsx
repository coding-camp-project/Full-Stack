import SummarySection from "../Component/SummarySection";

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard Page</h1>

      <p className="mt-2 text-gray-500">
        <SummarySection />
      </p>
    </div>
  );
}

export default DashboardPage;