const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
class Email {
  constructor(user, url) {
    (this.from = 'PMT'),
      (this.to = user.mail),
      (this.firstName = user.mail.split('@')[0]),
      (this.pass = user.pass),
      (this.url = url);
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}`, {
      name: this.firstName,
      url: this.url,
      pass: this.pass,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
  }
  async sendwelcome() {
    await this.send('welcome', 'Welcome...');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your Passowrd reset token');
  }
}

module.exports = Email;
