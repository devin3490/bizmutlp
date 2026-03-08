import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, SCORE_THRESHOLD } from "@/data/quizQuestions";
import { CheckCircle, AlertCircle, TrendingUp, Target, Award } from "lucide-react";

interface ManagerPanelProps {
  answers: Record<number, { label: string; score: number }>;
  totalScore: number;
  currentQuestion: number;
  compact?: boolean;
}

const getStatus = (score: number, totalAnswered: number, totalQuestions: number) => {
  if (totalAnswered === 0) return { label: "En attente", color: "text-muted-foreground", bg: "bg-muted" };

  const choiceQuestions = quizQuestions.filter((q) => q.type === "choice");
  const maxChoiceScore = choiceQuestions.length * 5;

  if (totalAnswered === totalQuestions) {
    if (score >= SCORE_THRESHOLD) return { label: "Profil qualifié", color: "text-emerald-400", bg: "bg-emerald-400/10" };
    if (score >= SCORE_THRESHOLD * 0.7) return { label: "Potentiel intéressant", color: "text-amber-400", bg: "bg-amber-400/10" };
    return { label: "En dessous du profil recherché", color: "text-red-400", bg: "bg-red-400/10" };
  }

  const progress = totalAnswered / totalQuestions;
  const projectedScore = progress > 0 ? score / progress : 0;
  if (projectedScore >= SCORE_THRESHOLD) return { label: "Trajectoire qualifiée", color: "text-emerald-400", bg: "bg-emerald-400/10" };
  if (projectedScore >= SCORE_THRESHOLD * 0.7) return { label: "Potentiel intéressant", color: "text-amber-400", bg: "bg-amber-400/10" };
  return { label: "En progression", color: "text-muted-foreground", bg: "bg-muted" };
};

export const ManagerPanel = ({ answers, totalScore, currentQuestion, compact = false }: ManagerPanelProps) => {
  const totalQuestions = quizQuestions.length;
  const totalAnswered = Object.keys(answers).length;
  const status = getStatus(totalScore, totalAnswered, totalQuestions);
  const choiceQuestions = quizQuestions.filter((q) => q.type === "choice");
  const maxScore = choiceQuestions.length * 5;
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  if (compact) {
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${status.bg}`}>
          {totalScore >= SCORE_THRESHOLD ? (
            <CheckCircle className={`w-3.5 h-3.5 ${status.color}`} />
          ) : (
            <AlertCircle className={`w-3.5 h-3.5 ${status.color}`} />
          )}
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
          <span className="text-xs text-muted-foreground ml-auto">Score: {totalScore}</span>
        </div>

        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
          {quizQuestions.map((q) => {
            const answer = answers[q.id];
            if (!answer) return null;
            return (
              <div key={q.id} className="flex items-center justify-between text-xs p-2 rounded bg-muted/30 border border-border gap-2">
                <span className="text-muted-foreground shrink-0">Q{q.id}</span>
                <span className="text-foreground truncate flex-1">{answer.label}</span>
                {answer.score > 0 && (
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      answer.score >= 4
                        ? "bg-emerald-400/15 text-emerald-400"
                        : answer.score >= 2
                        ? "bg-amber-400/15 text-amber-400"
                        : "bg-red-400/15 text-red-400"
                    }`}
                  >
                    +{answer.score}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-lg p-5 md:p-6 h-fit sticky top-24"
    >
      <div className="flex items-center gap-2 mb-5 md:mb-6">
        <Award className="w-5 h-5 text-bismuth-teal" />
        <h3 className="text-base md:text-lg font-bold text-foreground">Panneau de suivi</h3>
      </div>

      {/* Score total */}
      <div className="mb-5 md:mb-6 p-3 md:p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs md:text-sm text-muted-foreground">Score total</span>
          <span className="text-xl md:text-2xl font-bold text-foreground">
            {totalScore}
            <span className="text-xs md:text-sm text-muted-foreground">/{maxScore}</span>
          </span>
        </div>
        <div className="w-full h-1.5 md:h-2 rounded-full bg-muted overflow-hidden">
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
      <div className="mb-5 md:mb-6 p-3 md:p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs md:text-sm text-muted-foreground">Score butoir</span>
          <span className="text-xs md:text-sm font-semibold text-foreground ml-auto">{SCORE_THRESHOLD}/{maxScore}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${status.bg}`}>
          {totalScore >= SCORE_THRESHOLD ? (
            <CheckCircle className={`w-4 h-4 ${status.color}`} />
          ) : (
            <AlertCircle className={`w-4 h-4 ${status.color}`} />
          )}
          <span className={`text-xs md:text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-5 md:mb-6 flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4" />
        <span>{totalAnswered} / {totalQuestions} réponses</span>
      </div>

      {/* Réponses détaillées */}
      <div className="space-y-2 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
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
                className="p-2.5 md:p-3 rounded-md bg-muted/50 border border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                      Q{q.id}. {q.question}
                    </p>
                    <p className="text-xs md:text-sm text-foreground mt-0.5 line-clamp-2">{answer.label}</p>
                  </div>
                  {answer.score > 0 && (
                    <span
                      className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shrink-0 ${
                        answer.score >= 4
                          ? "bg-emerald-400/15 text-emerald-400"
                          : answer.score >= 2
                          ? "bg-amber-400/15 text-amber-400"
                          : "bg-red-400/15 text-red-400"
                      }`}
                    >
                      +{answer.score}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
