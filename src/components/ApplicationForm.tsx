import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, SCORE_THRESHOLD, type QuizOption } from "@/data/quizQuestions";
import { ManagerPanel } from "./ManagerPanel";
import { CheckCircle, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SESSION_KEY = "bizmut_quiz_session";

interface QuizSession {
  answers: Record<number, { label: string; score: number }>;
  currentQuestion: number;
  totalScore: number;
  completed: boolean;
  timestamps: Record<number, string>;
}

const loadSession = (): QuizSession => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { answers: {}, currentQuestion: 0, totalScore: 0, completed: false, timestamps: {} };
};

const saveSession = (session: QuizSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const ApplicationForm = () => {
  const [session, setSession] = useState<QuizSession>(loadSession);
  const { answers, currentQuestion, totalScore, completed } = session;

  const totalQuestions = quizQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const question = quizQuestions[currentQuestion];

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleAnswer = useCallback(
    (option: QuizOption) => {
      if (!question) return;

      const newAnswers = { ...answers, [question.id]: { label: option.label, score: option.score } };
      const newScore = totalScore + option.score;
      const isLast = currentQuestion >= totalQuestions - 1;

      const updated: QuizSession = {
        answers: newAnswers,
        currentQuestion: isLast ? currentQuestion : currentQuestion + 1,
        totalScore: newScore,
        completed: isLast,
        timestamps: { ...session.timestamps, [question.id]: new Date().toISOString() },
      };

      // Small delay for visual feedback before transitioning
      setTimeout(() => setSession(updated), 300);
    },
    [question, answers, totalScore, currentQuestion, totalQuestions, session.timestamps]
  );

  const handleReset = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession({ answers: {}, currentQuestion: 0, totalScore: 0, completed: false, timestamps: {} });
  };

  const qualified = totalScore >= SCORE_THRESHOLD;

  return (
    <section id="application" className="py-16 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Évaluation de votre <span className="text-bismuth-teal">profil</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Répondez aux questions suivantes pour découvrir si votre profil correspond à nos critères d'excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left column — Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-lg p-8"
            >
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {Math.min(Object.keys(answers).length + 1, totalQuestions)} sur {totalQuestions}
                  </span>
                  <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`,
                    }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Question area */}
              <div className="min-h-[380px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!completed && question ? (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full"
                    >
                      {question.context && (
                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-bismuth-teal shrink-0" />
                          {question.context}
                        </p>
                      )}
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-8">
                        {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.3 }}
                            whileHover={{
                              scale: 1.02,
                              borderColor: "hsl(174, 60%, 45%)",
                              boxShadow: "0 0 20px hsla(174, 60%, 45%, 0.15)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(option)}
                            className="w-full text-left p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-foreground group-hover:text-foreground/90">
                                {option.label}
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : completed ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center w-full py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6"
                      >
                        <CheckCircle
                          className={`w-16 h-16 mx-auto ${
                            qualified ? "text-emerald-400" : "text-amber-400"
                          }`}
                        />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {qualified ? "Félicitations ! 🎉" : "Merci pour votre candidature"}
                      </h3>
                      <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                        {qualified
                          ? "Votre profil correspond à nos critères d'excellence. Vous êtes pré-qualifié pour rejoindre Bizmut."
                          : "Nous avons bien reçu vos réponses. Notre équipe analysera votre profil et vous contactera si une opportunité se présente."}
                      </p>
                      <p className="text-lg font-semibold text-foreground mb-6">
                        Score final : <span className="text-bismuth-teal">{totalScore}</span> / {totalQuestions * 5}
                      </p>

                      {qualified && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="inline-block px-6 py-3 rounded-lg font-semibold"
                          style={{
                            background: `linear-gradient(135deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`,
                          }}
                        >
                          <span className="text-foreground">Profil Qualifié ✨</span>
                        </motion.div>
                      )}

                      <div className="mt-8">
                        <Button
                          variant="ghost"
                          onClick={handleReset}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Recommencer
                        </Button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right column — Manager Panel */}
          <div className="lg:col-span-1">
            <ManagerPanel
              answers={answers}
              totalScore={totalScore}
              currentQuestion={currentQuestion}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
