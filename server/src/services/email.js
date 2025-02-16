// server/src/services/email.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendAnalysisSummary(userEmail, analysis) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Your Startup Analysis Summary',
                html: `
                    <h2>Your Recent Startup Analysis</h2>
                    <p>Query: ${analysis.question}</p>
                    <p>Response: ${analysis.response}</p>
                    <hr>
                    <p>Access your full analysis at our platform.</p>
                `
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}