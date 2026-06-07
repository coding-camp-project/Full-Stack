import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

  // Log to console for local testing and debugging convenience
  console.log("\n========================================================");
  console.log("📨 EMAIL VERIFICATION LINK FOR DEVELOPMENT:");
  console.log(`Email: ${email}`);
  console.log(`URL:   ${verificationUrl}`);
  console.log("========================================================\n");

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // If email configuration is missing, just skip SMTP sending (safe fallback for development)
  if (!host || !user || !pass) {
    console.log("ℹ️ Skipping SMTP email delivery: EMAIL_HOST, EMAIL_USER, or EMAIL_PASS is not configured in .env.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port == 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Nutrify Support" <${user}>`,
    to: email,
    subject: "Verifikasi Akun Nutrify Anda",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #469C7B; text-align: center;">Selamat Datang di Nutrify!</h2>
        <p>Halo,</p>
        <p>Terima kasih telah mendaftar di Nutrify. Tinggal satu langkah lagi sebelum akun Anda dapat digunakan. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #469C7B; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">Verifikasi Email Anda</a>
        </div>
        <p style="font-size: 14px; color: #718096;">Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin tautan berikut ke browser Anda:</p>
        <p style="font-size: 14px; word-break: break-all; color: #4a5568; background-color: #f7fafc; padding: 10px; border-radius: 6px;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">Jika Anda tidak merasa mendaftar di Nutrify, abaikan email ini.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
