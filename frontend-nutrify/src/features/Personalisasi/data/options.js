// ─────────────────────────────────────────────
//  Static Options – Personalization Feature
//  Semua pilihan statis dipusatkan di sini agar
//  mudah diupdate tanpa menyentuh komponen.
// ─────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "Perempuan", label: "Perempuan" },
  { value: "Laki-laki", label: "Laki-laki" },
];

export const ACTIVITY_LEVELS = [
  { value: "Sangat Jarang", label: "Sangat Jarang" },
  { value: "Ringan", label: "Ringan (1-3 hari/minggu)" },
  { value: "Sedang", label: "Sedang" },
  { value: "Sangat Aktif", label: "Sangat Aktif (6-7 hari/minggu)" },
];

export const HEALTH_CONDITIONS = [
  "Diabetes",
  "Hipertensi",
  "Obesitas",
  "Asam Urat",
  "Kolesterol",
];

export const COMMON_ALLERGIES = [
  "Udang",
  "Kepiting",
  "Kerang",
  "Kacang Tanah",
  "Susu Sapi",
  "Telur",
  "Gandum",
  "Kedelai",
  "Ikan",
];

export const COMMON_RESTRICTIONS = [
  "Santan",
  "Gorengan",
  "Daging Merah",
  "Gula Berlebih",
  "Garam Berlebih",
  "Kafein",
  "Gluten",
];

export const PRIMARY_GOALS = [
  { value: "Menurunkan Berat Badan", label: "Menurunkan Berat Badan" },
  { value: "Menjaga Berat Badan", label: "Menjaga Berat Badan" },
  { value: "Menaikkan Berat Badan", label: "Menaikkan Berat Badan" },
  { value: "Membangun Otot", label: "Membangun Otot" },
];

export const FOOD_PREFERENCES = [
  "Sayuran",
  "Buah",
  "Daging",
  "Ikan",
  "Telur",
  "Kacang-kacangan",
];

// Default form values – dipakai oleh hook dan reset
export const DEFAULT_FORM_DATA = {
  name: "",
  birthDate: "",
  gender: "Perempuan",
  height: "",
  weight: "",
  activityLevel: "Sedang",
  healthConditions: [],
  otherConditions: "",
  allergies: [],
  foodRestrictions: [],
  primaryGoal: "Menjaga Berat Badan",
  foodPreferences: [],
  additionalNotes: "",
};
