
import React from 'react';
import Card from '../components/common/Card';
import { TruckIcon, PackageIcon, ClockIcon, MapPinIcon, CheckIcon } from '../components/icons';
import './ShippingInfoPage.css';

const ShippingInfoPage = () => {
  return (
    <div className="shipping-info-page">
      <div className="container">
        <div className="shipping-header">
          <TruckIcon className="shipping-icon" />
          <h1>Shipping Information</h1>
          <p>Everything you need to know about our shipping services</p>
        </div>

        <div className="shipping-content">
          <Card className="shipping-section">
            <div className="section-icon">
              <PackageIcon />
            </div>
            <h2>Shipping Methods</h2>
            <div className="shipping-methods">
              <div className="method">
                <h3>Standard Shipping</h3>
                <p className="method-time"><ClockIcon /> 3-7 business days</p>
                <p className="method-price">$5.00</p>
                <ul className="method-features">
                  <li><CheckIcon /> Tracking included</li>
                  <li><CheckIcon /> Signature not required</li>
                </ul>
              </div>

              <div className="method featured">
                <div className="featured-badge">Most Popular</div>
                <h3>Express Shipping</h3>
                <p className="method-time"><ClockIcon /> 1-2 business days</p>
                <p className="method-price">$15.00</p>
                <ul className="method-features">
                  <li><CheckIcon /> Priority handling</li>
                  <li><CheckIcon /> Real-time tracking</li>
                  <li><CheckIcon /> Signature required</li>
                </ul>
              </div>

              <div className="method">
                <h3>Same Day Delivery</h3>
                <p className="method-time"><ClockIcon /> Within 24 hours</p>
                <p className="method-price">$25.00</p>
                <ul className="method-features">
                  <li><CheckIcon /> Available in select areas</li>
                  <li><CheckIcon /> Real-time tracking</li>
                  <li><CheckIcon /> Signature required</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="shipping-section">
            <div className="section-icon">
              <MapPinIcon />
            </div>
            <h2>Delivery Areas</h2>
            <p>We ship to all 50 states in the United States and select international locations.</p>
            <div className="delivery-info">
              <div className="info-item">
                <h4>Domestic Shipping</h4>
                <p>Available to all US addresses including PO Boxes, APO/FPO addresses.</p>
              </div>
              <div className="info-item">
                <h4>International Shipping</h4>
                <p>Available to Canada, Mexico, and select European countries. Additional customs fees may apply.</p>
              </div>
            </div>
          </Card>

          <Card className="shipping-section">
            <div className="section-icon">
              <ClockIcon />
            </div>
            <h2>Processing Time</h2>
            <ul className="timeline">
              <li>
                <strong>Order Placed:</strong> Your order is confirmed and payment is processed.
              </li>
              <li>
                <strong>Processing (1-2 business days):</strong> Your order is being prepared and packed.
              </li>
              <li>
                <strong>Shipped:</strong> Your order has left our warehouse and is on its way to you.
              </li>
              <li>
                <strong>Out for Delivery:</strong> Your package is with the local courier for final delivery.
              </li>
              <li>
                <strong>Delivered:</strong> Your order has been delivered successfully.
              </li>
            </ul>
          </Card>

          <Card className="shipping-section">
            <h2>Tracking Your Order</h2>
            <p>Once your order ships, you will receive an email with your tracking number. You can also track your order from your account dashboard.</p>
            <div className="tracking-steps">
              <div className="step">
                <div className="step-number">1</div>
                <p>Check your email for tracking information</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Visit your Orders page in the dashboard</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Click on the order to view tracking details</p>
              </div>
            </div>
          </Card>

          <Card className="shipping-section">
            <h2>Shipping Policies</h2>
            <ul className="policy-list">
              <li>Orders are processed Monday through Friday (excluding holidays)</li>
              <li>Orders placed after 2 PM EST will be processed the next business day</li>
              <li>Shipping costs are calculated at checkout based on weight and destination</li>
              <li>We are not responsible for delays caused by weather or carrier issues</li>
              <li>If your package is lost or damaged, please contact us within 48 hours</li>
            </ul>
          </Card>

          <Card className="help-section">
            <h3>Need Help?</h3>
            <p>If you have questions about shipping, please contact our customer support team.</p>
            <a href="/contact" className="contact-link">Contact Support</a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;

