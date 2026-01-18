import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card Component
 * A flexible card container with optional header, footer, and hover effects
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.header - Card header content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {boolean} props.hoverable - Whether card has hover effect
 * @param {boolean} props.bordered - Whether card has border
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({
  children,
  header = null,
  footer = null,
  hoverable = false,
  bordered = false,
  onClick,
  className = '',
  ...rest
}) => {
  const cardClasses = [
    'card',
    hoverable && 'card--hoverable',
    bordered && 'card--bordered',
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...rest}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;
