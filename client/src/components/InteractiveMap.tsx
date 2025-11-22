import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './InteractiveMap.css'

const InteractiveMap: React.FC = () => {
  const { t } = useTranslation()
  const [mapError, setMapError] = useState(false)

  const handleMapError = () => {
    setMapError(true)
  }

  if (mapError) {
    return (
      <div className="interactive-map full-map map-error">
        <div className="map-error-content">
          <h3>{t('contact.mapBlockedTitle', 'Map Blocked')}</h3>
          <p>{t('contact.mapBlockedMessage', 'The map could not be loaded. This might be due to an ad blocker. Please disable your ad blocker for this site or find our location below.')}</p>
          <div className="map-error-address">
            <h4>{t('contact.ourLocation', 'Our Location')}</h4>
            <p>Tilburg, Netherlands</p>
            <p>{t('contact.address', 'Address')}: {t('contact.addressText', 'Tilburg City Center')}</p>
            <a 
              href="https://maps.google.com/maps?q=Tilburg,Netherlands" 
              target="_blank" 
              rel="noopener noreferrer"
              className="map-error-link"
            >
              {t('contact.openInGoogleMaps', 'Open in Google Maps')}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="interactive-map full-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4965.697851196688!2d5.092379!3d51.595775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6ee3c3e4a1f1b%3A0x4f5d8f3c3a2b1c6d!2sTilburg%2C%20Netherlands!5e0!3m2!1sen!2sro!4v1234567890123!5m2!1sen!2sro"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Tilburg, Netherlands Location Map"
        onError={handleMapError}
      />
    </div>
  )
}

export default InteractiveMap