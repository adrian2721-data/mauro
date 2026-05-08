const nodemailer = require('nodemailer');

// Configuración del transportador de correos
const createTransporter = async () => {
  // Si tenemos credenciales reales en el .env (ej. Gmail, SendGrid, etc.)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } 
  
  // Para entorno de desarrollo local: Crear una cuenta de prueba temporal (Ethereal)
  console.log('No se encontraron credenciales de email reales. Creando cuenta temporal de prueba...');
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"Recetario App 👨‍🍳" <noreply@recetarioapp.com>', 
      to: userEmail,
      subject: "¡Bienvenido a Recetario Node.js! 🎉", 
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #ff6b6b; text-align: center;">¡Hola ${userName}! 👋</h2>
          <p style="font-size: 16px; color: #333;">Estamos muy felices de tenerte en nuestra comunidad de amantes de la cocina.</p>
          <p style="font-size: 16px; color: #333;">A partir de ahora podrás:</p>
          <ul style="font-size: 16px; color: #333;">
            <li>Explorar cientos de recetas increíbles</li>
            <li>Compartir tus propias creaciones culinarias</li>
            <li>Gestionar tu recetario personal</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/recipes" style="background-color: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold;">¡Empezar a Cocinar!</a>
          </div>
          <p style="font-size: 14px; color: #718096; text-align: center;">Si no fuiste tú quien se registró, puedes ignorar este correo.</p>
        </div>
      `,
    });

    console.log("Email enviado exitosamente a: %s", userEmail);
    
    // Si se usó una cuenta de prueba (Ethereal), mostramos el enlace para ver el correo en consola
    if (info.messageId && info.messageId.includes('@ethereal.email') || !process.env.EMAIL_USER) {
      console.log("-----------------------------------------");
      console.log("👀 Previsualizar correo (Desarrollo): %s", nodemailer.getTestMessageUrl(info));
      console.log("-----------------------------------------");
    }

    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail
};