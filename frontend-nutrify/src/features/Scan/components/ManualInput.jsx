function ManualInput({ value, onChange }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1E1E1E]">
        Input manual makanan Anda
      </h3>

      <p className="mt-1 text-[12px] font-medium text-[#555]">
        Tuliskan komposisi makanan (bisa digunakan sendiri atau bersamaan dengan foto untuk mengoreksi hasil scan gambar).
      </p>

      <textarea
        value={value}
        onChange={onChange}
        placeholder="Contoh: Nasi putih 1 porsi, ayam goreng 1 potong, sayur bayam 1/2 porsi, sambal 1 sendok makan."
        className="mt-4 min-h-25 w-full resize-none rounded-lg border border-[#D8D8D8] bg-white px-4 py-3 text-[13px] leading-relaxed text-[#333] outline-none transition-all duration-200 placeholder:text-[#999] focus:border-[#49AE84] focus:ring-2 focus:ring-[#49AE84]/10"
      />

      <div className="mt-2.5 text-[11px] text-[#555] bg-[#F4FBF7] border border-[#DDF5EC] rounded-xl p-3 flex items-start gap-2 leading-relaxed">
        <span className="text-[#3e9d7d] shrink-0">💡</span>
        <span>
          <strong>Tips:</strong> Tuliskan nama makanan beserta takarannya secara detail (misal: porsi, sendok, atau gram) agar hasil analisis AI jauh lebih akurat.
        </span>
      </div>
    </div>
  );
}

export default ManualInput;
