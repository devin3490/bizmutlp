import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Max scores for open questions (textarea type)
const OPEN_QUESTION_MAX_SCORES: Record<string, number> = {
  "9": 15,   // Inacceptable si rien ne changeait
  "11": 15,  // Situation récente - énergie sans résultat
  "13": 10,  // Mériter ta place
  "15": 10,  // Moments de croissance
  "16": 10,  // Sous pression
};

// Max scores for "Autre" on choice questions
const CHOICE_OTHER_MAX_SCORES: Record<string, number> = {
  "8": 5,
  "10": 5,
  "12": 5,
  "14": 5,
};

interface AnswerData {
  label: string;
  score: number;
}

async function callAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("AI Gateway error:", res.status, text);
    throw new Error(`AI Gateway error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in AI response");
    return JSON.parse(match[0]);
  }
}

function clamp(value: number, max: number): number {
  return Math.round(Math.max(0, Math.min(value, max)) * 100) / 100;
}

async function scoreOpenQuestion(
  apiKey: string,
  questionId: string,
  questionText: string,
  answerText: string,
  maxScore: number
): Promise<{ score: number; reasoning: string; tags: string[] }> {
  const prompt = `Tu évalues un candidat pour un poste de vente porte-à-porte haute performance.

Question ID: ${questionId}
Question: ${questionText}
Réponse du candidat:
"""
${answerText}
"""

Note la réponse sur une échelle de 0 à ${maxScore}.

Sois strict.

Récompense:
- lucidité
- ownership / responsabilité
- tolérance à l'inconfort
- ambition
- stabilité sous pression
- standards élevés
- capacité à articuler une pensée claire

Pénalise:
- flou
- passivité
- victimisation
- clichés génériques
- faible niveau d'exigence
- externalisation du blâme

Retourne UNIQUEMENT un JSON valide:
{
  "score": integer,
  "reasoning": "explication courte",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const response = await callAI(apiKey, prompt);
    const parsed = extractJson(response);
    return {
      score: clamp(Number(parsed.score ?? 0), maxScore),
      reasoning: String(parsed.reasoning ?? ""),
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
    };
  } catch (err) {
    console.error(`AI scoring failed for q${questionId}:`, err);
    return { score: 0, reasoning: "Erreur IA", tags: [] };
  }
}

async function scoreCoherence(
  apiKey: string,
  candidateInfo: Record<string, string>,
  answers: Record<string, AnswerData>,
  aiScores: Record<string, { score: number; reasoning: string; tags: string[] }>
): Promise<{ coherence_coef: number; reasoning: string; flags: string[] }> {
  const payload = { candidate: candidateInfo, answers, ai_scores: aiScores };

  const prompt = `Tu évalues la cohérence globale d'un candidat pour un environnement de vente haute performance.

Voici le profil complet du candidat:
${JSON.stringify(payload, null, 2)}

Cherche les incohérences psychologiques.
Exemples:
- dit aimer la compétition mais évite la pression dans ses récits
- dit aimer l'autonomie mais réclame un cadre protecteur partout
- revendique l'ownership mais blame les circonstances

Retourne UNIQUEMENT un JSON valide:
{
  "coherence_coef": float,
  "reasoning": "explication courte",
  "flags": ["flag1", "flag2"]
}

Contraintes:
- coherence_coef doit être une de ces valeurs: 0.85, 0.90, 0.95, 1.00, 1.05, 1.10
- très incohérent => 0.85
- faible cohérence => 0.90
- moyenne => 0.95
- bonne => 1.00
- très bonne => 1.05
- exceptionnelle => 1.10`;

  try {
    const response = await callAI(apiKey, prompt);
    const parsed = extractJson(response);
    let coef = Number(parsed.coherence_coef ?? 1.0);
    const validCoefs = [0.85, 0.90, 0.95, 1.00, 1.05, 1.10];
    if (!validCoefs.includes(coef)) coef = 1.0;

    return {
      coherence_coef: coef,
      reasoning: String(parsed.reasoning ?? ""),
      flags: Array.isArray(parsed.flags) ? parsed.flags.map(String) : [],
    };
  } catch (err) {
    console.error("Coherence scoring failed:", err);
    return { coherence_coef: 1.0, reasoning: "Erreur IA", flags: [] };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { answers } = await req.json() as { answers: Record<string, AnswerData> };

    // Questions text lookup
    const questionTexts: Record<string, string> = {
      "8": "Dans quel environnement as-tu tendance à donner le meilleur de toi-même ?",
      "9": "Quand tu regardes les 2 à 3 prochaines années de ta vie, qu'est-ce qui serait inacceptable pour toi si rien ne changeait ?",
      "10": "Quel type de journée te donne le plus le sentiment d'avoir avancé pour vrai ?",
      "11": "Raconte une situation récente où tu as mis de l'énergie dans quelque chose sans obtenir le résultat que tu voulais. Qu'est-ce que cette situation t'a appris sur toi ?",
      "12": "Parmi les affirmations suivantes, laquelle ressemble le plus à ta façon d'aborder un objectif important ?",
      "13": "Qu'est-ce qui te donne personnellement le sentiment de mériter ta place dans une équipe forte ?",
      "14": "Quel modèle de travail te semble le plus stimulant à long terme ?",
      "15": "Dans les moments où tu as le plus grandi dans ta vie, qu'est-ce qui était généralement vrai de toi à ce moment-là ?",
      "16": "Si on parlait avec les personnes qui t'ont vu de près quand ça comptait vraiment, qu'est-ce qu'elles diraient de ta façon de te comporter sous pression ?",
    };

    const aiScores: Record<string, { score: number; reasoning: string; tags: string[] }> = {};

    // Score open questions (textarea) in parallel
    const openScoringPromises = Object.entries(OPEN_QUESTION_MAX_SCORES).map(
      async ([qId, maxScore]) => {
        const answer = answers[qId];
        if (!answer?.label) return;
        const result = await scoreOpenQuestion(
          OPENAI_API_KEY,
          qId,
          questionTexts[qId] ?? "",
          answer.label,
          maxScore
        );
        aiScores[qId] = result;
      }
    );

    // Score "Autre" choice answers in parallel
    const otherScoringPromises = Object.entries(CHOICE_OTHER_MAX_SCORES).map(
      async ([qId, maxScore]) => {
        const answer = answers[qId];
        if (!answer?.label?.startsWith("Autre :")) return;
        const result = await scoreOpenQuestion(
          OPENAI_API_KEY,
          qId,
          questionTexts[qId] ?? "",
          answer.label.replace("Autre : ", ""),
          maxScore
        );
        aiScores[qId] = result;
      }
    );

    await Promise.all([...openScoringPromises, ...otherScoringPromises]);

    // Compute raw total: choice scores (fixed) + AI scores for open/other
    let totalScoreRaw = 0;
    const maxPossible = 5 + 15 + 5 + 15 + 5 + 10 + 5 + 10 + 10; // 80
    
    for (const [qId, answer] of Object.entries(answers)) {
      if (aiScores[qId]) {
        totalScoreRaw += aiScores[qId].score;
      } else if (answer.score > 0) {
        totalScoreRaw += answer.score;
      }
    }

    // Candidate info for coherence
    const candidateInfo: Record<string, string> = {
      prenom: answers["1"]?.label ?? "",
      nom: answers["2"]?.label ?? "",
      age: answers["3"]?.label ?? "",
      ville: answers["6"]?.label ?? "",
      experience: answers["7"]?.label ?? "",
    };

    // Coherence scoring
    const coherence = await scoreCoherence(LOVABLE_API_KEY, candidateInfo, answers, aiScores);
    const totalScoreAdjusted = Math.round(Math.min(100, totalScoreRaw * coherence.coherence_coef) * 100) / 100;

    // Determine status
    let status: string;
    if (totalScoreAdjusted < 35) status = "not_qualified";
    else if (totalScoreAdjusted < 50) status = "manual_review";
    else if (totalScoreAdjusted < 60) status = "qualified";
    else status = "priority_candidate";

    const result = {
      ai_scores: aiScores,
      total_score_raw: Math.round(totalScoreRaw * 100) / 100,
      max_possible: maxPossible,
      coherence_coef: coherence.coherence_coef,
      coherence_reasoning: coherence.reasoning,
      coherence_flags: coherence.flags,
      total_score_adjusted: totalScoreAdjusted,
      status,
      qualified: totalScoreAdjusted >= 50,
    };

    console.log("AI scoring result:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Score-answers error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
