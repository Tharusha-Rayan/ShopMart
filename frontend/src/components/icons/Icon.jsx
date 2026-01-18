/**
 * Icon Component Base
 * Wrapper for all SVG icons with consistent sizing and styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Icon.css';

const Icon = ({ 
  children, 
  size = 24, 
  color = 'currentColor', 
  className = '',
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
};

Icon.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
