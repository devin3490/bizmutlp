import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, SCORE_THRESHOLD, type QuizOption } from "@/data/quizQuestions";
import { ManagerPanel } from "./ManagerPanel";
import { CheckCircle, ArrowRight, RotateCcw, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showPanel, setShowPanel] = useState(false);
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

      setTimeout(() => setSession(updated), 300);
    },
    [question, answers, totalScore, currentQuestion, totalQuestions, session.timestamps]
  );

  const handleReset = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession({ answers: {}, currentQuestion: 0, totalScore: 0, completed: false, timestamps: {} });
    setShowPanel(false);
  };

  const qualified = totalScore >= SCORE_THRESHOLD;
  const totalAnswered = Object.keys(answers).length;

  return (
    <section id="application" className="py-10 md:py-16 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Évaluation de votre <span className="text-bismuth-teal">profil</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2">
            Répondez aux questions suivantes pour découvrir si votre profil correspond à nos critères d'excellence.
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Mobile: Mini score bar visible during quiz */}
          {totalAnswered > 0 && !completed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden glass rounded-lg p-4 order-first"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Score : {totalScore}</span>
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="flex items-center gap-1 text-xs text-bismuth-teal"
                >
                  Détails {showPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`,
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <AnimatePresence>
                {showPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <ManagerPanel
                        answers={answers}
                        totalScore={totalScore}
                        currentQuestion={currentQuestion}
                        compact
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Form column */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-lg p-5 md:p-8"
            >
              {/* Progress bar */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Question {Math.min(totalAnswered + 1, totalQuestions)} sur {totalQuestions}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 md:h-2.5 rounded-full bg-muted overflow-hidden">
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
              <div className="min-h-[300px] md:min-h-[380px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!completed && question ? (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="w-full"
                    >
                      {question.context && (
                        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-bismuth-teal shrink-0" />
                          {question.context}
                        </p>
                      )}
                      <h3 className="text-lg md:text-2xl font-semibold text-foreground mb-5 md:mb-8">
                        {question.question}
                      </h3>
                      <div className="space-y-2.5 md:space-y-3">
                        {question.options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06, duration: 0.25 }}
                            whileHover={{
                              scale: 1.02,
                              borderColor: "hsl(174, 60%, 45%)",
                              boxShadow: "0 0 20px hsla(174, 60%, 45%, 0.15)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAnswer(option)}
                            className="w-full text-left p-3.5 md:p-4 rounded-lg border border-border bg-secondary/30 active:bg-secondary/60 md:hover:bg-secondary/60 transition-colors duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm md:text-base text-foreground">
                                {option.label}
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
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
                      className="text-center w-full py-6 md:py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-5 md:mb-6"
                      >
                        <CheckCircle
                          className={`w-12 h-12 md:w-16 md:h-16 mx-auto ${
                            qualified ? "text-emerald-400" : "text-amber-400"
                          }`}
                        />
                      </motion.div>

                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                        {qualified ? "Félicitations ! 🎉" : "Merci pour votre candidature"}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-2 max-w-md mx-auto px-2">
                        {qualified
                          ? "Votre profil correspond à nos critères d'excellence. Vous êtes pré-qualifié pour rejoindre Bizmut."
                          : "Nous avons bien reçu vos réponses. Notre équipe analysera votre profil et vous contactera si une opportunité se présente."}
                      </p>
                      <p className="text-base md:text-lg font-semibold text-foreground mb-5 md:mb-6">
                        Score final : <span className="text-bismuth-teal">{totalScore}</span> / {totalQuestions * 5}
                      </p>

                      {qualified && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="inline-block px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base"
                          style={{
                            background: `linear-gradient(135deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`,
                          }}
                        >
                          <span className="text-foreground">Profil Qualifié ✨</span>
                        </motion.div>
                      )}

                      <div className="mt-6 md:mt-8">
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

          {/* Desktop: Manager Panel */}
          <div className="hidden lg:block lg:col-span-1 order-3">
            <ManagerPanel
              answers={answers}
              totalScore={totalScore}
              currentQuestion={currentQuestion}
            />
          </div>

          {/* Mobile: Full panel after completion */}
          {completed && (
            <div className="lg:hidden order-4">
              <ManagerPanel
                answers={answers}
                totalScore={totalScore}
                currentQuestion={currentQuestion}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
