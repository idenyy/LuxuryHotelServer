import nodemailer from 'nodemailer';

export const sendMail = async (email: string, verificationCode: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: {
        name: 'Luxury Hotel',
        address: process.env.EMAIL_USER || ''
      },
      to: email,
      subject: 'Verification Code',
      html: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAWCAMAAADabWOOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFRQTFRF36do3KZj26dk26dl26Zk26dkAAAA2qdl3KZl26dl2qdk369g26Zk26Zl2qVl26dk26dk3KZj2qdl2qdl26Zk2qZl26Zl2qhl26Zl2qdl26Zk26dkLUH1OAAAABx0Uk5TIFCw/+CAAGCQ8KAQcMAwQL9f0N/vzz9vr5+Pf84pG8IAAAJpSURBVHicrVZr25sgDEUjIiCXKV3ftv//f46LQLCr1j3rlxKSk5OEECGk6wFgoGQMPzZxLwkmozTOQVRUj4aqYJX32QTARcBEC5gagKBy1AEwKNUr+yvqumhITTSTdAlmJJAOABs4WPntcUSiyisOa9kmsJBtyTx5A+i3FQca9YNjUdbYgYGwGXwoWCpaAjDkbKySAZjzWqhiQAC6BpAlldhHDaCzA5OtpphiYKegMLqaRB9VmsHpLZBFfgQMWeo39lHkckxwy1bJwRV2n01Cy0UfAPKCZnaaKy55riRLqsSOT/qTs2DM0xFP7dmcsTPgY165VDQlETv9jj20pFd2Pd77Jveyt/WC2TTX2P1ZrlIOstk7Y5drbUvfgYGxl//E7k9u6hv9ObvABzuBralfZd+PgzN28vu+8hlpffimpH6ZPdb+W3YVxihrrRmsJfXr7IrDz7fsPnd/SXfBLlD75io7nbvdbDs5d7GvVYemyzu7OmLXKtTeNf6WQ3Y57GplDtn79qQ4FqQi7/5UW4sC2NyaXa2O2VupzX2aN3+4jacGIMsoqjeuqf07e0HI0JQW2TLM06nM50jdnZs7WAFl2vAmPFM/NfuvTIAO6BybuaaHjVMuTSd/APR10gIK1ksNuyrsRsXgbPEgUNTSlbT8wHxURYcBtVbFrW8UFCxFb5n0tklNrJ/JfuZrSsbc0KtFO9SAoqGnBbDWaKUrd8Nf0kq/oC4k5GX9QLr9WOv8f4pWCu7s0zpRKtq9Hl77yjAWMOvrXrwEwMMOFaBft2iSHgLMv+nsPW4HpHve6xf2rz9j9CfVfwL43x/rlUexP5oWCgAAAABJRU5ErkJggg==" alt="LOGO">
      <p style="font-size: 16px; color: #555; text-align: center;">
        Your verification code:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #e0f7fa; background-color: #dba765; padding: 10px 20px; border-radius: 5px;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 14px; color: #777; text-align: center;">
        This code is valid for 10 minutes. If you did not make this request, simply ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} LUXURY HOTEL. All rights reserved.
      </p>
    </div>`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending Mail: ', error);
    throw new Error('Failed to Send Mail.');
  }
};
