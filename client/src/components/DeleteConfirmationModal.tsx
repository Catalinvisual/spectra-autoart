import React from 'react'
import { createPortal } from 'react-dom'
import './DeleteConfirmationModal.css'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isLoading?: boolean
  cancelText?: string
  confirmText?: string
  warningText?: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  warningText = 'This action cannot be undone.'
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  const modalContent = (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={e => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-icon-wrapper">
            <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="delete-modal-title">{title}</h3>
          <button className="delete-modal-close" onClick={onClose} disabled={isLoading}>
            ×
          </button>
        </div>
        
        <div className="delete-modal-body">
          <p className="delete-modal-message">
            {message}
            {itemName && <span className="delete-item-name">"{itemName}"</span>}
          </p>
          <p className="delete-modal-warning">
            {warningText}
          </p>
        </div>
        
        <div className="delete-modal-footer">
          <button 
            className="delete-modal-btn delete-modal-btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className="delete-modal-btn delete-modal-btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="loading-spinner" viewBox="0 0 24 24">
                  <circle className="loading-circle" cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                </svg>
                {confirmText}...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default DeleteConfirmationModal