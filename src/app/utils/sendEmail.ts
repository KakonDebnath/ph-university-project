import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true : false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'pronobparsonal@gmail.com',
      pass: config.nodemailer_password,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: 'pronobparsonal@gmail.com', // sender address
    to, // list of receivers
    subject: 'Password Reset Link', // Subject line
    text: 'Reset Your Password within 10 mentis :', // plain text body
    html, // html body
  });
};
