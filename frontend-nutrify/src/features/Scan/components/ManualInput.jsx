function ManualInput({ value, onChange }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1E1E1E]">
        Input manual makanan Anda
      </h3>

      <p className="mt-1 text-[12px] font-medium text-[#555]">
        Tuliskan komposisi makanan untuk menganalisis nutrisinya.
      </p>

      <textarea
        value={value}
        onChange={onChange}
        placeholder="Contoh: Nasi putih 1 porsi, ayam goreng 1 potong, sayur bayam 1/2 porsi, sambal 1 sendok makan."
        className="mt-4 min-h-25 w-full resize-none rounded-lg border border-[#D8D8D8] bg-white px-4 py-3 text-[13px] leading-relaxed text-[#333] outline-none transition-all duration-200 placeholder:text-[#999] focus:border-[#49AE84] focus:ring-2 focus:ring-[#49AE84]/10"
      />
    </div>
  );
}

export default ManualInput;
