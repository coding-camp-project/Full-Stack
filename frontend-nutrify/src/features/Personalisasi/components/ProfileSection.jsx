// ─────────────────────────────────────────────
//  ProfileSection – Section 1: Data Diri
// ─────────────────────────────────────────────

import { User } from "lucide-react";
import FormInput from "./FormInput";
import { GENDER_OPTIONS, ACTIVITY_LEVELS } from "../data/options";

export default function ProfileSection({ formData, onChange }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs">
      {/* Section Header */}
      <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
        >
          <User size={16} />
        </span>
        1. Data Diri
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          label="Nama Lengkap"
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Aisyah Putri"
          required
        />

        <FormInput
          label="Tanggal Lahir"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={onChange}
          required
        />

        <FormInput
          label="Jenis Kelamin"
          type="select"
          name="gender"
          value={formData.gender}
          onChange={onChange}
          required
          options={GENDER_OPTIONS}
        />

        <FormInput
          label="Tinggi Badan"
          type="number"
          name="height"
          value={formData.height}
          onChange={onChange}
          placeholder="160"
          required
          min={50}
          max={300}
          unit="cm"
        />

        <FormInput
          label="Berat Badan"
          type="number"
          name="weight"
          value={formData.weight}
          onChange={onChange}
          placeholder="55"
          required
          min={20}
          max={500}
          unit="kg"
        />

        <FormInput
          label="Tingkat Aktivitas"
          type="select"
          name="activityLevel"
          value={formData.activityLevel}
          onChange={onChange}
          required
          options={ACTIVITY_LEVELS}
        />
      </div>
    </div>
  );
}
