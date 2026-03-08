import { motion } from "framer-motion";

import lifestyleCar from "@/assets/lifestyle-car.jpg";
import lifestyleResort from "@/assets/lifestyle-resort.jpg";
import lifestyleNetworking from "@/assets/lifestyle-networking.jpg";
import lifestyleJet from "@/assets/lifestyle-jet.jpg";
import lifestyleApartment from "@/assets/lifestyle-apartment.jpg";
import lifestyleMeeting from "@/assets/lifestyle-meeting.jpg";
import lifestyleGames from "@/assets/lifestyle-games.png";
import lifestyleHousing from "@/assets/lifestyle-housing.png";
import lifestyleTrip from "@/assets/lifestyle-trip.png";
import lifestyleGoogleReviews from "@/assets/lifestyle-google-reviews.png";

interface LifestyleItemProps {
  badge: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
  index: number;
}

const LifestyleItem = ({ badge, headline, description, image, imageAlt, reversed, index }: LifestyleItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay: index * 0.1 }}
    className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:direction-rtl" : ""}`}
  >
    <div className={`${reversed ? "lg:order-2" : ""}`}>
      <div className="glass rounded-lg overflow-hidden">
        <img src={image} alt={imageAlt} className="w-full aspect-[4/3] object-cover" loading="lazy" />
      </div>
    </div>

    <div className={`${reversed ? "lg:order-1" : ""} space-y-5`}>
      <span className="inline-block bg-bismuth-teal/20 text-bismuth-teal px-4 py-1.5 text-sm font-semibold uppercase tracking-wider">
        {badge}
      </span>
      <h3 className="text-3xl md:text-4xl font-bold text-gold leading-tight">{headline}</h3>
      <p className="text-foreground/80 text-lg leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const lifestyleData = [
  {
    badge: "Logement payé",
    headline: "On paye ton habitation à Québec ou Sherbrooke",
    description: "Concentre-toi sur ta performance sans te soucier du loyer. Bizmut prend en charge ton logement dans nos villes d'opération : Québec et Sherbrooke. Un avantage concret pour te permettre de performer à 100%.",
    image: lifestyleHousing,
    imageAlt: "Logement moderne payé par Bizmut",
  },
  {
    badge: "Réseau d'élite",
    headline: "Connecte-toi avec le Top 1%",
    description: "Entoure-toi de performeurs, leaders d'industrie et visionnaires. Notre réseau exclusif ouvre des portes que la plupart des gens ne voient même jamais.",
    image: lifestyleNetworking,
    imageAlt: "Événement de networking VIP",
  },
  {
    badge: "Revenus élevés",
    headline: "Débloquer un potentiel de gains illimité",
    description: "Notre système éprouvé permet aux individus ambitieux de bâtir plusieurs sources de revenus et d'atteindre la liberté financière à leurs propres conditions.",
    image: lifestyleCar,
    imageAlt: "Voiture de sport de luxe",
  },
  {
    badge: "Voyages internationaux",
    headline: "Travaille de n'importe où dans le monde",
    description: "Des stations balnéaires tropicales aux grandes métropoles — construis une carrière qui te permet de vivre sans frontières. Ton bureau est là où tu le choisis.",
    image: lifestyleResort,
    imageAlt: "Station balnéaire tropicale",
  },
  {
    badge: "Voyage emblématique",
    headline: "Un voyage de fin d'été légendaire",
    description: "Chaque été, Bizmut organise son emblématique voyage de fin de saison pour récompenser les performeurs. L'année passée, c'était en République Dominicaine. Cette année? Une destination luxueuse… et mystère. Reste à l'affût.",
    image: lifestyleTrip,
    imageAlt: "Voyage Bizmut été 2025 en République Dominicaine",
  },
  {
    badge: "Bizmut Games",
    headline: "Work hard. Play harder.",
    description: "Bienvenue aux Bizmut Games. Chez Bizmut, on prend la cohésion au sérieux. Les Bizmut Games sont une série de défis et de compétitions amicales qui rassemblent l'équipe autour du jeu, du dépassement et de la collaboration.",
    image: lifestyleGames,
    imageAlt: "Bizmut Games — prix à gagner tout l'été",
  },
  {
    badge: "Accès privilégié",
    headline: "Vis la vie au plus haut niveau",
    description: "Jets privés, retraites de luxe et accès VIP à des événements partout dans le monde. Ce n'est pas un rêve — c'est le standard Bizmut.",
    image: lifestyleJet,
    imageAlt: "Intérieur de jet privé",
  },
  {
    badge: "Mode de vie premium",
    headline: "Crée le style de vie de tes rêves",
    description: "Des penthouses aux maisons de rêve — construis la vie qui correspond à ton ambition. Tu mérites plus que l'ordinaire.",
    image: lifestyleApartment,
    imageAlt: "Appartement penthouse de luxe",
  },
  {
    badge: "Formation d'élite",
    headline: "Deviens la meilleure version de toi-même",
    description: "Accède à un mentorat d'élite, des programmes de formation de pointe et une culture qui te pousse à grandir plus vite que tu ne l'aurais jamais cru possible.",
    image: lifestyleMeeting,
    imageAlt: "Réunion d'équipe élite",
  },
];

export const LifestyleSection = () => (
  <section id="lifestyle" className="py-24 relative">
    <div className="container mx-auto px-6 space-y-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-bismuth-teal text-sm uppercase tracking-widest font-semibold">Pourquoi Bizmut</span>
        <h2 className="text-4xl md:text-5xl font-black text-gold mt-4">
          L'avantage Bizmut
        </h2>
      </motion.div>

      {lifestyleData.map((item, i) => (
        <LifestyleItem key={i} {...item} reversed={i % 2 !== 0} index={i} />
      ))}
    </div>
  </section>
);
