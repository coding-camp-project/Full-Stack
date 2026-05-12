function DashboardContentSection() {
  return (
    <section className="grid grid-cols-12 gap-5">
      
      {/* LEFT SIDE */}
      <div className="col-span-9 space-y-5">
        
        {/* TOP CONTENT */}
        <div className="grid grid-cols-2 gap-5">
          
          <div className="rounded-[18px] bg-white p-5 shadow-sm">
            <h2 className="text-[24px] font-bold">
              Ringkasan Nutrisi
            </h2>

            <div className="mt-5 h-[250px] rounded-xl bg-[#F5F5F5]" />
          </div>

          <div className="rounded-[18px] bg-white p-5 shadow-sm">
            <h2 className="text-[24px] font-bold">
              Tren Asupan Kalori
            </h2>

            <div className="mt-5 h-[250px] rounded-xl bg-[#F5F5F5]" />
          </div>
        </div>

        {/* FOOD HISTORY */}
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          <h2 className="text-[24px] font-bold">
            Riwayat Makanan
          </h2>

          <div className="mt-5 h-[140px] rounded-xl bg-[#F5F5F5]" />
        </div>

        {/* INSIGHT */}
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          <div className="h-[120px] rounded-xl bg-[#F5F5F5]" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-3">
        
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          
          <h2 className="text-[24px] font-bold">
            Kalender
          </h2>

          <div className="mt-5 h-[500px] rounded-xl bg-[#F5F5F5]" />
        </div>
      </div>
    </section>
  );
}

export default DashboardContentSection;