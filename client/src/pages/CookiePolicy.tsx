import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../components/CloseButton'
import './LegalPages.css'

const CookiePolicy: React.FC = () => {
  const { t } = useTranslation()

  const getBrowserLink = (browser: string): string => {
    const links: { [key: string]: string } = {
      'Google Chrome': 'https://support.google.com/chrome/answer/95647',
      'Mozilla Firefox': 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences',
      'Safari': 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac',
      'Microsoft Edge': 'https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies',
      'Internet Explorer': 'https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies'
    }
    return links[browser] || '#'
  }

  return (
    <div className="legal-page">
      <CloseButton />
      <div className="legal-container">
        <h1>{t('cookiePolicy.title')}</h1>
        <p className="last-updated">{t('cookiePolicy.lastUpdated')}</p>
        
        <section>
          <h2>{t('cookiePolicy.section1.title')}</h2>
          <p>{t('cookiePolicy.section1.content')}</p>
        </section>

        <section>
          <h2>{t('cookiePolicy.section2.title')}</h2>
          
          <h3>{t('cookiePolicy.section2.subsection1.title')}</h3>
          <p>{t('cookiePolicy.section2.subsection1.intro')}</p>
          <ul>
            {(t('cookiePolicy.section2.subsection1.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t('cookiePolicy.section2.subsection2.title')}</h3>
          <p>{t('cookiePolicy.section2.subsection2.intro')}</p>
          <ul>
            {(t('cookiePolicy.section2.subsection2.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t('cookiePolicy.section2.subsection3.title')}</h3>
          <p>{t('cookiePolicy.section2.subsection3.intro')}</p>
          <ul>
            {(t('cookiePolicy.section2.subsection3.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('cookiePolicy.section3.title')}</h2>
          <p>{t('cookiePolicy.section3.intro')}</p>
          <div className="cookie-table">
            <table>
              <thead>
                <tr>
                  <th>{t('cookiePolicy.section3.tableHeaders.name')}</th>
                  <th>{t('cookiePolicy.section3.tableHeaders.type')}</th>
                  <th>{t('cookiePolicy.section3.tableHeaders.purpose')}</th>
                  <th>{t('cookiePolicy.section3.tableHeaders.expiry')}</th>
                </tr>
              </thead>
              <tbody>
                {(t('cookiePolicy.section3.cookies', { returnObjects: true }) as any[]).map((cookie: any, index: number) => (
                  <tr key={index}>
                    <td>{cookie.name}</td>
                    <td>{cookie.type}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>{t('cookiePolicy.section4.title')}</h2>
          <p>{t('cookiePolicy.section4.intro')}</p>
          <ul>
            {(t('cookiePolicy.section4.browsers', { returnObjects: true }) as string[]).map((browser: string, index: number) => (
              <li key={index}>
                <a href={getBrowserLink(browser)} target="_blank" rel="noopener noreferrer">
                  {browser}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('cookiePolicy.section5.title')}</h2>
          <p>{t('cookiePolicy.section5.intro')}</p>
          <ul>
            {(t('cookiePolicy.section5.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('cookiePolicy.section6.title')}</h2>
          <p>{t('cookiePolicy.section6.intro')}</p>
          <ul>
            {(t('cookiePolicy.section6.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          <p>{t('cookiePolicy.section6.outro')}</p>
        </section>

        <section>
          <h2>{t('cookiePolicy.section7.title')}</h2>
          <p>{t('cookiePolicy.section7.content')}</p>
        </section>

        <section>
          <h2>{t('cookiePolicy.section8.title')}</h2>
          <p>{t('cookiePolicy.section8.intro')}</p>
          <p dangerouslySetInnerHTML={{ __html: t('cookiePolicy.section8.contact') }} />
        </section>
      </div>
    </div>
  )
}

export default CookiePolicy