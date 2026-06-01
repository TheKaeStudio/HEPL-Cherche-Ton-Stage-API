import transporter from "../../config/nodemailer.js";

/**
 * Envoie l'email d'activation de compte via nodemailer.
 * @param {string} to - Adresse email du destinataire.
 * @param {string} token - Token d'activation (32 bytes hex).
 */
export const sendActivationEmail = async (to, token) => {
    const frontUrl = process.env.FRONT_URL || "http://localhost:5173";
    const activationUrl = `${frontUrl}/activate/${token}`;

    await transporter.sendMail({
        from: `"HEPL Cherche Ton Stage" <${process.env.SMTP_USER}>`,
        to,
        subject: "Confirme ton adresse email — HEPL Cherche Ton Stage",
        html: `
        <!DOCTYPE html>
        <html lang="fr">
        <body style="font-family:Arial,sans-serif;background:#f3f4f6;padding:40px;margin:0;">
            <div style="max-width:560px;margin:auto;background:#ffffff;padding:36px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <h2 style="margin-top:0;color:#111827;">Confirme ton adresse email</h2>
                <p style="color:#374151;line-height:1.6;">
                    Bienvenue sur <strong>HEPL Cherche Ton Stage</strong> !<br>
                    Clique sur le bouton ci-dessous pour activer ton compte.
                </p>
                <a href="${activationUrl}"
                   style="display:inline-block;margin:20px 0;padding:12px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
                    Activer mon compte
                </a>
                <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                    Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br>
                    <a href="${activationUrl}" style="color:#2563eb;word-break:break-all;">${activationUrl}</a>
                </p>
                <p style="color:#9ca3af;font-size:12px;margin-bottom:0;">Ce lien expire dans 24 heures.</p>
            </div>
        </body>
        </html>
        `,
    });
};
