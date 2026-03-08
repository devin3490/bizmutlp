import { motion } from "framer-motion";

import lifestyleCar from "@/assets/lifestyle-car.jpg";
import lifestyleResort from "@/assets/lifestyle-resort.jpg";
import lifestyleNetworking from "@/assets/lifestyle-networking.jpg";
import lifestyleJet from "@/assets/lifestyle-jet.jpg";
import lifestyleApartment from "@/assets/lifestyle-apartment.jpg";
import lifestyleMeeting from "@/assets/lifestyle-meeting.jpg";

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
    badge: "Elite Network",
    headline: "Connect With the Top 1%",
    description: "Surround yourself with high-performers, industry leaders, and visionaries. Our exclusive network opens doors that most people never even see.",
    image: lifestyleNetworking,
    imageAlt: "VIP networking event",
  },
  {
    badge: "High Income",
    headline: "Unlock Unlimited Earning Potential",
    description: "Our proven system empowers ambitious individuals to build multiple streams of income and achieve financial freedom on their own terms.",
    image: lifestyleCar,
    imageAlt: "Luxury sports car",
  },
  {
    badge: "Global Travel",
    headline: "Work From Anywhere in the World",
    description: "From tropical resorts to world-class cities — build a career that lets you live life without borders. Your office is wherever you choose.",
    image: lifestyleResort,
    imageAlt: "Tropical resort",
  },
  {
    badge: "Private Access",
    headline: "Experience Life at the Highest Level",
    description: "Private jets, luxury retreats, and VIP access to events around the world. This isn't a dream — it's the Bismuth standard.",
    image: lifestyleJet,
    imageAlt: "Private jet interior",
  },
  {
    badge: "Premium Living",
    headline: "Design Your Dream Lifestyle",
    description: "From penthouse apartments to dream homes — build the life that matches your ambition. You deserve more than ordinary.",
    image: lifestyleApartment,
    imageAlt: "Luxury penthouse apartment",
  },
  {
    badge: "World-Class Training",
    headline: "Develop Into Your Best Self",
    description: "Access elite mentorship, cutting-edge training programs, and a culture that pushes you to grow faster than you ever thought possible.",
    image: lifestyleMeeting,
    imageAlt: "Elite team meeting",
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
        <span className="text-bismuth-teal text-sm uppercase tracking-widest font-semibold">Why Bismuth</span>
        <h2 className="text-4xl md:text-5xl font-black text-gold mt-4">
          The Bismuth Advantage
        </h2>
      </motion.div>

      {lifestyleData.map((item, i) => (
        <LifestyleItem key={i} {...item} reversed={i % 2 !== 0} index={i} />
      ))}
    </div>
  </section>
);
