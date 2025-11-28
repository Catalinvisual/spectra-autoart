import React from 'react'
import './LegalPages.css'

const GDPR: React.FC = () => {

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>AVG / GDPR Informatie</h1>
        <p className="last-updated">Laatst bijgewerkt: 27 november 2025</p>
        
        <section>
          <h2>1. Algemene Verordening Gegevensbescherming (AVG/GDPR)</h2>
          <p>
            Spectra AutoArt voldoet volledig aan de Algemene Verordening Gegevensbescherming (AVG), 
            ook wel bekend als GDPR (General Data Protection Regulation). Deze verordening is van toepassing 
            op alle bedrijven binnen de Europese Unie die persoonsgegevens verwerken.
          </p>
        </section>

        <section>
          <h2>2. Verwerkingsverantwoordelijke</h2>
          <p>
            <strong>Naam:</strong> Spectra AutoArt<br />
            <strong>Adres:</strong> Tilburg Stadscentrum<br />
            <strong>Email:</strong> privacy@spectraautoart.nl<br />
            <strong>KvK-nummer:</strong> [te registreren]<br />
            <strong>Telefoon:</strong> +31 6 12345678
          </p>
        </section>

        <section>
          <h2>3. Functionaris Gegevensbescherming (FG)</h2>
          <p>
            Voor al uw vragen en verzoeken met betrekking tot gegevensbescherming kunt u contact opnemen met 
            onze Functionaris Gegevensbescherming:
          </p>
          <p>
            <strong>Email:</strong> dpo@spectraautoart.nl<br />
            <strong>Telefoon:</strong> +31 6 12345678
          </p>
        </section>

        <section>
          <h2>4. Verwerkingsdoeleinden en rechtsgrondslagen</h2>
          
          <h3>4.1 Dienstverlening</h3>
          <p><strong>Doel:</strong> Het uitvoeren van auto detailing en styling diensten</p>
          <p><strong>Rechtsgrond:</strong> Overeenkomst (art. 6 lid 1 sub b AVG)</p>
          <p><strong>Gegevens:</strong> Contactgegevens, voertuiginformatie, afspraakgegevens</p>

          <h3>4.2 Klantcommunicatie</h3>
          <p><strong>Doel:</strong> Communicatie over afspraken, services en nazorg</p>
          <p><strong>Rechtsgrond:</strong> Overeenkomst (art. 6 lid 1 sub b AVG)</p>
          <p><strong>Gegevens:</strong> Naam, email, telefoonnummer</p>

          <h3>4.3 Facturering en administratie</h3>
          <p><strong>Doel:</strong> Financiële administratie en belastingaangiften</p>
          <p><strong>Rechtsgrond:</strong> Wettelijke verplichting (art. 6 lid 1 sub c AVG)</p>
          <p><strong>Gegevens:</strong> Factuuradres, betalingsgegevens, transactiehistorie</p>

          <h3>4.4 Marketing (optioneel)</h3>
          <p><strong>Doel:</strong> Nieuwsbrieven en promotieacties</p>
          <p><strong>Rechtsgrond:</strong> Toestemming (art. 6 lid 1 sub a AVG)</p>
          <p><strong>Gegevens:</strong> Emailadres, naam, voorkeuren</p>
        </section>

        <section>
          <h2>5. Categorieën persoonsgegevens</h2>
          <p>Wij verwerken de volgende categorieën persoonsgegevens:</p>
          <ul>
            <li><strong>Identificatiegegevens:</strong> Naam, adres, contactgegevens</li>
            <li><strong>Voertuiggegevens:</strong> Kenteken, merk, model, bouwjaar</li>
            <li><strong>Financiële gegevens:</strong> Factuuradres, betalingsgegevens</li>
            <li><strong>Communicatiegegevens:</strong> Email correspondentie, telefoongesprekken</li>
            <li><strong>Websitegegevens:</strong> IP-adres, cookies, gebruikersgedrag</li>
          </ul>
        </section>

        <section>
          <h2>6. Bewaartermijnen</h2>
          <p>Wij hanteren de volgende bewaartermijnen voor verschillende categorieën gegevens:</p>
          
          <h3>6.1 Klantgegevens</h3>
          <p><strong>Termijn:</strong> 7 jaar na laatste transactie<br />
          <strong>Reden:</strong> Wettelijke verplichting belastingwet</p>

          <h3>6.2 Factuur- en boekhoudgegevens</h3>
          <p><strong>Termijn:</strong> 7 jaar<br />
          <strong>Reden:</strong> Artikel 52 Wet op de omzetbelasting</p>

          <h3>6.3 Marketinggegevens</h3>
          <p><strong>Termijn:</strong> 2 jaar na laatste interactie of tot uitschrijving<br />
          <strong>Reden:</strong> Toestemming kan te allen tijde worden ingetrokken</p>

          <h3>6.4 Website logs</h3>
          <p><strong>Termijn:</strong> 1 jaar<br />
          <strong>Reden:</strong> Beveiliging en analyse</p>
        </section>

        <section>
          <h2>7. Uw rechten onder de AVG</h2>
          <p>Als betrokkene heeft u de volgende rechten:</p>
          
          <h3>7.1 Recht op inzage (art. 15 AVG)</h3>
          <p>U heeft het recht om te weten of wij uw persoonsgegevens verwerken en zo ja, welke gegevens dit zijn.</p>

          <h3>7.2 Recht op rectificatie (art. 16 AVG)</h3>
          <p>U kunt verzoeken om correctie van onjuiste of onvolledige persoonsgegevens.</p>

          <h3>7.3 Recht op verwijdering (art. 17 AVG)</h3>
          <p>Onder bepaalde omstandigheden kunt u verzoeken om verwijdering van uw persoonsgegevens.</p>

          <h3>7.4 Recht op beperking van verwerking (art. 18 AVG)</h3>
          <p>U kunt verzoeken om tijdelijke beperking van de verwerking van uw gegevens.</p>

          <h3>7.5 Recht op dataportabiliteit (art. 20 AVG)</h3>
          <p>U heeft het recht om uw gegevens in een gestructureerd, gangbaar en machineleesbaar formaat te ontvangen.</p>

          <h3>7.6 Recht van bezwaar (art. 21 AVG)</h3>
          <p>U kunt bezwaar maken tegen de verwerking van uw persoonsgegevens.</p>

          <h3>7.7 Recht op intrekking van toestemming</h3>
          <p>U kunt te allen tijde uw toestemming voor gegevensverwerking intrekken.</p>
        </section>

        <section>
          <h2>8. Het uitoefenen van uw rechten</h2>
          <p>
            U kunt uw rechten uitoefenen door contact op te nemen met onze Functionaris Gegevensbescherming:
          </p>
          <p>
            <strong>Email:</strong> dpo@spectraautoart.nl<br />
            <strong>Telefoon:</strong> +31 6 12345678<br />
            <strong>Adres:</strong> Spectra AutoArt, Tilburg
          </p>
          <p>
            Wij reageren binnen 1 maand op uw verzoek. Bij complexe verzoeken kunnen wij deze termijn 
            verlengen met 2 maanden.
          </p>
        </section>

        <section>
          <h2>9. Klachtrecht</h2>
          <p>
            Heeft u klachten over de verwerking van uw persoonsgegevens? Dan kunt u contact opnemen 
            met onze Functionaris Gegevensbescherming. U heeft ook het recht om een klacht in te dienen 
            bij de Autoriteit Persoonsgegevens:
          </p>
          <p>
            <strong>Autoriteit Persoonsgegevens</strong><br />
            Postbus 93374<br />
            2509 AJ Den Haag<br />
            Tel: 088 - 1805 250<br />
            Website: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">autoriteitpersoonsgegevens.nl</a>
          </p>
        </section>

        <section>
          <h2>10. Beveiliging van persoonsgegevens</h2>
          <p>Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beveiligen:</p>
          <ul>
            <li>Versleuteling van data in transit (SSL/TLS)</li>
            <li>Toegangscontrole en authenticatie</li>
            <li>Regelmatige beveiligingssoftware updates</li>
            <li>Back-up en herstelprocedures</li>
            <li>Medewerkersscholing over privacy en beveiliging</li>
            <li>Beveiligde opslag van fysieke documenten</li>
          </ul>
        </section>

        <section>
          <h2>11. Gegevensoverdracht buiten de EU</h2>
          <p>
            Wij verwerken uw gegevens uitsluitend binnen de Europese Unie. Mocht er toch sprake zijn 
            van overdracht buiten de EU, dan zorgen wij voor passende waarborgen zoals 
            standaardcontractbepalingen of adequaatheidsbesluiten.
          </p>
        </section>

        <section>
          <h2>12. Wijzigingen in dit beleid</h2>
          <p>
            Dit AVG-beleid kan worden gewijzigd. Wijzigingen worden via onze website bekend gemaakt. 
            Voor significante wijzigingen zullen wij actief communiceren naar onze klanten.
          </p>
        </section>
      </div>
    </div>
  )
}

export default GDPR