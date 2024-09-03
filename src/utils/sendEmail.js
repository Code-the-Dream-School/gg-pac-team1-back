const nodemailer = require("nodemailer");

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Ejemplo: smtp.mailtrap.io
  port: process.env.EMAIL_PORT, // Ejemplo: 587
  secure: false, // false para STARTTLS, true para SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // Usuario del correo
    pass: process.env.EMAIL_PASS, // Contraseña del correo
  },
});

// Función para enviar el correo electrónico
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Remitente del correo
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
