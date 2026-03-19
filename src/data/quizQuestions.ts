export interface QuizOptionChoice {
  label: string;
  score: number;
}

export interface QuizQuestionBase {
  id: number;
  question: string;
  context?: string;
  required?: boolean;
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

export interface QuizQuestionScale extends QuizQuestionBase {
  type: "scale";
  min: number;
  max: number;
}

export type QuizQuestion = QuizQuestionText | QuizQuestionTextarea | QuizQuestionChoice | QuizQuestionScale;

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "text",
    question: "Prénom",
    placeholder: "Ton prénom",
    required: true,
  },
  {
    id: 2,
    type: "text",
    question: "Nom",
    placeholder: "Ton nom de famille",
    required: true,
  },
  {
    id: 3,
    type: "text",
    question: "Âge",
    placeholder: "Ex: 25",
    required: true,
  },
  {
    id: 4,
    type: "text",
    question: "Numéro de téléphone",
    placeholder: "Ex: 514-555-1234",
    required: true,
  },
  {
    id: 5,
    type: "text",
    question: "Adresse courriel",
    placeholder: "ton@courriel.com",
    required: true,
  },
  {
    id: 6,
    type: "text",
    question: "Ville de résidence",
    placeholder: "Ex: Montréal",
    required: true,
  },
  {
    id: 7,
    type: "choice",
    question: "As-tu déjà fait du porte-à-porte ?",
    required: true,
    options: [
      { label: "Oui", score: 0 },
      { label: "Non", score: 0 },
    ],
  },
  {
    id: 71,
    type: "text",
    question: "Dans quelle industrie et quel montant as-tu généré en ventes ?",
    placeholder: "Ex: Télécommunications, 50 000$",
    required: true,
  },
  {
    id: 8,
    type: "scale",
    question: "Sur une échelle de 1 à 10, à quel point es-tu à l'aise de travailler 6 jours sur 7 ?",
    required: true,
    min: 0,
    max: 10,
  },
  {
    id: 9,
    type: "scale",
    question: "Sur une échelle de 1 à 10, à quel point es-tu à l'aise à l'idée de te déplacer dans une autre ville si le logement est fourni gratuitement ?",
    required: true,
    min: 0,
    max: 10,
  },
];
