import resend from "../../config/resend.js";

export const sendActivationEmail = async (to, token) => {
    const frontUrl = process.env.FRONT_URL || "http://localhost:5173";
    const activationUrl = `${frontUrl}/activate/${token}`;

    const { data, error } = await resend.emails.send({
        from: "HEPL <onboarding@resend.dev>",
        to: [to],
        subject: "Confirme ton adresse email — HEPL Cherche Ton Stage",
        html: `
        <!DOCTYPE html>
        <html lang="fr">
        <body style="font-family:Arial;background:#f3f4f6;padding:40px;">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;">
                <h2>Confirme ton email</h2>
                <p>Active ton compte ici :</p>
                <a href="${activationUrl}" style="color:#2563eb;">
                    ${activationUrl}
                </a>
            </div>
        </body>
        </html>
        `,
    });

    if (error) {
        console.error("EMAIL ERROR:", error);
        throw new Error("Email sending failed");
    }

    return data;
};
