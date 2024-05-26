const nodemailer = require('nodemailer')

module.exports = async (options) => {
  const transporter = nodemailer.createTransport({
    server: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ruthwikpunati@gmail.com',
      pass: 'gpbf udvc dfhc kmsz',
    },
  })
  const mailOptions = {
    from: { name: 'India Tourism', address: 'ruthwikpunati@gmail.com' },
    to: options.to,
    subject: options.subject,
    text: options.text,
  }
  await transporter.sendMail(mailOptions)
}
