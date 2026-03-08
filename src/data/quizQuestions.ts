export interface QuizOption {
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: QuizOption[];
}

export const SCORE_THRESHOLD = 35; // Score butoir pour qualification

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est votre revenu annuel actuel ?",
    context: "Cette information nous aide à évaluer votre profil financier.",
    options: [
      { label: "Moins de 30 000 $", score: 0 },
      { label: "30 000 $ – 60 000 $", score: 2 },
      { label: "60 000 $ – 100 000 $", score: 4 },
      { label: "Plus de 100 000 $", score: 5 },
    ],
  },
  {
    id: 2,
    question: "Avez-vous de l'expérience en entrepreneuriat ?",
    context: "L'expérience entrepreneuriale est un atout majeur.",
    options: [
      { label: "Aucune expérience", score: 0 },
      { label: "J'ai un projet en cours", score: 3 },
      { label: "J'ai déjà lancé une entreprise", score: 4 },
      { label: "J'ai plusieurs entreprises actives", score: 5 },
    ],
  },
  {
    id: 3,
    question: "Combien êtes-vous prêt à investir dans votre développement ?",
    context: "Votre engagement financier démontre votre sérieux.",
    options: [
      { label: "Moins de 1 000 $", score: 1 },
      { label: "1 000 $ – 5 000 $", score: 3 },
      { label: "5 000 $ – 15 000 $", score: 4 },
      { label: "Plus de 15 000 $", score: 5 },
    ],
  },
  {
    id: 4,
    question: "Quel est votre objectif principal ?",
    context: "Comprendre votre vision nous aide à vous accompagner.",
    options: [
      { label: "Améliorer mon style de vie", score: 2 },
      { label: "Créer une source de revenus supplémentaire", score: 3 },
      { label: "Bâtir un empire entrepreneurial", score: 5 },
      { label: "Atteindre la liberté financière totale", score: 5 },
    ],
  },
  {
    id: 5,
    question: "Combien d'heures par semaine pouvez-vous consacrer à ce projet ?",
    context: "Votre disponibilité influence directement vos résultats.",
    options: [
      { label: "Moins de 5 heures", score: 1 },
      { label: "5 – 15 heures", score: 3 },
      { label: "15 – 30 heures", score: 4 },
      { label: "Plus de 30 heures (temps plein)", score: 5 },
    ],
  },
  {
    id: 6,
    question: "Avez-vous un réseau professionnel établi ?",
    context: "Le réseau est un levier puissant pour la croissance.",
    options: [
      { label: "Pas vraiment", score: 0 },
      { label: "Quelques contacts pertinents", score: 2 },
      { label: "Un bon réseau dans mon domaine", score: 4 },
      { label: "Un réseau étendu et diversifié", score: 5 },
    ],
  },
  {
    id: 7,
    question: "Quel est votre niveau d'éducation ?",
    context: "Votre parcours académique nous intéresse.",
    options: [
      { label: "Secondaire", score: 1 },
      { label: "Collégial / DEP", score: 2 },
      { label: "Universitaire (Baccalauréat)", score: 4 },
      { label: "Universitaire (Maîtrise / Doctorat)", score: 5 },
    ],
  },
  {
    id: 8,
    question: "Comment avez-vous entendu parler de Bizmut ?",
    context: "Cela nous aide à mieux comprendre notre rayonnement.",
    options: [
      { label: "Réseaux sociaux", score: 3 },
      { label: "Recommandation d'un membre", score: 5 },
      { label: "Publicité en ligne", score: 2 },
      { label: "Autre", score: 1 },
    ],
  },
  {
    id: 9,
    question: "Êtes-vous prêt à vous engager sur le long terme ?",
    context: "Le succès demande de la persévérance.",
    options: [
      { label: "Je veux essayer d'abord", score: 1 },
      { label: "Je suis motivé pour 6 mois", score: 3 },
      { label: "Je m'engage pour 1 an minimum", score: 4 },
      { label: "Je suis prêt à m'investir sans limite de temps", score: 5 },
    ],
  },
  {
    id: 10,
    question: "Quelle est votre plus grande force ?",
    context: "Chaque profil apporte une valeur unique.",
    options: [
      { label: "Ma détermination", score: 4 },
      { label: "Mon expertise technique", score: 3 },
      { label: "Mon leadership naturel", score: 5 },
      { label: "Ma créativité", score: 3 },
    ],
  },
];
