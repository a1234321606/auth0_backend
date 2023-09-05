import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import config from '../../config';

const transporter = nodemailer.createTransport(config.mailer);
transporter.verify((error: any) => {
  if (error) {
    console.error('Connect to mail server failed:', error);
  } else {
    console.log('Connect to mail server successfully!');
  }
});

const sendTestMail = async (receivers: string[]) => {
  let html = fs.readFileSync(path.join(__dirname, 'templates/test.html'), 'utf-8');
  html = html.replace('#mailto', `mailto:${config.mailer.auth.user}`);

  const info = await transporter.sendMail({
    from: `KH's Website <${config.mailer.auth.user}>`,
    bcc: receivers,
    subject: '[KH] Testing email',
    html,
  });

  // info = { accepted: [receivers], rejected: [receivers], envelope: { from: sender, to: [receivers]} }
  console.log('Message sent: %s', info);
};

const sendEmailVerificationMail = async (receivers: string[], url: string, username: string) => {
  let html = fs.readFileSync(path.join(__dirname, 'templates/emailVerification.html'), 'utf-8');
  html = html.replace('{{ user.name }}', username).replace('{{ url }}', url);

  const info = await transporter.sendMail({
    from: `KH's Website <${config.mailer.auth.user}>`,
    bcc: receivers,
    subject: '[KH] Please verify email',
    html,
  });

  console.log('Message sent: %s', info);
};

const sendAccountDeleteMail = async (receivers: string[], username: string) => {
  let html = fs.readFileSync(path.join(__dirname, 'templates/acountDelete.html'), 'utf-8');
  html = html.replace('{{ user.name }}', username);

  const info = await transporter.sendMail({
    from: `KH's Website <${config.mailer.auth.user}>`,
    bcc: receivers,
    subject: '[KH] Account is closed permanently',
    html,
  });

  console.log('Message sent: %s', info);
};

const sendPasswordChangeMail = async (receivers: string[], username: string) => {
  let html = fs.readFileSync(path.join(__dirname, 'templates/passwordChange.html'), 'utf-8');
  html = html.replace('{{ user.name }}', username).replace('#mailto', `mailto:${config.mailer.auth.user}`);

  const info = await transporter.sendMail({
    from: `KH's Website <${config.mailer.auth.user}>`,
    bcc: receivers,
    subject: '[KH] Password has been Changed',
    html,
  });

  console.log('Message sent: %s', info);
};

export default {
  sendTestMail,
  sendEmailVerificationMail,
  sendAccountDeleteMail,
  sendPasswordChangeMail,
};
