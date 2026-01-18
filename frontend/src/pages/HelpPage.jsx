import React, { useState } from 'react';
import Card from '../components/common/Card';
import { ChevronDownIcon, ChevronUpIcon, HelpCircleIcon } from '../components/icons';
import './HelpPage.css';

const HelpPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details and complete the payment to place your order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and secure online payment methods through our payment gateway.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order from the Orders section in your dashboard.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order while it is still in "Pending" status. Go to your Orders page and click the cancel button next to the order.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout for faster delivery.'
    },
    {
      question: 'What if I receive a damaged product?',
      answer: 'Please contact our support team immediately with photos of the damaged item. We will arrange a replacement or refund based on the situation.'
    },
    {
      question: 'How do I become a seller?',
      answer: 'Click on "Become a Seller" in the footer and fill out the application form. Our team will review and approve your application within 2-3 business days.'
    },
    {
      question: 'Are my payment details secure?',
      answer: 'Yes, we use industry-standard encryption and secure payment gateways to protect your payment information.'
    },
    {
      question: 'Can I change my shipping address?',
      answer: 'You can change your shipping address while your order is in "Pending" status. Contact our support team or update it from your order details.'
    },
    {
      question: 'What is your customer support availability?',
      answer: 'Our customer support team is available Monday to Friday, 9 AM to 6 PM. You can reach us via email or the contact form.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="help-page">
      <div className="container">
        <div className="help-header">
          <HelpCircleIcon className="help-icon" />
          <h1>Help Center</h1>
          <p>Find answers to frequently asked questions</p>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <Card key={index} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{faq.question}</h3>
                  {activeIndex === index ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="help-contact">
          <Card>
            <h3>Still need help?</h3>
            <p>Can't find what you're looking for? Our support team is here to help.</p>
            <a href="/contact" className="contact-link">Contact Support</a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

