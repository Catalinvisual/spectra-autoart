import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CloseButton.css';

interface CloseButtonProps {
  className?: string;
  onClick?: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ className = '', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button 
      className={`close-button ${className}`}
      onClick={handleClick}
      aria-label="Close page"
      type="button"
    >
      <span className="close-icon">✕</span>
    </button>
  );
};

export default CloseButton;