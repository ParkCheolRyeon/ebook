import { useState } from "react";
import { motion } from "framer-motion";
import type { QuizQuestion as QuizQuestionType } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    const isCorrect = index === question.correctIndex;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2000);
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <p className="mb-6 text-base font-semibold text-zinc-900 leading-7">{question.question}</p>
      <div className="space-y-3">
        {question.choices.map((choice, i) => {
          let choiceStyle = "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (revealed) {
            if (i === question.correctIndex) {
              choiceStyle = "border-green-400 bg-green-50 text-green-800";
            } else if (i === selected && i !== question.correctIndex) {
              choiceStyle = "border-red-400 bg-red-50 text-red-800";
            } else {
              choiceStyle = "border-zinc-100 bg-zinc-50 text-zinc-400";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${choiceStyle} ${revealed ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
              {choice}
            </button>
          );
        })}
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-indigo-50 px-4 py-3"
        >
          <p className="text-xs font-semibold text-indigo-700 mb-1">해설</p>
          <p className="text-sm text-indigo-600">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
