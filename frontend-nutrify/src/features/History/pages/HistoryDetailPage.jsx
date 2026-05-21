import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScanResultSection from "../../Scan/sections/ScanResultSection";
import { getHistoryById } from "../services/historyService";
import { mapHistoryRecordToScanResult } from "../utils/historyMappers";

function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyDetail, setHistoryDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getHistoryById(id)
      .then((detail) => {
        if (isMounted) {
          setHistoryDetail(detail);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil detail riwayat", err);

        if (isMounted) {
          setError(err.response?.data?.message || "Detail riwayat tidak ditemukan.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full px-5 py-7 lg:px-7">
        <div className="rounded-2xl border border-[#D8D8D8] bg-white p-8 text-center text-[14px] font-semibold text-[#49AE84] shadow-sm">
          Memuat detail hasil scan...
        </div>
      </div>
    );
  }

  if (error || !historyDetail) {
    return (
      <div className="w-full min-w-0 px-4 py-5 sm:px-5 sm:py-7 lg:px-7">
        <div className="rounded-2xl border border-[#D8D8D8] bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-[18px] font-bold text-[#1E1E1E]">
            Riwayat tidak ditemukan
          </h2>
          <p className="mt-2 text-[14px] text-[#777]">
            {error || "Data hasil scan ini tidak tersedia."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-5 rounded-xl bg-[#1E7F4E] px-4 py-2 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#16663E]"
          >
            Kembali ke History
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScanResultSection
      imagePreview={historyDetail.image}
      result={mapHistoryRecordToScanResult(historyDetail)}
      showRescanButton={false}
    />
  );
}

export default HistoryDetailPage;
