import { motion } from "framer-motion";

import lifestyleGoogleReviews from "@/assets/lifestyle-google-reviews.png";
import lifestyleGames from "@/assets/lifestyle-games.png";
import lifestyleTrip from "@/assets/lifestyle-trip.png";
import teamDinner from "@/assets/lifestyle-team-dinner.jpeg";
import teamCoffee from "@/assets/lifestyle-team-coffee.jpeg";
import teamMeeting from "@/assets/lifestyle-team-meeting.png";

interface LifestyleItemProps {
  badge: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
  index: number;
  link?: { url: string; label: string };
}

const LifestyleItem = ({ badge, headline, description, image, imageAlt, reversed, index, link, collageImages }: LifestyleItemProps & { collageImages?: { src: string; alt: string }[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 80, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
    className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:direction-rtl" : ""}`}
  >
    <motion.div
      className={`${reversed ? "lg:order-2" : ""}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {collageImages ? (
        <div className="grid grid-cols-2 gap-3 h-full">
          <div className="glass rounded-lg overflow-hidden row-span-2">
            <img src={collageImages[2].src} alt={collageImages[2].alt} className="w-full h-full object-cover object-center" style={{ objectPosition: "center 30%" }} loading="lazy" />
          </div>
          <div className="glass rounded-lg overflow-hidden">
            <img src={collageImages[0].src} alt={collageImages[0].alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="glass rounded-lg overflow-hidden">
            <img src={collageImages[1].src} alt={collageImages[1].alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="glass rounded-lg overflow-hidden group relative">
          <motion.img
            src={image}
            alt={imageAlt}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
    </motion.div>

    <div className={`${reversed ? "lg:order-1" : ""} space-y-5`}>
      <motion.span
        initial={{ opacity: 0, x: reversed ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        className="inline-block bg-bismuth-teal/20 text-bismuth-teal px-4 py-1.5 text-sm font-semibold uppercase tracking-wider"
      >
        {badge}
      </motion.span>
      <motion.h3
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-gold leading-tight"
      >
        {headline}
      </motion.h3>
      {description.split('\n\n').map((paragraph, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1 + idx * 0.1, duration: 0.6 }}
          className="text-foreground/80 text-lg leading-relaxed"
        >
          {paragraph}
        </motion.p>
      ))}
      {link && (
        <motion.a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-bismuth-gold hover:text-bismuth-teal transition-colors font-semibold text-lg underline underline-offset-4"
          whileHover={{ x: 8 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {link.label} →
        </motion.a>
      )}
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
    badge: "La référence au Québec",
    headline: "Le contrat marketing de Services O'Splash",
    description: "Bizmut détient le contrat de marketing (porte-à-porte) de Services O'Splash inc., une des plus grosses compagnies de lavage extérieur à Québec et en Estrie.\n\nConcrètement, ça veut dire que sur le terrain, tu représentes directement une entreprise établie, reconnue et déjà performante.\n\nAvec plus de 3 000 clients servis l'année dernière et une note de 4.8/5 sur Google, O'Splash s'est bâtie une solide réputation basée sur la qualité de son service et la satisfaction de ses clients.",
    image: lifestyleGoogleReviews,
    imageAlt: "4.8 sur 5 étoiles sur Google Reviews",
    link: {
      url: "https://share.google/He800ykh8pAH6yeGC",
      label: "Voir les avis Google",
    },
  },
  {
    badge: "Voyage emblématique",
    headline: "Un voyage de fin d'été légendaire",
    description: "Cet été, Bizmut emmène ses meilleurs vendeurs en République Dominicaine. Un voyage all-inclusive réservé exclusivement à ceux qui performent. Tu veux y être? Prouve que t'es le ou la meilleur(e).",
    image: lifestyleTrip,
    imageAlt: "Voyage Bizmut été 2026 en République Dominicaine",
  },
  {
    badge: "Bizmut Games",
    headline: "Work hard. Play harder.",
    description: "Les Bizmut Games, ce sont des défis et des compétitions qui se déroulent tout au long de l'été, où toute l'équipe s'affronte dans un esprit de performance et de fun.\n\nLe but : se dépasser, créer une énergie de groupe forte et gagner des prix.\n\nQue ce soit sur le terrain ou en dehors, chaque défi est une occasion de se challenger, de connecter avec l'équipe et de rendre l'été encore plus intense.",
    image: lifestyleGames,
    imageAlt: "Bizmut Games — prix à gagner tout l'été",
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
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.15em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-bismuth-teal text-sm uppercase font-semibold block"
        >
          Pourquoi Bizmut
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl md:text-5xl font-black text-gold mt-4"
        >
          L'avantage Bizmut
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-1 w-24 mx-auto mt-4 rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))" }}
        />
      </motion.div>

      {lifestyleData.map((item, i) => (
        <LifestyleItem key={i} {...item} reversed={i % 2 !== 0} index={i} />
      ))}
    </div>
  </section>
);
