import transporter from "../../config/nodemailer.js";

export const sendActivationEmail = async (to, token) => {
    const frontUrl = process.env.FRONT_URL || "http://localhost:5173";
    const activationUrl = `${frontUrl}/activate/${token}`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background-color:#2563eb;padding:32px 40px;">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">HEPL Cherche Ton Stage</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Confirme ton adresse email</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Tu as créé un compte sur <strong style="color:#374151;">HEPL Cherche Ton Stage</strong>.<br>
              Clique sur le bouton ci-dessous pour activer ton compte. Le lien est valable <strong>24 heures</strong>.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:6px;background-color:#2563eb;">
                  <a href="${activationUrl}"
                     style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:6px;">
                    Activer mon compte
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;line-height:1.5;">
              Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :
            </p>
            <p style="margin:0;font-size:12px;word-break:break-all;">
              <a href="${activationUrl}" style="color:#2563eb;text-decoration:none;">${activationUrl}</a>
            </p>
            <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;">
              Si tu n'as pas créé de compte, tu peux ignorer cet email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
        from: `"HEPL Cherche Ton Stage" <${process.env.SMTP_USER}>`,
        to,
        subject: "Confirme ton adresse email — HEPL Cherche Ton Stage",
        html,
    });
};
