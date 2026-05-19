// ─────────────────────────────────────────────
//  usePersonalizationForm
//  Custom hook – semua state & logic form
//  dipusatkan di sini. PersonalizationPage
//  cukup call hook ini dan pass ke komponen.
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { DEFAULT_FORM_DATA } from "../data/options";
import { fetchUserProfile, saveUserProfile } from "../services/personalizationService";

export function usePersonalizationForm() {
  // ── Core form state ──────────────────────────
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // ── UI state ─────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ── Tag-selector dropdown states ─────────────
  const [allergySearch, setAllergySearch] = useState("");
  const [showAllergies, setShowAllergies] = useState(false);
  const [restrictionSearch, setRestrictionSearch] = useState("");
  const [showRestrictions, setShowRestrictions] = useState(false);

  // ── Load data from backend on mount ──────────
  useEffect(() => {
    const load = async () => {
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          setFormData({
            name: userData.name || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "Perempuan",
            height: userData.height || "",
            weight: userData.weight || "",
            activityLevel: userData.activityLevel || "Sedang",
            healthConditions: userData.healthConditions || [],
            otherConditions: userData.otherConditions || "",
            allergies: userData.allergies?.length
              ? userData.allergies
              : ["Udang"],
            foodRestrictions: userData.foodRestrictions?.length
              ? userData.foodRestrictions
              : ["Santan", "Gorengan"],
            primaryGoal: userData.primaryGoal || "Menjaga Berat Badan",
            foodPreferences: userData.foodPreferences?.length
              ? userData.foodPreferences
              : ["Sayuran", "Buah", "Ikan", "Kacang-kacangan"],
            additionalNotes: userData.additionalNotes || "",
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // ── Utilities ────────────────────────────────
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "-";
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `${age} Tahun`;
  };

  // ── Handlers ─────────────────────────────────

  /** Generic text / select / textarea handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Health condition checkbox dengan logika "Tidak Ada" exclusive */
  const handleConditionChange = (condition) => {
    setFormData((prev) => {
      if (condition === "Tidak Ada") {
        return { ...prev, healthConditions: ["Tidak Ada"] };
      }
      let updated = prev.healthConditions.filter((c) => c !== "Tidak Ada");
      if (updated.includes(condition)) {
        updated = updated.filter((c) => c !== condition);
      } else {
        updated.push(condition);
      }
      return { ...prev, healthConditions: updated };
    });
  };

  /** Hapus item alergi berdasarkan index */
  const handleRemoveAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  /** Tambah item alergi */
  const handleAddAllergy = (item) => {
    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, item],
    }));
  };

  /** Hapus item pantangan berdasarkan index */
  const handleRemoveRestriction = (index) => {
    setFormData((prev) => ({
      ...prev,
      foodRestrictions: prev.foodRestrictions.filter((_, i) => i !== index),
    }));
  };

  /** Tambah item pantangan */
  const handleAddRestriction = (item) => {
    setFormData((prev) => ({
      ...prev,
      foodRestrictions: [...prev.foodRestrictions, item],
    }));
  };

  /** Toggle food preference pill */
  const handlePreferenceChange = (pref) => {
    setFormData((prev) => {
      const updated = prev.foodPreferences.includes(pref)
        ? prev.foodPreferences.filter((p) => p !== pref)
        : [...prev.foodPreferences, pref];
      return { ...prev, foodPreferences: updated };
    });
  };

  /** Submit form → API */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await saveUserProfile(formData);
      setMessage({
        type: "success",
        text: "Personalisasi data kesehatan berhasil disimpan!",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan perubahan. Silakan coba lagi.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  /** Reset form ke nilai kosong */
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua isian?")) {
      setFormData(DEFAULT_FORM_DATA);
      setMessage({ type: "success", text: "Isian formulir berhasil disetel ulang!" });
    }
  };

  return {
    // state
    formData,
    loading,
    fetching,
    message,
    allergySearch,
    setAllergySearch,
    showAllergies,
    setShowAllergies,
    restrictionSearch,
    setRestrictionSearch,
    showRestrictions,
    setShowRestrictions,
    // handlers
    handleChange,
    handleConditionChange,
    handleRemoveAllergy,
    handleAddAllergy,
    handleRemoveRestriction,
    handleAddRestriction,
    handlePreferenceChange,
    handleSubmit,
    handleReset,
    // utils
    calculateAge,
  };
}
