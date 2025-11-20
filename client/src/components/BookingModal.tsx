import React, { useEffect } from 'react'
import BookingWizard from './BookingWizard'
import './BookingModal.css'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={`booking-modal-overlay ${isOpen ? 'booking-modal-open' : 'booking-modal-hidden'}`} onClick={handleBackdropClick}>
      <div className="booking-modal booking-modal-instant">
        <div className="booking-modal-content">
          <BookingWizard onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}

export default BookingModal