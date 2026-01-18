import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from '../components/icons';
import { toast } from 'react-toastify';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the message to a backend
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <Card className="info-card">
              <div className="info-icon">
                <MailIcon />
              </div>
              <h3>Email Us</h3>
              <p>support@shopmart.com</p>
              <p className="info-detail">We'll respond within 24 hours</p>
            </Card>

            <Card className="info-card">
              <div className="info-icon">
                <PhoneIcon />
              </div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <p className="info-detail">Mon-Fri, 9 AM - 6 PM</p>
            </Card>

            <Card className="info-card">
              <div className="info-icon">
                <MapPinIcon />
              </div>
              <h3>Visit Us</h3>
              <p>123 Commerce Street</p>
              <p>New York, NY 10001</p>
            </Card>
          </div>

          <Card className="contact-form-card">
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us more..."
                />
              </div>

              <Button type="submit" variant="primary" size="large" fullWidth>
                <SendIcon /> Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

