import SummarySection from "../Components/SummarySection";
import DashboardContentSection from "../Section/DashboardContentSection";

function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Page
        </h1>
      </div>

      <SummarySection />

      <DashboardContentSection />
    </div>
  );
}

export default DashboardPage;
