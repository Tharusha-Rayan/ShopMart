import React from 'react';
import './Card.css';

const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${!padding ? 'no-padding' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
