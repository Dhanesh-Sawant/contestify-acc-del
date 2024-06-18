const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all requests
app.use(cors());

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// POST endpoint to handle email sending
app.post('/api/send-email', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email address is required.');
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email address format.');
    }

    // Configure nodemailer with your email service provider
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email address from environment variables
            pass: process.env.EMAIL_PASS // Your email password from environment variables
        }
    });

    // Email message options
    let mailOptions = {
        from: email, // Use the entered email as the sender address
        to: 'dhanesh23122003@gmail.com', // Receiver address (your email address)
        subject: 'Account Deletion Request', // Subject line
        text: `Email of User: ${email}` // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully.');
        }
    });
});

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for Vercel
