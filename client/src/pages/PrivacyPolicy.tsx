import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../components/CloseButton'
import './LegalPages.css'

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="legal-page">
      <CloseButton />
      <div className="legal-container">
        <h1>{t('privacyPolicy.title')}</h1>
        <p className="last-updated">{t('privacyPolicy.lastUpdated')}</p>
        
        <section>
          <h2>{t('privacyPolicy.section1.title')}</h2>
          <p>{t('privacyPolicy.section1.content')}</p>
        </section>

        <section>
          <h2>{t('privacyPolicy.section2.title')}</h2>
          <div dangerouslySetInnerHTML={{ __html: t('privacyPolicy.section2.content') }} />
        </section>

        <section>
          <h2>{t('privacyPolicy.section3.title')}</h2>
          <p>{t('privacyPolicy.section3.intro')}</p>
          
          <h3>{t('privacyPolicy.section3.subsection1.title')}</h3>
          <ul>
            {(t('privacyPolicy.section3.subsection1.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section3.subsection2.title')}</h3>
          <ul>
            {(t('privacyPolicy.section3.subsection2.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section3.subsection3.title')}</h3>
          <ul>
            {(t('privacyPolicy.section3.subsection3.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section3.subsection4.title')}</h3>
          <ul>
            {(t('privacyPolicy.section3.subsection4.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section4.title')}</h2>
          <p>{t('privacyPolicy.section4.intro')}</p>
          
          <h3>{t('privacyPolicy.section4.subsection1.title')}</h3>
          <ul>
            {(t('privacyPolicy.section4.subsection1.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section4.subsection2.title')}</h3>
          <ul>
            {(t('privacyPolicy.section4.subsection2.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section4.subsection3.title')}</h3>
          <ul>
            {(t('privacyPolicy.section4.subsection3.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>{t('privacyPolicy.section4.subsection4.title')}</h3>
          <ul>
            {(t('privacyPolicy.section4.subsection4.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section5.title')}</h2>
          <p>{t('privacyPolicy.section5.intro')}</p>
          <ul>
            {(t('privacyPolicy.section5.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section6.title')}</h2>
          <p>{t('privacyPolicy.section6.intro')}</p>
          <ul>
            {(t('privacyPolicy.section6.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section7.title')}</h2>
          <p>{t('privacyPolicy.section7.intro')}</p>
          <ul>
            {(t('privacyPolicy.section7.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t('privacyPolicy.section7.outro')}</p>
        </section>

        <section>
          <h2>{t('privacyPolicy.section8.title')}</h2>
          <p>{t('privacyPolicy.section8.intro')}</p>
          <ul>
            {(t('privacyPolicy.section8.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section9.title')}</h2>
          <p>{t('privacyPolicy.section9.intro')}</p>
          <ul>
            {(t('privacyPolicy.section9.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('privacyPolicy.section10.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('privacyPolicy.section10.content') }} />
        </section>

        <section>
          <h2>{t('privacyPolicy.section11.title')}</h2>
          <p>{t('privacyPolicy.section11.intro')}</p>
          <div dangerouslySetInnerHTML={{ __html: t('privacyPolicy.section11.contact') }} />
          <p>{t('privacyPolicy.section11.authority')}</p>
          <div dangerouslySetInnerHTML={{ __html: t('privacyPolicy.section11.authorityAddress') }} />
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy