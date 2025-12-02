import React from 'react'
import { useTranslation } from 'react-i18next'
import './SummaryCard.css'

interface SummaryItem {
  label: string
  value: string
}

interface SummaryCardProps {
  items: SummaryItem[]
  totalLabel: string
  totalValue: string
  title?: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  items, 
  totalLabel, 
  totalValue, 
  title 
}) => {
  const { t } = useTranslation()

  return (
    <div className="summary-card">
      <h3 className="summary-title">
        {title || t('summary') || 'Samenvatting'}
      </h3>
      
      <div className="summary-details">
        {items.map((item, index) => (
          <div key={index} className="summary-item">
            <span className="summary-label">{item.label}</span>
            <span className="summary-value">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="summary-total">
        <span className="summary-total-label">{totalLabel}</span>
        <span className="summary-total-value">{totalValue}</span>
      </div>
    </div>
  )
}

export default SummaryCard