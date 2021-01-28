import nodemailer, { SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASS, SRV_HOST } = process.env;

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASS
  }
});

export const sendMail = (mailOptions: SendMailOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (err) => {
      if (err) return reject(err);
      resolve(console.log('email sent successfully!'));
    });
  });
};

export const resetMailOptions = (
  email: string,
  token: string
): SendMailOptions => {
  return {
    to: email,
    from: ADMIN_EMAIL,
    subject: 'e-clinic account password reset',
    text: `You received this message because password reset for this account has been requested.
    To complete the process, please click on the following link:
    ${SRV_HOST}/resetpassword/${token}
    If it wasn't you and you feel like someone is just messing with you, please ignore this email.`
  };
};
