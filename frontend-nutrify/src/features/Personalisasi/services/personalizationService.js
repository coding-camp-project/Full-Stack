// ─────────────────────────────────────────────
//  Personalization Service
//  Semua logika API dipusatkan di sini.
//  Mudah diganti base URL, headers, dsb.
//  Siap integrasi Express + MongoDB.
// ─────────────────────────────────────────────

import axios from "axios";
import { updateUserData } from "../../../utils/userSession";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Ambil auth credentials dari localStorage.
 * @returns {{ id: string, token: string } | null}
 */
const getAuthCredentials = () => {
  const storedUser = localStorage.getItem("userData") || sessionStorage.getItem("userData");
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  if (!storedUser || !token) return null;
  const { id } = JSON.parse(storedUser);
  return { id, token };
};

/**
 * GET – Ambil data personalisasi user dari backend.
 * @returns {Promise<object|null>} userData atau null jika tidak ada sesi
 */
export const fetchUserProfile = async () => {
  const credentials = getAuthCredentials();
  if (!credentials) return null;

  const { id, token } = credentials;
  const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data ?? null;
};

/**
 * PUT – Simpan / update data personalisasi user ke backend.
 * @param {object} formData – Payload lengkap form
 * @returns {Promise<object>} Response data dari server
 */
export const saveUserProfile = async (formData) => {
  const credentials = getAuthCredentials();
  if (!credentials) {
    throw new Error("Sesi login kedaluwarsa. Silakan masuk kembali.");
  }

  const { id, token } = credentials;
  const payload = {
    ...formData,
    healthConditions: Array.isArray(formData.healthConditions) ? formData.healthConditions : [],
    allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
    foodRestrictions: Array.isArray(formData.foodRestrictions) ? formData.foodRestrictions : [],
    foodPreferences: Array.isArray(formData.foodPreferences) ? formData.foodPreferences : [],
  };

  const response = await axios.put(
    `${API_BASE_URL}/api/users/${id}`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (response.data?.data) {
    updateUserData({
      ...response.data.data,
      healthConditions: Array.isArray(response.data.data.healthConditions) ? response.data.data.healthConditions : [],
      allergies: Array.isArray(response.data.data.allergies) ? response.data.data.allergies : [],
      foodRestrictions: Array.isArray(response.data.data.foodRestrictions) ? response.data.data.foodRestrictions : [],
      foodPreferences: Array.isArray(response.data.data.foodPreferences) ? response.data.data.foodPreferences : [],
      isPersonalized: true,
    });
  } else {
    updateUserData({
      ...payload,
      isPersonalized: true,
    });
  }

  return response.data;
};
