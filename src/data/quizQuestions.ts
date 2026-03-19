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

export type QuizQuestion = QuizQuestionText | QuizQuestionTextarea | QuizQuestionChoice;

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
    question: "As-tu déjà de l'expérience en porte-à-porte ou dans la vente ?",
    required: true,
    options: [
      { label: "Oui", score: 5 },
      { label: "Non mais je suis motivé(e)", score: 3 },
    ],
  },
];
