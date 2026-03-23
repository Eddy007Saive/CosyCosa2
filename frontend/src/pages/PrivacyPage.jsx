import { useTranslation } from 'react-i18next';
import { LegalSEO } from '@/components/SEO';

const PrivacyPage = () => {
  const { i18n } = useTranslation();

  return (
    <div className="pt-40 md:pt-44 pb-20" data-testid="privacy-page">
      <LegalSEO page="privacy" lang={i18n.language} />
      
      <div className="orso-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="orso-h1 mb-12">Politique de Confidentialité</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="orso-h3 mb-4">1. Introduction</h2>
              <p className="orso-body">
                Cosy Casa Conciergerie s'engage à protéger la vie privée des utilisateurs de son site web cosycasa.fr. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">2. Responsable du traitement</h2>
              <p className="orso-body">
                <strong>Cosy Casa Conciergerie</strong><br />
                Porto-Vecchio, Corse du Sud (20137), France<br />
                Email : <a href="mailto:contact@cosycasa.fr" className="text-[#2e2e2e] underline">contact@cosycasa.fr</a><br />
                Téléphone : <a href="tel:+33615876470" className="text-[#2e2e2e] underline">+33 6 15 87 64 70</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">3. Données collectées</h2>
              <p className="orso-body">
                Nous collectons les données suivantes lorsque vous utilisez notre site :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li><strong>Données de contact</strong> : nom, prénom, adresse email, numéro de téléphone (via le formulaire de contact)</li>
                <li><strong>Données de réservation</strong> : dates de séjour, nombre de voyageurs, préférences</li>
                <li><strong>Données de navigation</strong> : adresse IP, type de navigateur, pages visitées (cookies techniques)</li>
              </ul>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">4. Finalités du traitement</h2>
              <p className="orso-body">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li>Répondre à vos demandes de contact et de renseignements</li>
                <li>Traiter vos demandes de réservation</li>
                <li>Améliorer notre site et nos services</li>
                <li>Vous envoyer des communications commerciales (avec votre consentement)</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">5. Base légale du traitement</h2>
              <p className="orso-body">
                Le traitement de vos données est fondé sur :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li><strong>Votre consentement</strong> : pour l'envoi de communications commerciales</li>
                <li><strong>L'exécution d'un contrat</strong> : pour le traitement des réservations</li>
                <li><strong>Notre intérêt légitime</strong> : pour améliorer nos services</li>
                <li><strong>Obligations légales</strong> : conservation des données de facturation</li>
              </ul>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">6. Destinataires des données</h2>
              <p className="orso-body">
                Vos données peuvent être transmises à :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li>Notre équipe interne (service client, réservations)</li>
                <li>Nos prestataires techniques (hébergement, paiement sécurisé)</li>
                <li>Les propriétaires des biens loués (uniquement les informations nécessaires à la location)</li>
              </ul>
              <p className="orso-body mt-4">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">7. Durée de conservation</h2>
              <p className="orso-body">
                Vos données sont conservées pendant :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li><strong>Données de contact</strong> : 3 ans après le dernier contact</li>
                <li><strong>Données de réservation</strong> : 10 ans (obligations comptables)</li>
                <li><strong>Données de navigation</strong> : 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">8. Vos droits</h2>
              <p className="orso-body">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 orso-body space-y-2 mt-4">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                <li><strong>Droit de limitation</strong> : limiter le traitement de vos données</li>
              </ul>
              <p className="orso-body mt-4">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@cosycasa.fr" className="text-[#2e2e2e] underline">contact@cosycasa.fr</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">9. Cookies</h2>
              <p className="orso-body">
                Notre site utilise des cookies techniques essentiels au fonctionnement du site. Ces cookies ne nécessitent pas votre consentement. Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">10. Sécurité</h2>
              <p className="orso-body">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">11. Réclamation</h2>
              <p className="orso-body">
                Si vous estimez que le traitement de vos données n'est pas conforme à la réglementation, vous pouvez adresser une réclamation à la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#2e2e2e] underline">www.cnil.fr</a>
              </p>
            </section>

            <section>
              <h2 className="orso-h3 mb-4">12. Modifications</h2>
              <p className="orso-body">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
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

export default PrivacyPage;
