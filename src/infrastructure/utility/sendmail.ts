import nodemailer from 'nodemailer';
require('dotenv').config();

class SendMail {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.auth_email,
                pass: process.env.auth_pass,
            },
        });
    }

    sendMail(name: string, email: string, verificationCode: number): Promise<{status:number; success: boolean; message: string }> {
        return new Promise((resolve, reject) => {
            const mailOptions: nodemailer.SendMailOptions = {
                from: 'naseemam8055@gmail.com',
                to: email,
                subject: 'Mind Free Trading Email Verification',
                text: `Hi ${name},\n\n Your Verification Code is ${verificationCode}. Do not share this code with anyone.`,
            };

            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error(err.message);
                    reject({
                        status:401,
                        success: false,
                        message: 'Failed to send verification code',
                    });
                } else {
                    console.log('Verification code sent successfully');
                    resolve({
                        status:200,
                        success: true,
                        message: 'Otp Sent Successfully',
                    });
                }
            });
        });
    }
}

export default SendMail;