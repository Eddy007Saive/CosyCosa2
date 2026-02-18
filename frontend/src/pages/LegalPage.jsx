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
                <strong>AT OME</strong><br />
                SARL au capital de 7 000,00 €<br />
                Siège social : Pont de l'Oso, Lotissement Puretta<br />
                20170 San-Gavino-di-Carbini, France<br /><br />
                <strong>SIRET :</strong> 538 392 135 00033<br />
                <strong>SIREN :</strong> 538 392 135<br />
                <strong>RCS :</strong> Ajaccio 538 392 135<br />
                <strong>TVA Intracommunautaire :</strong> FR26538392135<br />
                <strong>Code NAF/APE :</strong> 74.10Z (Activités spécialisées de design)<br /><br />
                Email : <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-[#2e2e2e] underline">hello@conciergerie-cosycasa.fr</a><br />
                Téléphone : <a href="tel:+33615875470" className="text-[#2e2e2e] underline">+33 6 15 87 54 70</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">2. Directeur de la publication</h2>
              <p className="orso-body">
                <strong>Marc VOUILLARMET</strong><br />
                Co-gérant de la société AT OME
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">3. Hébergement</h2>
              <p className="orso-body">
                Ce site est hébergé par :<br /><br />
                <strong>Vercel Inc.</strong><br />
                440 N Barranca Ave #4133<br />
                Covina, CA 91723, États-Unis<br />
                Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#2e2e2e] underline">vercel.com</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">4. Propriété intellectuelle</h2>
              <p className="orso-body">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.) est protégé par le droit d'auteur et le droit des marques. Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie du site est strictement interdite.
              </p>
              <p className="orso-body mt-4">
                La marque ORSO RS et le logo associé sont la propriété exclusive de la société AT OME.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">5. Crédits photos</h2>
              <p className="orso-body">
                Les photographies des propriétés présentées sur ce site sont la propriété de leurs propriétaires respectifs ou d'ORSO RS. Les images d'illustration sont issues de banques d'images libres de droits (Unsplash, Pexels) ou sont utilisées avec autorisation.
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
                AT OME s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Les tarifs et disponibilités affichés sont donnés à titre indicatif et sont susceptibles de modifications.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">9. Droit applicable</h2>
              <p className="orso-body">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux d'Ajaccio seront seuls compétents.
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
