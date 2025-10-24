import Button from "../components/Button";

const LinkBtn = ({
  to,
  label,
  className = "",
  target = "_self"
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

const TermsOfService = () => {
  const siteUrl = "https://092024-rouge-5.wns.wilders.dev";
  return (
    <section className="min-h-screen md:py-10">
      <div className="mx-auto md:max-w-2xl md:rounded-xl bg-primary text-secondary p-6 sm:p-8 shadow-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Mentions légales</h1>
         
        </header>

        <article className="flex flex-col gap-4">
          <h2 className="mb-2 text-xl font-bold" >Définitions</h2>
          <p>
            Client : tout professionnel ou personne physique capable au sens des
            articles 1123 et suivants du Code civil, ou personne morale, qui visite le
            Site objet des présentes conditions générales.
          </p>
          <p>
            Prestations et Services :
            <LinkBtn to={siteUrl} label={siteUrl} /> met à disposition des Clients :
          </p>
          <p>
            Contenu : Ensemble des éléments constituants l’information présente sur
            le Site, notamment textes – images – vidéos.
          </p>
          <p>
            Informations clients : Ci après dénommé « Information (s) » qui
            correspondent à l’ensemble des données personnelles susceptibles d’être
            détenues par <LinkBtn to={siteUrl} label={siteUrl} /> pour la gestion de votre
            compte, de la gestion de la relation client et à des fins d’analyses et de
            statistiques.
          </p>
          <p>
            Utilisateur : Internaute se connectant, utilisant le site susnommé.
          </p>
          <p>
            Informations personnelles : « Les informations qui permettent, sous
            quelque forme que ce soit, directement ou non, l'identification des personnes
            physiques auxquelles elles s'appliquent » (article 4 de la loi n° 78-17 du 6
            janvier 1978).
          </p>
          <p>
            Les termes « données à caractère personnel », « personne concernée », « sous
            traitant » et « données sensibles » ont le sens défini par le Règlement
            Général sur la Protection des Données (RGPD : n° 2016-679).
          </p>

          <h2 className="mb-2 text-xl font-bold" >1. Présentation du site internet.</h2>
          <p>
            En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
            confiance dans l'économie numérique, il est précisé aux utilisateurs du site
            internet <LinkBtn to={siteUrl} label={siteUrl} /> l'identité des différents
            intervenants dans le cadre de sa réalisation et de son suivi:
          </p>
          <p>
            <strong>Propriétaire</strong> : SAS Hopin'Go Capital social de 0€ — LE SADENA,
            34 Rue Antoine Primat, 69100 Villeurbanne, France<br />
            <strong>Responsable publication</strong> : Hopin'Go – hopingo@gmail.com<br />
            Le responsable publication est une personne physique ou une personne morale.
            <br />
            <strong>Webmaster</strong> : Hopin'Go – hopingo@gmail.com<br />
            <strong>Hébergeur</strong> : ovh – 2 rue Kellermann 59100 Roubaix 1007<br />
            <strong>Délégué à la protection des données</strong> : Hopin'Go –
            hopingo@gmail.com
          </p>
          <p>
            Les mentions légales sont issues du modèle proposé par le{" "}
            <LinkBtn
              to="https://fr.orson.io/1371/generateur-mentions-legales"
              label="générateur de mentions légales RGPD d'Orson.io"
              target="_blank"
            />
            .
          </p>

          <h2 className="mb-2 text-xl font-bold" >2. Conditions générales d’utilisation du site et des services proposés.</h2>
          <p>
            Le Site constitue une œuvre de l’esprit protégée par les dispositions du Code
            de la Propriété Intellectuelle et des Réglementations Internationales
            applicables. Le Client ne peut en aucune manière réutiliser, céder ou
            exploiter pour son propre compte tout ou partie des éléments ou travaux du
            Site.
          </p>
          <p>
            L’utilisation du site <LinkBtn to={siteUrl} label={siteUrl} /> implique
            l’acceptation pleine et entière des conditions générales d’utilisation
            ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être
            modifiées ou complétées à tout moment, les utilisateurs du site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> sont donc invités à les consulter de
            manière régulière.
          </p>
          <p>
            Ce site internet est normalement accessible à tout moment aux utilisateurs.
            Une interruption pour raison de maintenance technique peut être toutefois
            décidée par <LinkBtn to={siteUrl} label={siteUrl} />, qui s’efforcera alors de
            communiquer préalablement aux utilisateurs les dates et heures de
            l’intervention. Le site web <LinkBtn to={siteUrl} label={siteUrl} /> est mis à
            jour régulièrement par <LinkBtn to={siteUrl} label={siteUrl} /> responsable.
            De la même façon, les mentions légales peuvent être modifiées à tout moment :
            elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le
            plus souvent possible afin d’en prendre connaissance.
          </p>

          <h2 className="mb-2 text-xl font-bold" >3. Description des services fournis.</h2>
          <p>
            Le site internet <LinkBtn to={siteUrl} label={siteUrl} /> a pour objet de
            fournir une information concernant l’ensemble des activités de la société.{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> s’efforce de fournir sur le site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> des informations aussi précises que
            possible. Toutefois, il ne pourra être tenu responsable des oublis, des
            inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait
            ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>
          <p>
            Toutes les informations indiquées sur le site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> sont données à titre indicatif, et
            sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant sur le
            site <LinkBtn to={siteUrl} label={siteUrl} /> ne sont pas exhaustifs. Ils sont
            donnés sous réserve de modifications ayant été apportées depuis leur mise en
            ligne.
          </p>

          <h2 className="mb-2 text-xl font-bold" >4. Limitations contractuelles sur les données techniques.</h2>
          <p>Le site utilise la technologie JavaScript.</p>
          <p>
            Le site Internet ne pourra être tenu responsable de dommages matériels liés à
            l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au
            site en utilisant un matériel récent, ne contenant pas de virus et avec un
            navigateur de dernière génération mis à jour. Le site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> est hébergé chez un prestataire sur
            le territoire de l’Union Européenne conformément aux dispositions du RGPD
            (n° 2016-679).
          </p>
          <p>
            L’objectif est d’apporter une prestation qui assure le meilleur taux
            d’accessibilité. L’hébergeur assure la continuité de son service 24h/24, tous
            les jours de l’année. Il se réserve néanmoins la possibilité d’interrompre le
            service d’hébergement pour les durées les plus courtes possibles notamment à
            des fins de maintenance, d’amélioration de ses infrastructures, de défaillance
            de ses infrastructures ou si les Prestations et Services génèrent un trafic
            réputé anormal.
          </p>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> et l’hébergeur ne pourront être
            tenus responsables en cas de dysfonctionnement du réseau Internet, des lignes
            téléphoniques ou du matériel informatique et de téléphonie lié notamment à
            l’encombrement du réseau empêchant l’accès au serveur.
          </p>

          <h2 className="mb-2 text-xl font-bold" >5. Propriété intellectuelle et contrefaçons.</h2>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> est propriétaire des droits de
            propriété intellectuelle et détient les droits d’usage sur tous les éléments
            accessibles sur le site internet, notamment les textes, images, graphismes,
            logos, vidéos, icônes et sons. Toute reproduction, représentation, modification,
            publication, adaptation de tout ou partie des éléments du site, quel que soit
            le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
            préalable de : <LinkBtn to={siteUrl} label={siteUrl} />.
          </p>
          <p>
            Toute exploitation non autorisée du site ou de l’un quelconque des éléments
            qu’il contient sera considérée comme constitutive d’une contrefaçon et
            poursuivie conformément aux dispositions des articles L.335-2 et suivants du
            Code de Propriété Intellectuelle.
          </p>

          <h2 className="mb-2 text-xl font-bold" >6. Limitations de responsabilité.</h2>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> agit en tant qu’éditeur du site.{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> est responsable de la qualité et de
            la véracité du Contenu qu’il publie.
          </p>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> ne pourra être tenu responsable des
            dommages directs et indirects causés au matériel de l’utilisateur, lors de
            l’accès au site internet <LinkBtn to={siteUrl} label={siteUrl} />, et
            résultant soit de l’utilisation d’un matériel ne répondant pas aux
            spécifications indiquées au point 4, soit de l’apparition d’un bug ou d’une
            incompatibilité.
          </p>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> ne pourra également être tenu
            responsable des dommages indirects (tels par exemple qu’une perte de marché ou
            perte d’une chance) consécutifs à l’utilisation du site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} />. Des espaces interactifs (possibilité
            de poser des questions dans l’espace contact) sont à la disposition des
            utilisateurs. <LinkBtn to={siteUrl} label={siteUrl} /> se réserve le droit de
            supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace
            qui contreviendrait à la législation applicable en France, en particulier aux
            dispositions relatives à la protection des données. Le cas échéant,{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> se réserve également la possibilité de
            mettre en cause la responsabilité civile et/ou pénale de l’utilisateur,
            notamment en cas de message à caractère raciste, injurieux, diffamant, ou
            pornographique, quel que soit le support utilisé (texte, photographie …).
          </p>

          <h2 className="mb-2 text-xl font-bold" >7. Gestion des données personnelles.</h2>
          <p>
            Le Client est informé des réglementations concernant la communication
            marketing, la loi du 21 Juin 2014 pour la confiance dans l’Économie Numérique,
            la Loi Informatique et Liberté du 06 Août 2004 ainsi que du RGPD (n° 2016-679).
          </p>

          <h3>7.1 Responsables de la collecte des données personnelles</h3>
          <p>
            Pour les Données Personnelles collectées dans le cadre de la création du
            compte personnel de l’Utilisateur et de sa navigation sur le Site, le
            responsable du traitement des Données Personnelles est : Hopin'Go.{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> est représenté par Hopin'Go, son
            représentant légal.
          </p>
          <p>
            En tant que responsable du traitement des données qu’il collecte,{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> s’engage à respecter le cadre des
            dispositions légales en vigueur [...]
          </p>

          <h3>7.2 Finalité des données collectées</h3>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> est susceptible de traiter tout ou
            partie des données :
          </p>
          <ul>
            <li>
              pour permettre la navigation sur le Site et la gestion et la traçabilité des
              prestations et services commandés par l’utilisateur : données de connexion et
              d’utilisation du Site, facturation, historique des commandes, etc.
            </li>
            <li>
              pour prévenir et lutter contre la fraude informatique (spamming, hacking…) :
              matériel informatique utilisé pour la navigation, l’adresse IP, le mot de
              passe (hashé)
            </li>
            <li>pour améliorer la navigation sur le Site : données de connexion et d’utilisation</li>
            <li>
              pour mener des enquêtes de satisfaction facultatives sur{" "}
              <LinkBtn to={siteUrl} label={siteUrl} /> : adresse email
            </li>
            <li>pour mener des campagnes de communication (sms, mail) : numéro de téléphone, adresse email</li>
          </ul>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> ne commercialise pas vos données
            personnelles qui sont donc uniquement utilisées par nécessité ou à des fins
            statistiques et d’analyses.
          </p>

          <h3>7.3 Droit d’accès, de rectification et d’opposition</h3>
          <p>
            Conformément à la réglementation européenne en vigueur, les Utilisateurs de{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> disposent des droits suivants :
          </p>
          <ul>
            <li>
              droit d'accès (article 15 RGPD) et de rectification (article 16 RGPD), [...]
            </li>
            <li>droit de retirer à tout moment un consentement (article 13-2c RGPD)</li>
            <li>droit à la limitation du traitement (article 18 RGPD)</li>
            <li>droit d’opposition (article 21 RGPD)</li>
            <li>droit à la portabilité (article 20 RGPD)</li>
            <li>
              droit de définir le sort des données après leur mort et de choisir à qui{" "}
              <LinkBtn to={siteUrl} label={siteUrl} /> devra communiquer (ou non) ses
              données
            </li>
          </ul>
          <p>
            Les Utilisateurs peuvent déposer une réclamation auprès des autorités de
            contrôle, notamment la CNIL (
            <LinkBtn to="https://www.cnil.fr/fr/plaintes" label="CNIL — Plainte" target="_blank" />).
          </p>

          <h3>7.4 Non-communication des données personnelles</h3>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> s’interdit de traiter, héberger ou
            transférer les Informations collectées vers un pays en dehors de l’UE ou
            reconnu comme « non adéquat » par la Commission européenne sans en informer
            préalablement le client. [...]
          </p>

          <h2 className="mb-2 text-xl font-bold" >8. Notification d’incident</h2>
          <p>
            Quels que soient les efforts fournis, aucune méthode de transmission sur
            Internet et aucune méthode de stockage électronique n'est complètement sûre. [...]
          </p>

          <h3>Sécurité</h3>
          <p>
            Pour assurer la sécurité et la confidentialité des Données Personnelles,{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> utilise des dispositifs standards
            (pare-feu, pseudonymisation, chiffrement, mots de passe).
          </p>

          <h2 className="mb-2 text-xl font-bold" >9. Liens hypertextes, cookies et balises (“tags”) internet</h2>
          <p>
            Le site <LinkBtn to={siteUrl} label={siteUrl} /> contient des liens hypertextes
            vers d’autres sites, mis en place avec autorisation. Cependant,{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> n’a pas la possibilité de vérifier le
            contenu de ces sites et n’assume aucune responsabilité de ce fait.
          </p>

          <h3>9.1 Cookies</h3>
          <p>
            Un « cookie » est un petit fichier d’information envoyé sur le navigateur de
            l’Utilisateur et enregistré sur son terminal. [...]
          </p>

          <h3>9.2 Balises (“tags”) internet</h3>
          <p>
            <LinkBtn to={siteUrl} label={siteUrl} /> peut employer occasionnellement des
            balises Internet (pixels invisibles) déployées par un partenaire d’analyses
            Web pouvant se trouver à l’étranger. [...]
          </p>

          <h2 className="mb-2 text-xl font-bold" >10. Droit applicable et attribution de juridiction.</h2>
          <p>
            Tout litige en relation avec l’utilisation du site{" "}
            <LinkBtn to={siteUrl} label={siteUrl} /> est soumis au droit français. En
            dehors des cas où la loi ne le permet pas, attribution exclusive de
            juridiction aux tribunaux compétents de Villeurbanne.
          </p>
        </article>

        <footer className="mt-8 flex flex-wrap gap-2">
          <LinkBtn
            to="https://fr.orson.io/1371/generateur-mentions-legales"
            label="Générateur Orson"
            target="_blank"
          />
          <LinkBtn to="https://www.cnil.fr/fr/plaintes" label="CNIL" target="_blank" />
        </footer>
      </div>
    </section>
  );
};

export default TermsOfService;
