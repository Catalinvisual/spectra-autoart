import React from 'react'
import './LegalPages.css'

const CookiePolicy: React.FC = () => {

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Cookiebeleid</h1>
        <p className="last-updated">Laatst bijgewerkt: 27 november 2025</p>
        
        <section>
          <h2>1. Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestanden die op uw computer, tablet of mobiele telefoon worden opgeslagen 
            wanneer u onze website bezoekt. Ze worden gebruikt om uw gebruikservaring te verbeteren en 
            informatie over uw bezoek te verzamelen.
          </p>
        </section>

        <section>
          <h2>2. Welke cookies gebruiken wij?</h2>
          
          <h3>2.1 Functionele cookies (vereist)</h3>
          <p>Deze cookies zijn essentieel voor het functioneren van onze website:</p>
          <ul>
            <li><strong>Taalvoorkeur:</strong> Onthoudt uw gekozen taal</li>
            <li><strong>Sessie-ID:</strong> Houdt uw sessie actief tijdens het boeken</li>
            <li><strong>Gebruikersvoorkeuren:</strong> Slaat uw voorkeuren op</li>
          </ul>

          <h3>2.2 Analytische cookies</h3>
          <p>Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Analyseert websiteverkeer en gebruikersgedrag</li>
            <li><strong>Bezoekersstatistieken:</strong> Meet populariteit van pagina's</li>
            <li><strong>Prestatie-analyse:</strong> Identificeert technische problemen</li>
          </ul>

          <h3>2.3 Marketing cookies</h3>
          <p>Deze cookies worden gebruikt voor marketingdoeleinden:</p>
          <ul>
            <li><strong>Social media integratie:</strong> Delen via social media knoppen</li>
            <li><strong>Remarketing:</strong> Gerichte advertenties (alleen met toestemming)</li>
          </ul>
        </section>

        <section>
          <h2>3. Cookie-overzicht</h2>
          <div className="cookie-table">
            <table>
              <thead>
                <tr>
                  <th>Cookie Naam</th>
                  <th>Type</th>
                  <th>Doel</th>
                  <th>Vervaltijd</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>language_preference</td>
                  <td>Functioneel</td>
                  <td>Onthoudt taalvoorkeur</td>
                  <td>1 jaar</td>
                </tr>
                <tr>
                  <td>session_id</td>
                  <td>Functioneel</td>
                  <td>Houdt sessie actief</td>
                  <td>Sessie</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Analytisch</td>
                  <td>Google Analytics tracking</td>
                  <td>2 jaar</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Analytisch</td>
                  <td>Google Analytics sessie</td>
                  <td>24 uur</td>
                </tr>
                <tr>
                  <td>cookie_consent</td>
                  <td>Functioneel</td>
                  <td>Onthoudt cookie toestemming</td>
                  <td>1 jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>4. Beheer van cookies</h2>
          <p>
            U kunt cookies beheren via uw browserinstellingen. Hier vindt u instructies voor de meest 
            populaire browsers:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen-websites-opgeslagen" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/nl-nl/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          </ul>
        </section>

        <section>
          <h2>5. Impact van het weigeren van cookies</h2>
          <p>
            Als u cookies weigert of verwijdert, kan dit de functionaliteit van onze website beperken:
          </p>
          <ul>
            <li>U moet mogelijk uw taalvoorkeur herhaaldelijk instellen</li>
            <li>Het boekingsproces kan minder soepel verlopen</li>
            <li>Some website features may not work properly</li>
            <li>Wij kunnen uw voorkeuren niet onthouden</li>
          </ul>
        </section>

        <section>
          <h2>6. Third-party cookies</h2>
          <p>
            Sommige cookies worden geplaatst door derde partijen:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Voor website-analyse</li>
            <li><strong>Social media:</strong> Voor integratie met social media platforms</li>
          </ul>
          <p>
            Wij hebben geen controle over hoe deze derde partijen cookies gebruiken. 
            Raadpleeg hun privacybeleid voor meer informatie.
          </p>
        </section>

        <section>
          <h2>7. Updates van dit beleid</h2>
          <p>
            Dit cookiebeleid kan worden bijgewerkt wanneer wij wijzigingen aanbrengen in ons cookiegebruik. 
            Wij raden u aan dit beleid regelmatig te controleren.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Voor vragen over dit cookiebeleid kunt u contact opnemen:
          </p>
          <p>
            <strong>Spectra AutoArt</strong><br />
            Email: privacy@spectraautoart.nl<br />
            Telefoon: +31 6 12345678
          </p>
        </section>
      </div>
    </div>
  )
}

export default CookiePolicy