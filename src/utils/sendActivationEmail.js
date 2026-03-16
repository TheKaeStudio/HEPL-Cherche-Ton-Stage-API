import transporter from "../../config/nodemailer.js";

export const sendActivationEmail = async (to, token) => {
    const message = `
        <h1>Token : ${token}</h1>
    `

    await transporter.sendMail({
        from: `"HEPL Cherche Ton Stage" <${process.env.SMTP_USER}>`,
        to,
        subject: "Confirmez votre compte HEPL Cherche Ton Stage",
        html: message,
    });
};
