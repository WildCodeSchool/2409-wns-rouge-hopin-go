// PrivacyPolicy.tsx
import Button from "../components/Button";

const LinkBtn = ({
  to,
  label,
  className = "",
  target = "_self",
}: {
  to: string;
  label: string;
  className?: string;
  target?: string;
}) => (
  <Button
    target={target}
    isLink
    to={to}
    variant="primary"
    label={label}
    className={`!inline !align-baseline !p-0 !m-0 !bg-transparent !shadow-none !border-0 
  !font-normal !text-inherit !underline !underline-offset-2 hover:!no-underline ${className}`}
    isBgTransparent
  />
);

const PrivacyPolicy = () => {
  const siteUrl = "https://092024-rouge-5.wns.wilders.dev";
  const lastUpdated = "23 octobre 2025";

  return (
    <section className="min-h-screen md:py-10">
      <div className="mx-auto md:max-w-2xl md:rounded-xl bg-primary text-secondary p-6 sm:p-8 shadow-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
          <p className="mt-2 text-sm opacity-80">Dernière mise à jour : {lastUpdated}</p>
        </header>

        <article className="flex flex-col gap-4">
          <p>
            La présente Politique de confidentialité décrit la manière dont <strong>Hopin’Go</strong>
            {" "} (ci-après « nous ») collecte, utilise, partage et protège vos données à caractère
            personnel lors de l’utilisation du site <LinkBtn to={siteUrl} label={siteUrl} /> et des
            services associés (le « Service »).
          </p>

          <h2 className="mb-2 text-xl font-bold">1. Responsable du traitement</h2>
          <p>
            <strong>Hopin’Go</strong><br />
            LE SADENA, 34 Rue Antoine Primat, 69100 Villeurbanne, France<br />
            E-mail : <LinkBtn to="mailto:hopingo@gmail.com" label="hopingo@gmail.com" />
          </p>

          <h2 className="mb-2 text-xl font-bold">2. Données traitées</h2>
          <p>Nous pouvons traiter les catégories de données suivantes :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identité et coordonnées (nom, prénom, e-mail, téléphone), mot de passe (hashé).</li>
            <li>Données de compte (préférences, historique d’usage, trajets, messagerie).</li>
            <li>Données techniques (adresse IP, logs, navigateur, pages consultées).</li>
            <li>Données de transaction (réservations, confirmations, statuts le cas échéant).</li>
            <li>Données de support (contenu des échanges avec le service client).</li>
            <li>Cookies et traceurs (voir l’article « Cookies & traceurs »).</li>
          </ul>

          <h2 className="mb-2 text-xl font-bold">3. Finalités et bases légales</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fourniture du Service</strong> — <em>Exécution du contrat</em> (art. 6(1)(b)).</li>
            <li><strong>Sécurité / prévention de la fraude</strong> — <em>Intérêt légitime</em> (6(1)(f)).</li>
            <li><strong>Support et assistance</strong> — <em>Contrat</em> / <em>Intérêt légitime</em>.</li>
            <li><strong>Amélioration & statistiques</strong> — <em>Intérêt légitime</em> / <em>Consentement</em> (traceurs).</li>
            <li><strong>Communication</strong> (notifications de service) — <em>Contrat</em> / <em>Intérêt légitime</em>.</li>
            <li><strong>Prospection</strong> (emails/SMS opt-in) — <em>Consentement</em> (6(1)(a)).</li>
            <li><strong>Obligations légales</strong> — <em>Obligation légale</em> (6(1)(c)).</li>
          </ul>

          <h2 className="mb-2 text-xl font-bold">4. Destinataires</h2>
          <p>
            Accès limité aux équipes habilitées de Hopin’Go et à nos sous-traitants (hébergement,
            email, analytics, support) strictement pour leurs missions (art. 28 RGPD). Aucune vente
            de données.
          </p>

          <h2 className="mb-2 text-xl font-bold">5. Transferts hors UE</h2>
          <p>
            Si un transfert hors UE est nécessaire, nous utilisons un mécanisme reconnu (décision
            d’adéquation, Clauses Contractuelles Types, mesures complémentaires appropriées).
          </p>

          <h2 className="mb-2 text-xl font-bold">6. Durées de conservation</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Compte : durée de la relation, puis archivage légal ou suppression.</li>
            <li>Logs techniques : en général 6 à 12 mois (sécurité/probatoire).</li>
            <li>Prospection (consentie) : jusqu’au retrait ou 3 ans d’inactivité.</li>
            <li>Documents soumis à obligations légales : selon durées imposées (ex. comptabilité).</li>
          </ul>

          <h2 className="mb-2 text-xl font-bold">7. Sécurité</h2>
          <p>
            Mesures techniques et organisationnelles raisonnables : chiffrement en transit, mots de
            passe hashés, contrôle d’accès, pare-feu, journalisation. Aucun système n’étant parfait,
            nous notifiions les incidents conformément aux obligations applicables.
          </p>

          <h2 className="mb-2 text-xl font-bold">8. Vos droits</h2>
          <p>
            Droits d’accès, rectification, effacement, limitation, opposition, portabilité, et
            directives post-mortem. Pour exercer : DPO{" "}
            <LinkBtn to="mailto:hopingo@gmail.com" label="hopingo@gmail.com" /> — Hopin’Go,
            LE SADENA, 34 Rue Antoine Primat, 69100 Villeurbanne, France.
          </p>
          <p>
            Réclamation auprès de la CNIL :{" "}
            <LinkBtn
              to="https://www.cnil.fr/fr/plaintes"
              label="Déposer une plainte"
              target="_blank"
            />
            .
          </p>

          <h2 className="mb-2 text-xl font-bold">9. Cookies & traceurs</h2>
          <p>
            Nous utilisons des cookies nécessaires au fonctionnement du Service et, sous réserve de
            votre consentement, des cookies de mesure d’audience et de personnalisation. Vous pouvez
            gérer vos préférences via le bandeau cookies et les réglages du navigateur. En savoir plus :
            {" "}
            <LinkBtn to="/cookies" label="Politique Cookies" />
            .
          </p>

          <h2 className="mb-2 text-xl font-bold">10. Services tiers</h2>
          <p>
            Le Site peut contenir des liens vers des sites/applications tiers. Leur contenu et leurs
            pratiques de confidentialité relèvent de leur responsabilité. Consultez leurs politiques
            dédiées avant usage.
          </p>

          <h2 className="mb-2 text-xl font-bold">11. Modifications</h2>
          <p>
            Nous pouvons mettre à jour cette Politique en cas d’évolutions légales, techniques ou
            fonctionnelles. En cas de changements substantiels, information par tout moyen utile.
            La date de mise à jour figure en tête.
          </p>

          <h2 className="mb-2 text-xl font-bold">12. Contact</h2>
          <p>
            Questions sur cette Politique :{" "}
            <LinkBtn to="mailto:hopingo@gmail.com" label="hopingo@gmail.com" /> ou par courrier
            à l’adresse ci-dessus.
          </p>
        </article>

        <footer className="mt-8 flex flex-wrap gap-2">
          <LinkBtn to={siteUrl} label="Accueil Hopin’Go" />
          <LinkBtn to="/mentions-legales" label="Mentions légales" />
          <LinkBtn to="/cookies" label="Politique Cookies" />
        </footer>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
