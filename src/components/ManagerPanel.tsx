import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, SCORE_THRESHOLD } from "@/data/quizQuestions";
import { CheckCircle, AlertCircle, TrendingUp, Target, Award } from "lucide-react";

interface ManagerPanelProps {
  answers: Record<number, { label: string; score: number }>;
  totalScore: number;
  currentQuestion: number;
}

const getStatus = (score: number, totalAnswered: number, totalQuestions: number) => {
  const maxPossible = totalQuestions * 5;
  const percentage = (score / maxPossible) * 100;
  const progress = totalAnswered / totalQuestions;

  if (totalAnswered === 0) return { label: "En attente", color: "text-muted-foreground", bg: "bg-muted" };
  
  if (totalAnswered === totalQuestions) {
    if (score >= SCORE_THRESHOLD) return { label: "Profil qualifié", color: "text-emerald-400", bg: "bg-emerald-400/10" };
    if (score >= SCORE_THRESHOLD * 0.7) return { label: "Potentiel intéressant", color: "text-amber-400", bg: "bg-amber-400/10" };
    return { label: "En dessous du profil recherché", color: "text-red-400", bg: "bg-red-400/10" };
  }

  // During quiz
  const projectedScore = progress > 0 ? score / progress : 0;
  if (projectedScore >= SCORE_THRESHOLD) return { label: "Trajectoire qualifiée", color: "text-emerald-400", bg: "bg-emerald-400/10" };
  if (projectedScore >= SCORE_THRESHOLD * 0.7) return { label: "Potentiel intéressant", color: "text-amber-400", bg: "bg-amber-400/10" };
  return { label: "En dessous du profil recherché", color: "text-red-400", bg: "bg-red-400/10" };
};

export const ManagerPanel = ({ answers, totalScore, currentQuestion }: ManagerPanelProps) => {
  const totalQuestions = quizQuestions.length;
  const totalAnswered = Object.keys(answers).length;
  const status = getStatus(totalScore, totalAnswered, totalQuestions);
  const maxScore = totalQuestions * 5;
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-lg p-6 h-fit sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-bismuth-teal" />
        <h3 className="text-lg font-bold text-foreground">Panneau de suivi</h3>
      </div>

      {/* Score total */}
      <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Score total</span>
          <span className="text-2xl font-bold text-foreground">{totalScore}<span className="text-sm text-muted-foreground">/{maxScore}</span></span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, hsl(var(--bismuth-teal)), hsl(var(--bismuth-purple)))`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${scorePercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Score butoir */}
      <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Score butoir</span>
          <span className="text-sm font-semibold text-foreground ml-auto">{SCORE_THRESHOLD}/{maxScore}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${status.bg}`}>
          {totalScore >= SCORE_THRESHOLD ? (
            <CheckCircle className={`w-4 h-4 ${status.color}`} />
          ) : (
            <AlertCircle className={`w-4 h-4 ${status.color}`} />
          )}
          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4" />
        <span>{totalAnswered} / {totalQuestions} questions répondues</span>
      </div>

      {/* Réponses détaillées */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {quizQuestions.map((q) => {
            const answer = answers[q.id];
            if (!answer) return null;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-md bg-muted/50 border border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate">Q{q.id}. {q.question}</p>
                    <p className="text-sm text-foreground mt-0.5">{answer.label}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                      answer.score >= 4
                        ? "bg-emerald-400/15 text-emerald-400"
                        : answer.score >= 2
                        ? "bg-amber-400/15 text-amber-400"
                        : "bg-red-400/15 text-red-400"
                    }`}
                  >
                    +{answer.score}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
