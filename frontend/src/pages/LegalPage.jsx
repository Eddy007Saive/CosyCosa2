import { useTranslation } from 'react-i18next';
import { LegalSEO } from '@/components/SEO';

const LegalPage = () => {
  const { i18n } = useTranslation();

  return (
    <div className="pt-24 md:pt-32 pb-20" data-testid="legal-page">
      <LegalSEO page="legal" lang={i18n.language} />
      
      <div className="orso-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="orso-h1 mb-12">Mentions Légales</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="orso-h3 mb-4">1. Éditeur du site</h2>
              <p className="orso-body">
                Le site <strong>orso-rs.com</strong> est édité par :<br /><br />
                <strong>ORSO RENTAL SELECTION</strong><br />
                Conciergerie de luxe et locations saisonnières<br />
                Porto-Vecchio, Corse du Sud (20137)<br />
                France<br /><br />
                Email : <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-[#2e2e2e] underline">hello@conciergerie-cosycasa.fr</a><br />
                Téléphone : <a href="tel:+33615875470" className="text-[#2e2e2e] underline">+33 6 15 87 54 70</a>
              </p>
              <p className="orso-body text-gray-500 italic mt-4">
                [À compléter : SIRET, RCS, TVA intracommunautaire, capital social]
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">2. Directeur de la publication</h2>
              <p className="orso-body text-gray-500 italic">
                [À compléter : Nom du directeur de publication]
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">3. Hébergement</h2>
              <p className="orso-body text-gray-500 italic">
                [À compléter : Nom de l'hébergeur, adresse, contact]
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">4. Propriété intellectuelle</h2>
              <p className="orso-body">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.) est protégé par le droit d'auteur et le droit des marques. Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie du site est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">5. Crédits photos</h2>
              <p className="orso-body">
                Les photographies utilisées sur ce site sont soit la propriété d'ORSO RS, soit utilisées avec autorisation, soit issues de banques d'images libres de droits (Unsplash, Pexels).
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">6. Données personnelles</h2>
              <p className="orso-body">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à : <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-[#2e2e2e] underline">hello@conciergerie-cosycasa.fr</a>
              </p>
              <p className="orso-body mt-4">
                Pour plus d'informations, consultez notre <a href="/privacy" className="text-[#2e2e2e] underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">7. Cookies</h2>
              <p className="orso-body">
                Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">8. Limitation de responsabilité</h2>
              <p className="orso-body">
                ORSO RS s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Les tarifs et disponibilités affichés sont donnés à titre indicatif et sont susceptibles de modifications.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">9. Droit applicable</h2>
              <p className="orso-body">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <p className="orso-caption mt-12 text-gray-500">
              Dernière mise à jour : Février 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
