import { useTranslation } from 'react-i18next';
import { LegalSEO } from '@/components/SEO';

const LegalPage = () => {
  const { i18n } = useTranslation();

  return (
    <div className="pt-40 md:pt-44 pb-20" data-testid="legal-page">
      <LegalSEO page="legal" lang={i18n.language} />
      
      <div className="orso-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="orso-h1 mb-12">Mentions Légales</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="orso-h3 mb-4">1. Éditeur du site</h2>
              <p className="orso-body">
                Le site <strong>cosycasa.fr</strong> est édité par :<br /><br />
                <strong>Cosy Casa Conciergerie</strong><br />
                Porto-Vecchio, Corse du Sud, France<br /><br />
                Email : <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-[#2e2e2e] underline">hello@conciergerie-cosycasa.fr</a><br />
                Téléphone : <a href="tel:+33615876470" className="text-[#2e2e2e] underline">+33 6 15 87 64 70</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">2. Hébergement</h2>
              <p className="orso-body">
                Ce site est hébergé par :<br /><br />
                <strong>Hostinger</strong><br />
                Site : <a href="https://hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-[#2e2e2e] underline">hostinger.fr</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">3. Propriété intellectuelle</h2>
              <p className="orso-body">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.) est protégé par le droit d'auteur et le droit des marques. Toute reproduction, représentation, modification ou exploitation non autorisée de tout ou partie du site est strictement interdite.
              </p>
              <p className="orso-body mt-4">
                La marque Cosy Casa et le logo associé sont la propriété exclusive de Cosy Casa Conciergerie.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">4. Crédits photos</h2>
              <p className="orso-body">
                Les photographies des propriétés présentées sur ce site sont la propriété de leurs propriétaires respectifs ou de Cosy Casa. Les images d'illustration sont issues de banques d'images libres de droits (Unsplash, Pexels) ou sont utilisées avec autorisation.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">5. Données personnelles</h2>
              <p className="orso-body">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à : <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-[#2e2e2e] underline">hello@conciergerie-cosycasa.fr</a>
              </p>
              <p className="orso-body mt-4">
                Pour plus d'informations, consultez notre <a href="/privacy" className="text-[#2e2e2e] underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">6. Cookies</h2>
              <p className="orso-body">
                Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">7. Limitation de responsabilité</h2>
              <p className="orso-body">
                Cosy Casa s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Les tarifs et disponibilités affichés sont donnés à titre indicatif et sont susceptibles de modifications.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">8. Droit applicable</h2>
              <p className="orso-body">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux d'Ajaccio seront seuls compétents.
              </p>
            </section>

            <p className="orso-caption mt-12 text-gray-500">
              Dernière mise à jour : Mars 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
