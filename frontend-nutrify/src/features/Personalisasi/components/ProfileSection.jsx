// ─────────────────────────────────────────────
//  ProfileSection – Section 1: Data Diri
// ─────────────────────────────────────────────

import { User } from "lucide-react";
import FormInput from "./FormInput";
import { GENDER_OPTIONS, ACTIVITY_LEVELS } from "../data/options";

export default function ProfileSection({ formData, onChange }) {
  return (
    <div className="min-w-0 rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-xs sm:p-6 md:p-8">
      {/* Section Header */}
      <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
        >
          <User size={16} />
        </span>
        1. Data Diri & Profil
      </h2>

      <div className="mb-8 flex flex-col items-center sm:items-start">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Foto Profil</label>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[#1E7F4E] bg-gray-100 flex-shrink-0">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <User size={32} />
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              id="profile-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onChange({ target: { name: "profilePicture", value: reader.result } });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label
              htmlFor="profile-upload"
              className="cursor-pointer bg-white border border-[#E7E7E7] hover:bg-gray-50 text-sm text-[#1E1E1E] font-medium py-2 px-4 rounded-lg inline-block transition-colors"
            >
              Ubah Foto
            </label>
            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          label="Nama Lengkap"
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Isi nama lengkap kamu di sini"
          required
        />

        <FormInput
          label="Tanggal Lahir"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={onChange}
          placeholder="Isi tanggal lahir kamu di sini"
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
          placeholder="Isi tinggi badan kamu di sini"
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
          placeholder="Isi berat badan kamu di sini"
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
