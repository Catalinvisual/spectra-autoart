import React from 'react';
import { useTranslation } from 'react-i18next';
import './LegalPages.css';

const GDPR: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>{t('gdpr.title')}</h1>
        <p className="last-updated">{t('gdpr.lastUpdated')}</p>

        <section>
          <h2>{t('gdpr.section1.title')}</h2>
          <p>{t('gdpr.section1.content')}</p>
        </section>

        <section>
          <h2>{t('gdpr.section2.title')}</h2>
          <p><strong>{t('gdpr.section2.companyName')}:</strong> {t('gdpr.section2.companyNameValue')}</p>
          <p><strong>{t('gdpr.section2.address')}:</strong> {t('gdpr.section2.addressValue')}</p>
          <p><strong>{t('gdpr.section2.email')}:</strong> {t('gdpr.section2.emailValue')}</p>
          <p><strong>{t('gdpr.section2.kvkNumber')}:</strong> {t('gdpr.section2.kvkNumberValue')}</p>
          <p><strong>{t('gdpr.section2.phone')}:</strong> {t('gdpr.section2.phoneValue')}</p>
        </section>

        <section>
          <h2>{t('gdpr.section3.title')}</h2>
          <p>{t('gdpr.section3.intro')}</p>
          <p><strong>{t('gdpr.section3.email')}:</strong> {t('gdpr.section3.emailValue')}</p>
          <p><strong>{t('gdpr.section3.phone')}:</strong> {t('gdpr.section3.phoneValue')}</p>
        </section>

        <section>
          <h2>{t('gdpr.section4.title')}</h2>
          <p>{t('gdpr.section4.intro')}</p>
          
          <div className="subsection">
            <h3>{t('gdpr.section4.serviceProvision.title')}</h3>
            <p><strong>{t('gdpr.section4.serviceProvision.purpose')}</strong></p>
            <p><strong>{t('gdpr.section4.serviceProvision.legalBasis')}</strong></p>
            <p><strong>{t('gdpr.section4.serviceProvision.data')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section4.customerCommunication.title')}</h3>
            <p><strong>{t('gdpr.section4.customerCommunication.purpose')}</strong></p>
            <p><strong>{t('gdpr.section4.customerCommunication.legalBasis')}</strong></p>
            <p><strong>{t('gdpr.section4.customerCommunication.data')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section4.billing.title')}</h3>
            <p><strong>{t('gdpr.section4.billing.purpose')}</strong></p>
            <p><strong>{t('gdpr.section4.billing.legalBasis')}</strong></p>
            <p><strong>{t('gdpr.section4.billing.data')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section4.marketing.title')}</h3>
            <p><strong>{t('gdpr.section4.marketing.purpose')}</strong></p>
            <p><strong>{t('gdpr.section4.marketing.legalBasis')}</strong></p>
            <p><strong>{t('gdpr.section4.marketing.data')}</strong></p>
          </div>
        </section>

        <section>
          <h2>{t('gdpr.section5.title')}</h2>
          <p>{t('gdpr.section5.intro')}</p>
          <ul>
            {(t('gdpr.section5.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('gdpr.section6.title')}</h2>
          <p>{t('gdpr.section6.intro')}</p>
          
          <div className="subsection">
            <h3>{t('gdpr.section6.customerData.title')}</h3>
            <p><strong>{t('gdpr.section6.customerData.period')}</strong></p>
            <p><strong>{t('gdpr.section6.customerData.reason')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section6.invoiceData.title')}</h3>
            <p><strong>{t('gdpr.section6.invoiceData.period')}</strong></p>
            <p><strong>{t('gdpr.section6.invoiceData.reason')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section6.marketingData.title')}</h3>
            <p><strong>{t('gdpr.section6.marketingData.period')}</strong></p>
            <p><strong>{t('gdpr.section6.marketingData.reason')}</strong></p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section6.websiteLogs.title')}</h3>
            <p><strong>{t('gdpr.section6.websiteLogs.period')}</strong></p>
            <p><strong>{t('gdpr.section6.websiteLogs.reason')}</strong></p>
          </div>
        </section>

        <section>
          <h2>{t('gdpr.section7.title')}</h2>
          <p>{t('gdpr.section7.intro')}</p>
          
          <div className="subsection">
            <h3>{t('gdpr.section7.rightOfAccess.title')}</h3>
            <p>{t('gdpr.section7.rightOfAccess.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToRectification.title')}</h3>
            <p>{t('gdpr.section7.rightToRectification.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToErasure.title')}</h3>
            <p>{t('gdpr.section7.rightToErasure.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToRestriction.title')}</h3>
            <p>{t('gdpr.section7.rightToRestriction.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToPortability.title')}</h3>
            <p>{t('gdpr.section7.rightToPortability.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToObject.title')}</h3>
            <p>{t('gdpr.section7.rightToObject.content')}</p>
          </div>

          <div className="subsection">
            <h3>{t('gdpr.section7.rightToWithdraw.title')}</h3>
            <p>{t('gdpr.section7.rightToWithdraw.content')}</p>
          </div>
        </section>

        <section>
          <h2>{t('gdpr.section8.title')}</h2>
          <p>{t('gdpr.section8.intro')}</p>
          <p>{t('gdpr.section8.email')}</p>
          <p>{t('gdpr.section8.phone')}</p>
          <p>{t('gdpr.section8.address')}</p>
          <p>{t('gdpr.section8.responseTime')}</p>
        </section>

        <section>
          <h2>{t('gdpr.section9.title')}</h2>
          <p>{t('gdpr.section9.intro')}</p>
          <p><strong>{t('gdpr.section9.authority')}:</strong></p>
          <p dangerouslySetInnerHTML={{ __html: t('gdpr.section9.authorityAddress') }} />
        </section>

        <section>
          <h2>{t('gdpr.section10.title')}</h2>
          <p>{t('gdpr.section10.intro')}</p>
          <ul>
            {(t('gdpr.section10.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('gdpr.section11.title')}</h2>
          <p>{t('gdpr.section11.content')}</p>
        </section>

        <section>
          <h2>{t('gdpr.section12.title')}</h2>
          <p>{t('gdpr.section12.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default GDPR;