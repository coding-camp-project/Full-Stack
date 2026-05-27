import { calculateDailyNeeds } from "./targetCalculator";

/**
 * Generates personalized notifications dynamically based on current user stats, targets, and scan history.
 * @param {object} user - User session profile object
 * @param {object} totals - Consumed nutrient totals for today
 * @param {Array} historyItems - History items for today
 * @returns {Array} List of dynamic notification items
 */
export const generateNotifications = (user, totals, historyItems = []) => {
  if (!user || !user.email) return [];

  const targets = calculateDailyNeeds(user);
  const conditions = (user.healthConditions || []).map(c => c.toLowerCase());
  const goal = (user.primaryGoal || "").toLowerCase();

  const notifications = [];

  const cCal = totals.calories || 0;
  const cPro = totals.protein || 0;
  const cCarb = totals.carbs || 0;
  const cFat = totals.fat || 0;
  const cSug = totals.sugar || 0;
  const cSod = totals.sodium || 0;
  const cFib = totals.fiber || 0;

  const tCal = targets.targetCalories || 2000;
  const tPro = targets.targetProtein || 80;
  const tCarb = targets.targetCarbs || 300;
  const tFat = targets.targetFat || 70;
  const tSug = targets.targetSugar || 50;
  const tSod = targets.targetSodium || 2000;
  const tFib = targets.targetFiber || 25;

  // ────────────────────────────────────────────────────────
  // 1. ACHIEVEMENTS (Green)
  // ────────────────────────────────────────────────────────
  
  // Calorie Target Achieved
  if (cCal >= tCal * 0.9 && cCal <= tCal * 1.1) {
    notifications.push({
      id: "achieve_calorie",
      title: "Target Kalori Tercapai 🎉",
      description: `Target kalori harian Anda berhasil tercapai (${cCal} kkal / ${tCal} kkal). Pertahankan keseimbangan asupan energi harian Anda!`,
      type: "achievement",
      category: "Achievement",
      color: "green",
    });
  }

  // Protein Target Achieved
  if (cPro >= tPro) {
    notifications.push({
      id: "achieve_protein",
      title: "Target Protein Tercapai! 💪",
      description: `Hebat! Asupan protein Anda hari ini (${cPro}g) telah memenuhi target harian (${tPro}g). Sangat baik untuk pemulihan dan pertumbuhan otot.`,
      type: "achievement",
      category: "Achievement",
      color: "green",
    });
  }

  // Fiber Target Achieved
  if (cFib >= tFib) {
    notifications.push({
      id: "achieve_fiber",
      title: "Target Serat Terpenuhi! 🥦",
      description: `Bagus sekali! Asupan serat harian telah terpenuhi (${cFib}g / ${tFib}g), berkontribusi sangat baik bagi kelancaran sistem pencernaan Anda.`,
      type: "achievement",
      category: "Achievement",
      color: "green",
    });
  }

  // ────────────────────────────────────────────────────────
  // 2. HEALTH ALERTS (Red / Yellow)
  // ────────────────────────────────────────────────────────

  // Hypertension / Sodium warnings
  if (conditions.includes("hipertensi") || conditions.includes("tekanan darah tinggi") || conditions.includes("tensi")) {
    if (cSod > tSod) {
      notifications.push({
        id: "alert_sodium_exceeded",
        title: "Bahaya: Sodium Berlebih! ⚠️",
        description: `Asupan sodium hari ini (${cSod}mg) telah melebihi batas hipertensi Anda (${tSod}mg). Segera kurangi konsumsi garam, makanan olahan, dan mie instan.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "red",
      });
    } else if (cSod > tSod * 0.8) {
      notifications.push({
        id: "alert_sodium_warning",
        title: "Perhatian: Sodium Cukup Tinggi",
        description: `Asupan sodium Anda (${cSod}mg) mendekati ambang batas harian untuk penderita hipertensi (${tSod}mg). Pilihlah menu rendah garam untuk sisa hari ini.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "yellow",
      });
    }
  } else if (cSod > tSod) {
    notifications.push({
      id: "alert_sodium_general",
      title: "Asupan Sodium Tinggi",
      description: `Asupan sodium Anda (${cSod}mg) melampaui anjuran harian umum (${tSod}mg). Kurangi makanan asin untuk menjaga kestabilan tekanan darah Anda.`,
      type: "alert",
      category: "Reminder Kesehatan",
      color: "yellow",
    });
  }

  // Diabetes / Sugar & Carbs warnings
  if (conditions.includes("diabetes") || conditions.includes("kencing manis") || conditions.includes("gula")) {
    if (cSug > tSug) {
      notifications.push({
        id: "alert_sugar_exceeded",
        title: "Bahaya: Gula Berlebih! ⚠️",
        description: `Asupan gula hari ini (${cSug}g) melebihi batas anjuran diabetes Anda (${tSug}g). Hindari camilan manis, sirup, atau jus buah dengan gula tambahan.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "red",
      });
    } else if (cCarb > tCarb) {
      notifications.push({
        id: "alert_carb_exceeded",
        title: "Perhatian: Karbohidrat Berlebih ⚠️",
        description: `Karbohidrat hari ini (${cCarb}g) melebihi target terkontrol Anda (${tCarb}g). Sebaiknya kurangi porsi nasi putih atau roti pada menu makan berikutnya.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "red",
      });
    }
  } else {
    if (cSug > tSug) {
      notifications.push({
        id: "alert_sugar_general",
        title: "Asupan Gula Tinggi",
        description: `Konsumsi gula Anda (${cSug}g) hari ini melampaui anjuran sehat (${tSug}g). Batasi makanan dan minuman manis untuk mencegah lonjakan energi negatif.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "yellow",
      });
    }
  }

  // Cholesterol / Obesity Fat warning
  if (conditions.includes("kolesterol") || conditions.includes("obesitas") || goal.includes("turun") || goal.includes("loss")) {
    if (cFat > tFat) {
      notifications.push({
        id: "alert_fat_exceeded",
        title: "Batas Lemak Terlampaui ⚠️",
        description: `Asupan lemak Anda (${cFat}g) melebihi batas diet yang dianjurkan (${tFat}g). Batasi konsumsi gorengan, santan, mentega, atau daging berlemak.`,
        type: "alert",
        category: "Reminder Kesehatan",
        color: "red",
      });
    }
  }

  // ────────────────────────────────────────────────────────
  // 3. NUTRITION PROGRESS (Yellow / Red reminders)
  // ────────────────────────────────────────────────────────
  
  // Calorie under-eating (only trigger if they logged something but are far under)
  if (cCal > 0 && cCal < tCal * 0.6) {
    notifications.push({
      id: "progress_calorie_under",
      title: "Kalori Hari Ini Masih Rendah",
      description: `Asupan kalori Anda baru mencapai ${cCal} kkal dari target ${tCal} kkal harian. Tambahkan menu seimbang agar energi Anda tetap terjaga sepanjang hari.`,
      type: "progress",
      category: "Progress Nutrisi",
      color: "yellow",
    });
  }

  // Protein target deficiency
  if (cPro > 0 && cPro < tPro * 0.6) {
    notifications.push({
      id: "progress_protein_under",
      title: "Target Protein Belum Tercapai",
      description: `Asupan protein Anda masih di bawah target (${cPro}g / ${tPro}g). Coba tambahkan lauk kaya protein seperti dada ayam, tempe, tahu, atau ikan.`,
      type: "progress",
      category: "Progress Nutrisi",
      color: "yellow",
    });
  }

  // Fiber target deficiency
  if (cFib > 0 && cFib < tFib * 0.6) {
    notifications.push({
      id: "progress_fiber_under",
      title: "Kekurangan Serat Harian",
      description: `Asupan serat Anda masih tergolong rendah (${cFib}g / ${tFib}g). Konsumsi lebih banyak sayur, oat, chia seeds, atau buah apel pada makan berikutnya.`,
      type: "progress",
      category: "Progress Nutrisi",
      color: "yellow",
    });
  }

  // ────────────────────────────────────────────────────────
  // 4. DAILY REMINDERS (Blue/Yellow general status)
  // ────────────────────────────────────────────────────────

  // No Scan Today Alert
  const loggedToday = historyItems.some(item => {
    const itemDate = new Date(item.date || item.createdAt);
    return itemDate.toDateString() === new Date().toDateString();
  });

  if (!loggedToday && historyItems.length === 0) {
    notifications.push({
      id: "reminder_no_scan",
      title: "Mulai Pencatatan Makanan Pertama! 📸",
      description: "Anda belum mencatat makanan hari ini. Ambil foto atau ketik menu sarapan/makan siang Anda sekarang untuk memantau kalori Anda!",
      type: "reminder",
      category: "Hari Ini",
      color: "yellow",
    });
  }

  // Water Hydration reminder
  notifications.push({
    id: "reminder_water",
    title: "Jangan Lupa Minum Air Putih 💧",
    description: `Target minum air harian Anda adalah ${conditions.includes("asam urat") ? "3" : "2"} Liter. Pastikan terhidrasi dengan minum air secara teratur sepanjang hari.`,
    type: "reminder",
    category: "Hari Ini",
    color: "green",
  });

  return notifications;
};
