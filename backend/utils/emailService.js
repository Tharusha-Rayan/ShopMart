const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates with blue/orange branding
const emailStyles = `
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #F5F5F5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
    .header { background: linear-gradient(135deg, #1E88E5, #42A5F5); padding: 30px; text-align: center; }
    .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content p { color: #212121; line-height: 1.6; font-size: 16px; }
    .button { display: inline-block; padding: 14px 32px; background: #FB8C00; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #F57C00; }
    .footer { background-color: #1E88E5; color: #FFFFFF; padding: 20px; text-align: center; font-size: 14px; }
    .highlight { color: #FB8C00; font-weight: 600; }
  </style>
`;

// Send email verification
exports.sendVerificationEmail = async (user, verificationUrl) => {
  const html = `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h1>🛍️ Welcome to SmartShop!</h1>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${user.name}</span>,</p>
        <p>Thank you for registering with SmartShop! To complete your registration, please verify your email address by clicking the button below:</p>
        <center>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </center>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #1E88E5;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} SmartShop. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `SmartShop <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify Your Email - SmartShop',
    html
  });
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h1>🔒 Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${user.name}</span>,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <center>
          <a href="${resetUrl}" class="button">Reset Password</a>
        </center>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #1E88E5;">${resetUrl}</p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} SmartShop. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `SmartShop <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request - SmartShop',
    html
  });
};

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #E0E0E0;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E0E0E0; text-align: right; color: #1E88E5; font-weight: 600;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h1>✅ Order Confirmed!</h1>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${user.name}</span>,</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        <p><strong>Order Number:</strong> <span class="highlight">#${order._id}</span></p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #E3F2FD;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p><strong>Total:</strong> <span class="highlight" style="font-size: 20px;">$${order.total.toFixed(2)}</span></p>
        <center>
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">Track Your Order</a>
        </center>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} SmartShop. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `SmartShop <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmation #${order._id} - SmartShop`,
    html
  });
};

// Send order shipped email
exports.sendOrderShippedEmail = async (user, order) => {
  const html = `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h1>📦 Your Order Has Shipped!</h1>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${user.name}</span>,</p>
        <p>Great news! Your order <span class="highlight">#${order._id}</span> has been shipped and is on its way to you.</p>
        ${order.tracking?.trackingNumber ? `
          <p><strong>Tracking Number:</strong> <span class="highlight">${order.tracking.trackingNumber}</span></p>
          <p><strong>Carrier:</strong> ${order.tracking.carrier}</p>
        ` : ''}
        <center>
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">Track Your Package</a>
        </center>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} SmartShop. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `SmartShop <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Your Order Has Shipped - #${order._id}`,
    html
  });
};

// Send order delivered email
exports.sendOrderDeliveredEmail = async (user, order) => {
  const html = `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h1>🎉 Order Delivered!</h1>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${user.name}</span>,</p>
        <p>Your order <span class="highlight">#${order._id}</span> has been successfully delivered!</p>
        <p>We hope you love your purchase. Please take a moment to leave a review and help other shoppers.</p>
        <center>
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}/review" class="button">Write a Review</a>
        </center>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} SmartShop. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `SmartShop <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Delivered - #${order._id}`,
    html
  });
};

module.exports = transporter;
