const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (options) => {
  const mailOptions = {
    from: "Shardul Sisodiya <sanalsingh@ymail.com>",
    to: options.recipient,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};
