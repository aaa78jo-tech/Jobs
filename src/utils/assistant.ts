import { professions, getProfessionById } from '../data/professions';
import type { PracticalProblem } from '../types';

interface Match {
  problem: PracticalProblem;
  professionId: string;
  professionName: string;
  score: number;
}

const normalize = (text: string) => text.trim().toLowerCase();

export function findAnswer(input: string, professionId?: string): {
  answer: string;
  matchedProfessionId?: string;
  matchedProfessionName?: string;
} {
  const text = normalize(input);
  if (!text) {
    return { answer: 'اكتب مشكلتك أو سؤالك وأنا هحاول أساعدك 🙂' };
  }

  const pool = professionId
    ? professions.filter((p) => p.id === professionId)
    : professions;

  let best: Match | null = null;

  for (const profession of pool) {
    for (const problem of profession.problems) {
      let score = 0;
      for (const keyword of problem.keywords) {
        if (text.includes(normalize(keyword))) {
          score += keyword.length;
        }
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { problem, professionId: profession.id, professionName: profession.name, score };
      }
    }
  }

  if (best) {
    const crossContext = professionId && best.professionId !== professionId;
    const prefix = crossContext
      ? `الموضوع ده أقرب لمهنة "${best.professionName}":\n\n`
      : '';
    return {
      answer: `${prefix}${best.problem.answer}`,
      matchedProfessionId: best.professionId,
      matchedProfessionName: best.professionName,
    };
  }

  if (professionId) {
    const profession = getProfessionById(professionId);
    const sample = profession?.problems[0]?.question;
    return {
      answer:
        `معنديش إجابة جاهزة لسؤال ده بالظبط في مجال "${profession?.name}". ` +
        (sample ? `جرب تسأل حاجة زي: "${sample}"` : 'جرب تصيغ السؤال بطريقة مختلفة.') +
        '\n\n(ملاحظة: المساعد حاليًا يعتمد على إجابات جاهزة، ولاحقًا هيتم ربطه بذكاء اصطناعي حقيقي للإجابة على أي سؤال).',
    };
  }

  return {
    answer:
      'معنديش إجابة جاهزة للسؤال ده حاليًا. اختار مهنة من الصفحة الرئيسية عشان أساعدك بمشاكلها الشائعة، أو جرب صياغة تانية للسؤال.\n\n(ملاحظة: المساعد حاليًا يعتمد على إجابات جاهزة، ولاحقًا هيتم ربطه بذكاء اصطناعي حقيقي).',
  };
}
