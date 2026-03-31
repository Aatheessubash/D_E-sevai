import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }

  return transporter;
};

export const sendEmailNotification = async ({ to, subject, html, text }) => {
  if (!to) {
    return;
  }

  const activeTransporter = getTransporter();
  const info = await activeTransporter.sendMail({
    from: process.env.EMAIL_FROM || "Digital e-Sevai <no-reply@esevai.local>",
    to,
    subject,
    text,
    html,
  });

  if (!process.env.SMTP_HOST) {
    console.log("Email preview:", typeof info.message === "string" ? info.message : JSON.stringify(info, null, 2));
  }
};
