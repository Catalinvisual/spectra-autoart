import React from 'react'
import './InteractiveMap.css'

const InteractiveMap: React.FC = () => {
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
      />
    </div>
  )
}

export default InteractiveMap