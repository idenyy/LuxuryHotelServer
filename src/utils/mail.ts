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
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h1 style="font-family: Times New Roman, sans-serif; color: #dba765; font-size: 18px; text-align: center;">LUXURY</h1>
            <p style=" font-size: 20px; color: #555; text-align: center;">
                Verification code
            </p>

            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 26px; font-weight: bold; color: #e0f7fa; background-color: #dba765; padding: 10px 20px; border-radius: 5px;">
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
