import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, SCORE_THRESHOLD, type QuizQuestion } from "@/data/quizQuestions";
import { ManagerPanel } from "./ManagerPanel";
import { CheckCircle, ArrowRight, RotateCcw, Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SESSION_KEY = "bizmut_quiz_session";

interface AnswerData {
  label: string;
  score: number;
}

interface QuizSession {
  answers: Record<number, AnswerData>;
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
  const [textValue, setTextValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { answers, currentQuestion, totalScore, completed } = session;

  const totalQuestions = quizQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const question = quizQuestions[currentQuestion];
  const totalAnswered = Object.keys(answers).length;

  // Step tracking
  const currentStep = question?.step ?? 2;
  const step1Questions = quizQuestions.filter((q) => q.step === 1);
  const step2Questions = quizQuestions.filter((q) => q.step === 2);
  const isNewStep2 =
    currentStep === 2 &&
    currentQuestion > 0 &&
    quizQuestions[currentQuestion - 1]?.step === 1;

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    setTextValue("");
    setOtherValue("");
    setShowOther(false);
  }, [currentQuestion]);

  // Submit to Google Sheets when quiz is completed
  const submitToSheets = useCallback(async (finalAnswers: Record<number, AnswerData>, finalScore: number) => {
    if (submitted || submitting) return;
    setSubmitting(true);
    try {
      const qualified = finalScore >= SCORE_THRESHOLD;
      const { data, error } = await supabase.functions.invoke("submit-to-sheets", {
        body: { answers: finalAnswers, totalScore: finalScore, qualified },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Candidature envoyée avec succès !");
    } catch (err) {
      console.error("Sheet submission error:", err);
      toast.error("Erreur lors de l'envoi. Tes réponses sont sauvegardées localement.");
    } finally {
      setSubmitting(false);
    }
  }, [submitted, submitting]);

  const advance = useCallback(
    (label: string, score: number) => {
      if (!question) return;
      const newAnswers = { ...answers, [question.id]: { label, score } };
      const newScore = totalScore + score;
      const isLast = currentQuestion >= totalQuestions - 1;

      const updated: QuizSession = {
        answers: newAnswers,
        currentQuestion: isLast ? currentQuestion : currentQuestion + 1,
        totalScore: newScore,
        completed: isLast,
        timestamps: { ...session.timestamps, [question.id]: new Date().toISOString() },
      };

      setTimeout(() => {
        setSession(updated);
        if (isLast) {
          submitToSheets(newAnswers, newScore);
        }
      }, 250);
    },
    [question, answers, totalScore, currentQuestion, totalQuestions, session.timestamps, submitToSheets]
  );

  const handleChoiceAnswer = useCallback(
    (label: string, score: number) => advance(label, score),
    [advance]
  );

  const handleTextSubmit = useCallback(() => {
    const val = textValue.trim();
    if (!val) return;
    advance(val, 0);
  }, [textValue, advance]);

  const handleOtherSubmit = useCallback(() => {
    const val = otherValue.trim();
    if (!val) return;
    advance(`Autre : ${val}`, 3);
  }, [otherValue, advance]);

  const handleReset = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession({ answers: {}, currentQuestion: 0, totalScore: 0, completed: false, timestamps: {} });
    setShowPanel(false);
    setTextValue("");
    setOtherValue("");
    setShowOther(false);
  };

  const qualified = totalScore >= SCORE_THRESHOLD;

  const renderQuestion = (q: QuizQuestion) => {
    switch (q.type) {
      case "text":
        return (
          <div className="space-y-4">
            <Input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={(q as any).placeholder || "Ta réponse..."}
              className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              autoFocus
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className="w-full sm:w-auto"
              style={{
                background: textValue.trim()
                  ? `linear-gradient(135deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`
                  : undefined,
              }}
            >
              Continuer <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-4">
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={(q as any).placeholder || "Ta réponse..."}
              className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground min-h-[120px] text-base resize-none"
              autoFocus
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className="w-full sm:w-auto"
              style={{
                background: textValue.trim()
                  ? `linear-gradient(135deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`
                  : undefined,
              }}
            >
              Continuer <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        );

      case "choice":
        return (
          <div className="space-y-2.5 md:space-y-3">
            {q.options.map((option, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.25 }}
                whileHover={{
                  scale: 1.01,
                  borderColor: "hsl(174, 60%, 45%)",
                  boxShadow: "0 0 20px hsla(174, 60%, 45%, 0.12)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoiceAnswer(option.label, option.score)}
                className="w-full text-left p-3.5 md:p-4 rounded-lg border border-border bg-secondary/30 active:bg-secondary/60 md:hover:bg-secondary/60 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm md:text-base text-foreground leading-snug">
                    {option.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden md:block" />
                </div>
              </motion.button>
            ))}
            {q.allowOther && (
              <>
                {!showOther ? (
                  <motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: q.options.length * 0.06, duration: 0.25 }}
                    onClick={() => setShowOther(true)}
                    className="w-full text-left p-3.5 md:p-4 rounded-lg border border-dashed border-border bg-secondary/20 active:bg-secondary/40 md:hover:bg-secondary/40 transition-colors duration-200"
                  >
                    <span className="text-sm md:text-base text-muted-foreground">Autre : explique...</span>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-1"
                  >
                    <Textarea
                      value={otherValue}
                      onChange={(e) => setOtherValue(e.target.value)}
                      placeholder="Explique ce qui te fait performer au maximum..."
                      className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground min-h-[80px] text-sm resize-none"
                      autoFocus
                    />
                    <Button
                      onClick={handleOtherSubmit}
                      disabled={!otherValue.trim()}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" /> Envoyer
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        );
    }
  };

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
          {/* Mobile: Mini score bar */}
          {totalAnswered > 0 && !completed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden glass rounded-lg p-4 order-first"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {totalAnswered}/{totalQuestions} répondu{totalAnswered > 1 ? "es" : "e"}
                </span>
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="flex items-center gap-1 text-xs text-bismuth-teal"
                >
                  {showPanel ? "Masquer" : "Détails"}
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
                      <ManagerPanel answers={answers} totalScore={totalScore} currentQuestion={currentQuestion} compact />
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
                    {!completed
                      ? `Étape ${currentStep} — Question ${Math.min(totalAnswered + 1, totalQuestions)} sur ${totalQuestions}`
                      : "Terminé !"}
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

                {/* Step labels */}
                <div className="flex gap-2 mt-3">
                  <span
                    className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border ${
                      currentStep === 1
                        ? "border-bismuth-teal/50 text-bismuth-teal bg-bismuth-teal/10"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    1. Infos personnelles
                  </span>
                  <span
                    className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border ${
                      currentStep === 2
                        ? "border-bismuth-teal/50 text-bismuth-teal bg-bismuth-teal/10"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    2. Mentalité & Potentiel
                  </span>
                </div>
              </div>

              {/* Question area */}
              <div className="min-h-[320px] md:min-h-[400px] flex items-start justify-center pt-4">
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
                      {/* Step 2 intro banner */}
                      {isNewStep2 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-4 rounded-lg border border-bismuth-teal/20 bg-bismuth-teal/5"
                        >
                          <p className="text-sm font-medium text-bismuth-teal mb-1">Étape 2 — Mentalité et Potentiel</p>
                          <p className="text-xs text-muted-foreground">
                            Nous voulons comprendre comment tu penses, comment tu réagis sous pression et dans quel type d'environnement tu performes le mieux.
                          </p>
                        </motion.div>
                      )}

                      {question.context && !isNewStep2 && (
                        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-bismuth-teal shrink-0 mt-0.5" />
                          <span>{question.context}</span>
                        </p>
                      )}

                      <h3 className="text-lg md:text-2xl font-semibold text-foreground mb-5 md:mb-8">
                        {question.question}
                        {question.required && <span className="text-bismuth-pink ml-1">*</span>}
                      </h3>

                      {renderQuestion(question)}
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
                        {qualified ? "Félicitations ! 🎉" : "Merci pour ta candidature"}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-2 max-w-md mx-auto px-2">
                        {qualified
                          ? "Ton profil correspond à nos critères d'excellence. Tu es pré-qualifié(e) pour rejoindre Bizmut."
                          : "Nous avons bien reçu tes réponses. Notre équipe analysera ton profil et te contactera si une opportunité se présente."}
                      </p>
                      <p className="text-base md:text-lg font-semibold text-foreground mb-5 md:mb-6">
                        Score final : <span className="text-bismuth-teal">{totalScore}</span> / {quizQuestions.filter((q) => q.type === "choice").length * 5}
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
            <ManagerPanel answers={answers} totalScore={totalScore} currentQuestion={currentQuestion} />
          </div>

          {/* Mobile: Full panel after completion */}
          {completed && (
            <div className="lg:hidden order-4">
              <ManagerPanel answers={answers} totalScore={totalScore} currentQuestion={currentQuestion} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
