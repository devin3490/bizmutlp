export interface QuizOptionChoice {
  label: string;
  score: number;
}

export interface QuizQuestionBase {
  id: number;
  question: string;
  context?: string;
  required?: boolean;
  step: 1 | 2;
}

export interface QuizQuestionText extends QuizQuestionBase {
  type: "text";
  placeholder?: string;
}

export interface QuizQuestionTextarea extends QuizQuestionBase {
  type: "textarea";
  placeholder?: string;
}

export interface QuizQuestionChoice extends QuizQuestionBase {
  type: "choice";
  options: QuizOptionChoice[];
  allowOther?: boolean;
}

export type QuizQuestion = QuizQuestionText | QuizQuestionTextarea | QuizQuestionChoice;

export const SCORE_THRESHOLD = 28;

export const quizQuestions: QuizQuestion[] = [
  // ── Étape 1 : Informations personnelles ──
  {
    id: 1,
    step: 1,
    type: "text",
    question: "Prénom",
    placeholder: "Ton prénom",
    required: true,
  },
  {
    id: 2,
    step: 1,
    type: "text",
    question: "Nom",
    placeholder: "Ton nom de famille",
    required: true,
  },
  {
    id: 3,
    step: 1,
    type: "text",
    question: "Âge",
    placeholder: "Ex: 25",
    required: true,
  },
  {
    id: 4,
    step: 1,
    type: "text",
    question: "Numéro de téléphone",
    placeholder: "Ex: 514-555-1234",
    required: true,
  },
  {
    id: 5,
    step: 1,
    type: "text",
    question: "Adresse courriel",
    placeholder: "ton@courriel.com",
    required: true,
  },
  {
    id: 6,
    step: 1,
    type: "text",
    question: "Ville de résidence",
    placeholder: "Ex: Montréal",
    required: true,
  },
  {
    id: 7,
    step: 1,
    type: "choice",
    question: "As-tu déjà de l'expérience en porte-à-porte ou dans la vente ?",
    required: true,
    options: [
      { label: "Oui", score: 5 },
      { label: "Non mais je suis motivé(e)", score: 3 },
    ],
  },

  // ── Étape 2 : Mentalité et Potentiel ──
  {
    id: 8,
    step: 2,
    type: "choice",
    question: "Dans quel environnement as-tu tendance à donner le meilleur de toi-même ?",
    context: "Nous voulons comprendre comment tu penses, comment tu réagis sous pression et dans quel type d'environnement tu performes le mieux.",
    required: true,
    allowOther: true,
    options: [
      { label: "Un environnement très structuré, avec des attentes claires et un cadre stable", score: 2 },
      { label: "Un environnement où il faut rapidement apprendre, s'adapter et trouver ses repères", score: 3 },
      { label: "Un environnement compétitif, où les résultats parlent d'eux-mêmes", score: 5 },
    ],
  },
  {
    id: 9,
    step: 2,
    type: "textarea",
    question: "Quand tu regardes les 2 à 3 prochaines années de ta vie, qu'est-ce qui serait inacceptable pour toi si rien ne changeait ?",
    placeholder: "Explique en quelques lignes...",
    required: true,
  },
  {
    id: 10,
    step: 2,
    type: "choice",
    question: "Quel type de journée te donne le plus le sentiment d'avoir avancé pour vrai ?",
    required: true,
    allowOther: true,
    options: [
      { label: "Une journée bien organisée où tout s'est déroulé comme prévu", score: 2 },
      { label: "Une journée exigeante où j'ai dû m'ajuster constamment", score: 3 },
      { label: "Une journée où j'ai été challengé et poussé à livrer malgré la pression", score: 5 },
      { label: "Une journée où j'ai appris quelque chose d'utile sur moi-même ou sur mes limites", score: 4 },
    ],
  },
  {
    id: 11,
    step: 2,
    type: "textarea",
    question: "Raconte une situation récente où tu as mis de l'énergie dans quelque chose sans obtenir le résultat que tu voulais. Qu'est-ce que cette situation t'a appris sur toi ?",
    placeholder: "Partage ton expérience...",
    required: true,
  },
  {
    id: 12,
    step: 2,
    type: "choice",
    question: "Parmi les affirmations suivantes, laquelle ressemble le plus à ta façon d'aborder un objectif important ?",
    required: true,
    allowOther: true,
    options: [
      { label: "J'ai besoin de sentir que c'est réaliste avant de m'investir à fond", score: 1 },
      { label: "Je m'investis quand je comprends clairement ce qu'on attend de moi", score: 2 },
      { label: "Je peux m'investir fortement si je vois qu'il y a une vraie opportunité au bout", score: 4 },
      { label: "Quand quelque chose m'allume, j'ai tendance à y aller à fond, même si tout n'est pas garanti au départ", score: 5 },
    ],
  },
  {
    id: 13,
    step: 2,
    type: "textarea",
    question: "Qu'est-ce qui te donne personnellement le sentiment de mériter ta place dans une équipe forte ?",
    placeholder: "Dis-nous ce qui te distingue...",
    required: true,
  },
  {
    id: 14,
    step: 2,
    type: "choice",
    question: "Quel modèle de travail te semble le plus stimulant à long terme ?",
    required: true,
    allowOther: true,
    options: [
      { label: "Un modèle où la stabilité est prioritaire, même si la progression est plus lente", score: 1 },
      { label: "Un modèle où il y a un bon équilibre entre prévisibilité et possibilité d'avancer", score: 2 },
      { label: "Un modèle où les attentes sont élevées, mais où l'impact et les résultats peuvent vraiment changer la donne", score: 4 },
      { label: "Un modèle où la récompense suit directement le niveau d'effort, de progression et de performance", score: 5 },
    ],
  },
  {
    id: 15,
    step: 2,
    type: "textarea",
    question: "Dans les moments où tu as le plus grandi dans ta vie, qu'est-ce qui était généralement vrai de toi à ce moment-là ?",
    placeholder: "Réfléchis et partage...",
    required: true,
  },
  {
    id: 16,
    step: 2,
    type: "textarea",
    question: "Si on parlait avec les personnes qui t'ont vu de près quand ça comptait vraiment, qu'est-ce qu'elles diraient de ta façon de te comporter sous pression ?",
    placeholder: "Que diraient-elles de toi ?",
    required: true,
  },
];
