import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../components/CloseButton'
import './LegalPages.css'

const ContactLegal: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="legal-page">
      <CloseButton />
      <div className="legal-container">
        <h1>{t('contactLegal.title')}</h1>
        <p className="last-updated">{t('contactLegal.lastUpdated')}</p>
        
        <section>
          <h2>{t('contactLegal.section1.title')}</h2>
          <p>
            <strong>{t('contactLegal.section1.companyName')}:</strong> {t('contactLegal.section1.companyNameValue')}<br />
            <strong>{t('contactLegal.section1.tradeName')}:</strong> {t('contactLegal.section1.tradeNameValue')}<br />
            <strong>{t('contactLegal.section1.legalForm')}:</strong> {t('contactLegal.section1.legalFormValue')}<br />
            <strong>{t('contactLegal.section1.located')}:</strong> {t('contactLegal.section1.locatedValue')}<br />
            <strong>{t('contactLegal.section1.kvkNumber')}:</strong> {t('contactLegal.section1.kvkNumberValue')}<br />
            <strong>{t('contactLegal.section1.vatNumber')}:</strong> {t('contactLegal.section1.vatNumberValue')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section2.title')}</h2>
          
          <h3>{t('contactLegal.section2.generalContact')}</h3>
          <p>
            <strong>{t('contactLegal.section2.address')}:</strong><br />
            <span dangerouslySetInnerHTML={{ __html: t('contactLegal.section2.addressValue') }} />
          </p>

          <h3>{t('contactLegal.section2.communicationChannels')}</h3>
          <p>
            <strong>{t('contactLegal.section2.phone')}:</strong> {t('contactLegal.section2.phoneValue')}<br />
            <strong>{t('contactLegal.section2.emailGeneral')}:</strong> {t('contactLegal.section2.emailGeneralValue')}<br />
            <strong>{t('contactLegal.section2.emailAppointments')}:</strong> {t('contactLegal.section2.emailAppointmentsValue')}<br />
            <strong>{t('contactLegal.section2.emailSupport')}:</strong> {t('contactLegal.section2.emailSupportValue')}
          </p>

          <h3>{t('contactLegal.section2.whatsappBusiness')}</h3>
          <p>
            <strong>{t('contactLegal.section2.whatsapp')}:</strong> {t('contactLegal.section2.whatsappValue')}<br />
            <strong>{t('contactLegal.section2.availability')}:</strong> {t('contactLegal.section2.availabilityValue')}
          </p>

          <h3>{t('contactLegal.section2.socialMedia')}</h3>
          <p>
            <strong>{t('contactLegal.section2.instagram')}:</strong> {t('contactLegal.section2.instagramValue')}<br />
            <strong>{t('contactLegal.section2.facebook')}:</strong> {t('contactLegal.section2.facebookValue')}<br />
            <strong>{t('contactLegal.section2.linkedin')}:</strong> {t('contactLegal.section2.linkedinValue')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section3.title')}</h2>
          <p>
            <strong>{t('contactLegal.section3.monday')}:</strong> {t('contactLegal.section3.hoursValue')}<br />
            <strong>{t('contactLegal.section3.tuesday')}:</strong> {t('contactLegal.section3.hoursValue')}<br />
            <strong>{t('contactLegal.section3.wednesday')}:</strong> {t('contactLegal.section3.hoursValue')}<br />
            <strong>{t('contactLegal.section3.thursday')}:</strong> {t('contactLegal.section3.hoursValue')}<br />
            <strong>{t('contactLegal.section3.friday')}:</strong> {t('contactLegal.section3.hoursValue')}<br />
            <strong>{t('contactLegal.section3.saturday')}:</strong> {t('contactLegal.section3.saturdayHours')}<br />
            <strong>{t('contactLegal.section3.sunday')}:</strong> {t('contactLegal.section3.closed')}
          </p>
          <p>
            <em>{t('contactLegal.section3.note')}:</em> {t('contactLegal.section3.noteText')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section4.title')}</h2>
          <p>
            {t('contactLegal.section4.intro')}
          </p>
          <ul>
            <li><strong>{t('contactLegal.section4.interiorDetailing')}:</strong> {t('contactLegal.section4.interiorDetailingDesc')}</li>
            <li><strong>{t('contactLegal.section4.exteriorDetailing')}:</strong> {t('contactLegal.section4.exteriorDetailingDesc')}</li>
            <li><strong>{t('contactLegal.section4.ambientLighting')}:</strong> {t('contactLegal.section4.ambientLightingDesc')}</li>
            <li><strong>{t('contactLegal.section4.starlightCeiling')}:</strong> {t('contactLegal.section4.starlightCeilingDesc')}</li>
            <li><strong>{t('contactLegal.section4.ceilingRestoration')}:</strong> {t('contactLegal.section4.ceilingRestorationDesc')}</li>
            <li><strong>{t('contactLegal.section4.chromeDelete')}:</strong> {t('contactLegal.section4.chromeDeleteDesc')}</li>
            <li><strong>{t('contactLegal.section4.trimWrapping')}:</strong> {t('contactLegal.section4.trimWrappingDesc')}</li>
            <li><strong>{t('contactLegal.section4.autoPolish')}:</strong> {t('contactLegal.section4.autoPolishDesc')}</li>
            <li><strong>{t('contactLegal.section4.ceramicProtection')}:</strong> {t('contactLegal.section4.ceramicProtectionDesc')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('contactLegal.section5.title')}</h2>
          
          <h3>{t('contactLegal.section5.generalLiability')}</h3>
          <p>
            {t('contactLegal.section5.generalLiabilityText')}
          </p>

          <h3>{t('contactLegal.section5.exclusions')}</h3>
          <p>
            {t('contactLegal.section5.exclusionsText')}
          </p>
          <ul>
            <li>{t('contactLegal.section5.existingDefects')}</li>
            <li>{t('contactLegal.section5.valueDepreciation')}</li>
            <li>{t('contactLegal.section5.indirectDamage')}</li>
            <li>{t('contactLegal.section5.postLocationDamage')}</li>
            <li>{t('contactLegal.section5.personalItemsLoss')}</li>
          </ul>

          <h3>{t('contactLegal.section5.insurance')}</h3>
          <p>
            {t('contactLegal.section5.insuranceText')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section6.title')}</h2>
          <p>
            {t('contactLegal.section6.intro')}
          </p>
          <ol>
            <li><strong>{t('contactLegal.section6.step1')}:</strong> {t('contactLegal.section6.step1Text')}</li>
            <li><strong>{t('contactLegal.section6.step2')}:</strong> {t('contactLegal.section6.step2Text')}</li>
            <li><strong>{t('contactLegal.section6.step3')}:</strong> {t('contactLegal.section6.step3Text')}</li>
            <li><strong>{t('contactLegal.section6.step4')}:</strong> {t('contactLegal.section6.step4Text')}</li>
            <li><strong>{t('contactLegal.section6.step5')}:</strong> {t('contactLegal.section6.step5Text')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('contactLegal.section7.title')}</h2>
          <p>
            {t('contactLegal.section7.intro')}
          </p>
          <p>
            <strong>{t('contactLegal.section7.trademarks')}:</strong> {t('contactLegal.section7.trademarksText')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section8.title')}</h2>
          <p>
            {t('contactLegal.section8.intro')}
          </p>
          <p>
            {t('contactLegal.section8.moreInfo')} <a href="/privacy">privacy policy</a> and <a href="/gdpr">GDPR policy</a>.
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section9.title')}</h2>
          <p>
            {t('contactLegal.section9.content')}
          </p>
        </section>

        <section>
          <h2>{t('contactLegal.section10.title')}</h2>
          <p>
            {t('contactLegal.section10.content')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default ContactLegal