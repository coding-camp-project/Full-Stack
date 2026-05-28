// ─────────────────────────────────────────────
//  usePersonalizationForm
//  Custom hook – semua state & logic form
//  dipusatkan di sini. PersonalizationPage
//  cukup call hook ini dan pass ke komponen.
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_FORM_DATA } from "../data/options";
import { fetchUserProfile, saveUserProfile } from "../services/personalizationService";
import {
  markPersonalizationCompleted,
  markPersonalizationIncomplete,
} from "../../../utils/userSession";

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

export function usePersonalizationForm({ isOnboardingMode = false } = {}) {
  const navigate = useNavigate();
  // ── Core form state ──────────────────────────
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // ── UI state ─────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Auto-dismiss all messages after 4 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

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
            profilePicture: userData.profilePicture || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "Perempuan",
            height: userData.height || "",
            weight: userData.weight || "",
            activityLevel: userData.activityLevel || "Sedang",
            healthConditions: normalizeArray(userData.healthConditions),
            otherConditions: userData.otherConditions || "",
            allergies: normalizeArray(userData.allergies),
            foodRestrictions: normalizeArray(userData.foodRestrictions),
            primaryGoal: userData.primaryGoal || "Menjaga Berat Badan",
            foodPreferences: normalizeArray(userData.foodPreferences),
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

  /** Health condition checkbox dengan logika "Tidak Ada" exclusive dan batas maksimal 2 */
  const handleConditionChange = (condition) => {
    // Validasi batasan maksimal 2 penyakit di luar updater state (React pure best practice)
    if (condition !== "Tidak Ada" && !formData.healthConditions.includes(condition)) {
      const activeConditions = formData.healthConditions.filter((c) => c !== "Tidak Ada");
      if (activeConditions.length >= 2) {
        setMessage({
          type: "error",
          text: "Maksimal penyakit/kondisi kesehatan yang dapat dipilih adalah 2.",
        });
        return;
      }
    }

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
      const payload = {
        ...formData,
        healthConditions: normalizeArray(formData.healthConditions),
        allergies: normalizeArray(formData.allergies),
        foodRestrictions: normalizeArray(formData.foodRestrictions),
        foodPreferences: normalizeArray(formData.foodPreferences),
      };
      const result = await saveUserProfile(payload);
      const savedData = result?.data;

      if (savedData) {
        setFormData((prev) => ({
          ...prev,
          ...savedData,
          healthConditions: normalizeArray(savedData.healthConditions),
          allergies: normalizeArray(savedData.allergies),
          foodRestrictions: normalizeArray(savedData.foodRestrictions),
          foodPreferences: normalizeArray(savedData.foodPreferences),
        }));
      }

      markPersonalizationCompleted({
        name: formData.name,
        profilePicture: formData.profilePicture,
      });

      if (isOnboardingMode) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setMessage({
        type: "success",
        text: "Personalisasi data kesehatan berhasil disimpan!",
      });
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

  /** Reset form ke nilai kosong dan lock fitur */
  const handleReset = async () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua isian? Data yang dihapus tidak dapat dikembalikan.")) {
      const resetData = {
        ...DEFAULT_FORM_DATA,
        name: formData.name, // Pertahankan nama
        profilePicture: formData.profilePicture, // Pertahankan foto profil
      };

      setLoading(true);
      try {
        await saveUserProfile(resetData);
        setFormData(resetData);

        markPersonalizationIncomplete();

        setMessage({ type: "success", text: "Data berhasil direset dan fitur dikunci kembali." });
      } catch (err) {
        console.error("Gagal mereset data:", err);
        setMessage({ type: "error", text: "Gagal mereset data di server. Silakan coba lagi." });
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    // state
    formData,
    loading,
    fetching,
    message,
    setMessage,
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
