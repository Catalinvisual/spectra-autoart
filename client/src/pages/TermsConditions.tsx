import React from 'react'
import './LegalPages.css'

const TermsConditions: React.FC = () => {

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Algemene Voorwaarden</h1>
        <p className="last-updated">Laatst bijgewerkt: 27 november 2025</p>
        
        <section>
          <h2>1. Algemene Bepalingen</h2>
          <p>
            Deze algemene voorwaarden zijn van toepassing op alle diensten die worden aangeboden door 
            Spectra AutoArt, gevestigd te Tilburg. Door gebruik te maken van onze diensten gaat u 
            akkoord met deze voorwaarden.
          </p>
        </section>

        <section>
          <h2>2. Diensten</h2>
          <p>
            Spectra AutoArt biedt premium auto detailing en styling diensten aan, waaronder:
          </p>
          <ul>
            <li>Interieur en exterieur detailing</li>
            <li>Lumini ambient verlichting installatie</li>
            <li>Sterrenhemel plafond installatie</li>
            <li>Plafon retapitatie</li>
            <li>Chrome delete services</li>
            <li>Trim colantare</li>
            <li>Auto polijsten</li>
            <li>Keramische beschermingscoating</li>
          </ul>
        </section>

        <section>
          <h2>3. Afspraken en Annulering</h2>
          <p>
            <strong>3.1</strong> Afspraken kunnen online worden gemaakt via onze website of telefonisch.
          </p>
          <p>
            <strong>3.2</strong> Voor annuleringen dient u minimaal 24 uur van tevoren contact op te nemen.
            Bij late annuleringen behouden wij ons het recht voor om 50% van de servicekosten in rekening te brengen.
          </p>
          <p>
            <strong>3.3</strong> Bij het niet verschijnen zonder annulering (no-show) wordt het volledige bedrag 
            van de gereserveerde service in rekening gebracht.
          </p>
        </section>

        <section>
          <h2>4. Prijzen en Betaling</h2>
          <p>
            <strong>4.1</strong> Alle prijzen zijn inclusief BTW, tenzij anders vermeld.
          </p>
          <p>
            <strong>4.2</strong> Betaling vindt plaats na voltooiing van de dienst, tenzij anders is overeengekomen.
          </p>
          <p>
            <strong>4.3</strong> Wij accepteren contante betaling, pinbetaling en bankoverschrijving.
          </p>
          <p>
            <strong>4.4</strong> Prijzen kunnen wijzigen zonder voorafgaande kennisgeving. De prijs die geldt 
            op het moment van boeking is bindend.
          </p>
        </section>

        <section>
          <h2>5. Garantie en Klachten</h2>
          <p>
            <strong>5.1</strong> Spectra AutoArt staat garant voor de kwaliteit van haar werkzaamheden gedurende 
            30 dagen na voltooiing, met uitzondering van normale slijtage.
          </p>
          <p>
            <strong>5.2</strong> Klachten dienen binnen 7 dagen na voltooiing van de dienst schriftelijk 
            te worden gemeld.
          </p>
          <p>
            <strong>5.3</strong> Wij behouden ons het recht voor om klachten te onderzoeken en passende 
            oplossingen te bieden, waaronder herstelwerkzaamheden of gedeeltelijke terugbetaling.
          </p>
        </section>

        <section>
          <h2>6. Aansprakelijkheid</h2>
          <p>
            <strong>6.1</strong> Spectra AutoArt is aansprakelijk voor schade die ontstaat tijdens het uitvoeren 
            van onze diensten, met een maximum van de factuurwaarde van de betreffende dienst.
          </p>
          <p>
            <strong>6.2</strong> Wij zijn niet aansprakelijk voor:
          </p>
          <ul>
            <li>Schade veroorzaakt door bestaande gebreken aan het voertuig</li>
            <li>Schade die ontstaat door extreme weersomstandigheden na het uitvoeren van de dienst</li>
            <li>Waardevermindering van het voertuig</li>
            <li>Indirecte schade of gevolgschade</li>
          </ul>
        </section>

        <section>
          <h2>7. Voertuig Inname</h2>
          <p>
            <strong>7.1</strong> Bij inname van het voertuig wordt een inspectie uitgevoerd en 
            eventuele bestaande schade wordt genoteerd.
          </p>
          <p>
            <strong>7.2</strong> Persoonlijke bezittingen dienen vooraf te worden verwijderd. 
            Spectra AutoArt is niet aansprakelijk voor verloren of beschadigde persoonlijke items.
          </p>
          <p>
            <strong>7.3</strong> Het voertuig dient op de afgesproken tijd en datum te worden 
            afgeleverd en opgehaald. Bij late ophaling kunnen extra kosten in rekening worden gebracht.
          </p>
        </section>

        <section>
          <h2>8. Intellectueel Eigendom</h2>
          <p>
            Alle afbeeldingen, teksten en andere content op onze website en marketingmateriaal zijn 
            eigendom van Spectra AutoArt en mogen niet zonder toestemming worden gebruikt.
          </p>
        </section>

        <section>
          <h2>9. Privacy en Gegevensbescherming</h2>
          <p>
            Wij behandelen uw persoonlijke gegevens vertrouwelijk volgens onze 
            privacyverklaring en de Algemene Verordening Gegevensbescherming (AVG).
          </p>
        </section>

        <section>
          <h2>10. Wijzigingen in Voorwaarden</h2>
          <p>
            Spectra AutoArt behoudt zich het recht voor om deze algemene voorwaarden te wijzigen. 
            Wijzigingen worden via onze website bekend gemaakt.
          </p>
        </section>

        <section>
          <h2>11. Toepasselijk Recht</h2>
          <p>
            Op deze algemene voorwaarden is Nederlands recht van toepassing. 
            Geschillen worden voorgelegd aan de bevoegde rechter in Tilburg.
          </p>
        </section>

        <section className="contact-info">
          <h2>Contact</h2>
          <p>
            Heeft u vragen over deze algemene voorwaarden? Neem dan contact met ons op:
          </p>
          <p>
            <strong>Spectra AutoArt</strong><br />
            Tilburg Stadscentrum<br />
            Email: info@spectraautoart.nl<br />
            Telefoon: +31 6 12345678
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsConditions