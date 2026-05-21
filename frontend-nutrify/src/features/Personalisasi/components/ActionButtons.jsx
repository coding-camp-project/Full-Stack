// ─────────────────────────────────────────────
//  ActionButtons – Summary box + Submit/Reset
//  Letaknya di bawah form sebagai action bar.
// ─────────────────────────────────────────────

import {
  Calendar,
  User,
  Scale,
  Activity,
  Heart,
  Target,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

export default function ActionButtons({
  loading,
  onReset,
  formData,
  calculateAge,
}) {
  const summaryItems = [
    {
      icon: <Calendar size={14} />,
      label: "Usia",
      value: calculateAge(formData.birthDate),
    },
    {
      icon: <User size={14} />,
      label: "Jenis Kelamin",
      value: formData.gender || "-",
    },
    {
      icon: <Scale size={14} />,
      label: "Tinggi / Berat",
      value:
        formData.height && formData.weight
          ? `${formData.height} cm / ${formData.weight} kg`
          : "-",
    },
    {
      icon: <Activity size={14} />,
      label: "Aktivitas",
      value: formData.activityLevel || "-",
    },
    {
      icon: <Heart size={14} />,
      label: "Kondisi",
      value:
        formData.healthConditions.filter((c) => c !== "Tidak Ada").join(", ") ||
        "Tidak Ada",
    },
    {
      icon: <Target size={14} />,
      label: "Tujuan",
      value: formData.primaryGoal || "-",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">

      {/* ── Summary box (75%) ── */}
      <div className="flex w-full min-w-0 flex-col justify-center rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-xs sm:p-6 lg:flex-[3]">
        <h3 className="text-xs font-bold text-gray-800 mb-5 flex items-center gap-2">
          <ClipboardList size={15} className="text-[#1E7F4E] shrink-0" />
          Ringkasan Profil Kesehatanmu
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 sm:gap-4">
          {summaryItems.map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#EBF7F0",
                  borderColor: "#D1F2DE",
                  color: "#1E7F4E",
                }}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-400">{label}</p>
                <p
                  className="text-xs font-bold text-gray-700 truncate"
                  title={value}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action buttons (25%) ── */}
      <div className="flex w-full min-w-0 flex-col justify-center gap-3 rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-xs lg:flex-1">
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-none outline-none hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: "#1E7F4E",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
