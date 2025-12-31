const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async(token) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS,
        }
    });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const verificationURL = `${process.env.PROD_URL}/email/verify-email?token=${token}`
    try {
        await transporter.sendMail({
            from: process.env.USER_MAIL,
            to: decoded.email,
            subject: "Registration of elective subjects",
            html:  `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registration Confirmation</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 40px 0;">
                                
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
                                    
                                    <!-- Minimalist Header -->
                                    <tr>
                                        <td align="center" style="padding: 40px 0 30px 0; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b; letter-spacing: -0.5px;">Confirm Registration</h1>
                                        </td>
                                    </tr>

                                    <!-- Content Section -->
                                    <tr>
                                        <td style="padding: 40px 40px;">
                                            <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 24px;">
                                                Hello <strong>${decoded.name}</strong>,
                                            </p>
                                            <p style="margin: 0 0 30px 0; color: #64748b; font-size: 15px; line-height: 24px;">
                                                We are pleased to inform you that your seat has been reserved. Please verify your details below to complete the process.
                                            </p>

                                            <!-- Data Table -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 30px;">
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 35%;">
                                                        Full Name
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px; font-weight: 600;">
                                                        ${decoded.name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Email
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">
                                                        <a href="mailto:${decoded.email}" style="color: #0f172a; text-decoration: none; border-bottom: 1px solid #cbd5e1;">${decoded.email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Roll Number
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">
                                                        ${decoded.rollNumber}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Branch
                                                    </td>
                                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px;">
                                                        ${decoded.branch}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Activity Code
                                                    </td>
                                                    <td style="padding: 15px; color: #0f172a; font-size: 15px; font-weight: 700;">
                                                        ${decoded.subjectCode}
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- CTA Button -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" style="padding: 10px 0;">
                                                        <a href="${verificationURL}" 
                                                        style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                                            Confirm Registration
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">
                                                            This link will expire in 24 hours.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                                You received this email because you registered on our portal.<br>
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `
        })
    } catch(error) {
        console.log(`${error}`);
        throw new Error(`While sending mail to ${decoded.email}`);
    }
}

module.exports = {
    sendEmail
}