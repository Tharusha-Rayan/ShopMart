import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Input Component
 * A flexible input component with label, error, and various types
 * 
 * @param {Object} props
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {React.ReactNode} props.icon - Icon to display in input
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.className - Additional CSS classes
 */
const Input = ({
  type = 'text',
  name,
  value,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  icon = null,
  onChange,
  onBlur,
  className = '',
  ...rest
}) => {
  const inputClasses = [
    'input__field',
    icon && 'input__field--with-icon',
    error && 'input__field--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input">
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <div className="input__wrapper">
        {icon && <span className="input__icon">{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          {...rest}
        />
      </div>
      {error && <span className="input__error">{error}</span>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

export default Input;
