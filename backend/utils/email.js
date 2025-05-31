const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dns = require('dns');
const { promisify } = require('util');

// 创建邮件传输器
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaih92224@gmail.com',
        pass: 'exhz dotp dcle nqty'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// 验证邮箱地址
async function verifyEmailExists(email) {
    try {
        // 基本格式验证
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            console.log('Email format validation failed');
            return false;
        }

        // 验证域名
        const [localPart, domain] = email.split('@');
        
        // 检查常见的无效域名
        const commonInvalidDomains = ['example.com', 'test.com'];
        if (commonInvalidDomains.includes(domain.toLowerCase())) {
            console.log(`Invalid domain ${domain}`);
            return false;
        }

        // 验证本地部分长度
        if (localPart.length < 2) {
            console.log('Local part too short');
            return false;
        }

        // 验证域名MX记录
        const resolveMx = promisify(dns.resolveMx);
        try {
            const mxRecords = await resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                console.log(`Domain ${domain} MX records not found`);
                return false;
            }
            console.log(`Domain ${domain} MX records found`);

            // 尝试发送验证邮件
            try {
                const testMailOptions = {
                    from: {
                        name: 'Event Management System',
                        address: 'kaih92224@gmail.com'
                    },
                    to: email,
                    subject: 'Email Verification',
                    text: 'This is a test email to verify your email address.'
                };

                const result = await transporter.verify();
                if (!result) {
                    console.log('SMTP connection failed');
                    return false;
                }

                await transporter.sendMail(testMailOptions);
                console.log(`Email verification successful for ${email}`);
                return true;
            } catch (error) {
                // 任何邮件发送错误都视为邮箱无效
                console.log(`Email verification failed for ${email}: ${error.message}`);
                return false;
            }
        } catch (error) {
            console.log(`Failed to verify domain ${domain}: ${error.message}`);
            return false;
        }
    } catch (error) {
        console.error('Email verification error:', error);
        return false;
    }
}

// 生成随机用户名和密码
function generateCredentials(name) {
    const timestamp = Date.now().toString().slice(-4);
    const username = `${name.toLowerCase().replace(/\s+/g, '')}_${timestamp}`;
    const password = Math.random().toString(36).slice(-8);
    return { username, password };
}

// 发送凭据邮件
async function sendCredentialsEmail(organizer) {
    const { username, password } = generateCredentials(organizer.name);
    
    const mailOptions = {
        from: {
            name: 'Event Management System',
            address: 'kaih92224@gmail.com'
        },
        to: organizer.email,
        subject: 'Your Event Management System Login Credentials',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #2c3e50; text-align: center;">Welcome to Our Event Management System!</h2>
                <p>Dear ${organizer.name},</p>
                <p>Your account has been created successfully. Here are your login credentials:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                </div>
                <p>Please keep these credentials safe and use them to log in to your account at: <a href="http://localhost:4200/log-event-organizer">Organizer Login Page</a></p>
                <p style="color: #e74c3c;">Important: For security reasons, please change your password after your first login.</p>
                <p>Best regards,<br>Event Management Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { username, password };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}

// 发送电子票邮件
async function sendETicketEmail(ticketData) {
    // 首先验证邮箱是否存在
    const isEmailValid = await verifyEmailExists(ticketData.email);
    if (!isEmailValid) {
        throw new Error('Invalid email address: The email address does not exist');
    }

    const ticketId = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    const mailOptions = {
        from: {
            name: 'Event Management System',
            address: 'kaih92224@gmail.com'
        },
        to: ticketData.email,
        subject: `Your E-Ticket for ${ticketData.eventName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2c3e50; text-align: center;">E-Ticket Confirmation</h1>
                <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h2 style="color: #2c3e50;">Event Details</h2>
                    <p><strong>Event:</strong> ${ticketData.eventName}</p>
                    <p><strong>Ticket ID:</strong> ${ticketId}</p>
                    <p><strong>Seats:</strong> ${ticketData.seats.map(seat => `${seat.row}${seat.col}`).join(', ')}</p>
                    <p><strong>Amount Paid:</strong> RM${ticketData.amount.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> ${ticketData.paymentMethod}</p>
                </div>
                <div style="background-color: #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #2c3e50;">Important Information</h3>
                    <ul>
                        <li>Please show this e-ticket at the venue entrance</li>
                        <li>Arrive at least 30 minutes before the event</li>
                        <li>This ticket is non-transferable</li>
                    </ul>
                </div>
                <p style="text-align: center; color: #6c757d;">Thank you for your purchase!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return ticketId;
    } catch (error) {
        console.error('Error sending e-ticket email:', error);
        throw new Error('Failed to send e-ticket email. Please check your email address.');
    }
}

// 发送等待列表邮件
async function sendWaitlistEmail(userData) {
    try {
        const mailOptions = {
            from: {
                name: 'Event Management System',
                address: 'kaih92224@gmail.com'
            },
            to: userData.email,
            subject: 'Waitlist Confirmation - Event Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #2c3e50; text-align: center;">Thank You for Joining Our Waitlist!</h2>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${userData.name}</p>
                        <p><strong>Phone:</strong> ${userData.phone}</p>
                        <p><strong>Email:</strong> ${userData.email}</p>
                    </div>
                    <p>We have received your waitlist request. We will notify you as soon as new events become available.</p>
                    <p>Your position on the waitlist will be maintained until you choose to remove yourself or register for an event.</p>
                    <p style="color: #6c757d; font-size: 0.9em;">If you wish to be removed from the waitlist, please contact our support team.</p>
                    <p>Best regards,<br>Event Management Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Waitlist confirmation email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending waitlist email:', error);
        throw error;
    }
}

module.exports = {
    sendCredentialsEmail,
    sendETicketEmail,
    verifyEmailExists,
    sendWaitlistEmail
}; 