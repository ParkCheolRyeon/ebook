import type { QuizQuestion } from "@/types/quiz";

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: boolean[];
  onRetry: () => void;
  onDone: () => void;
  doneLabel?: string;
}

export default function QuizResult({ questions, answers, onRetry, onDone, doneLabel = "완료" }: QuizResultProps) {
  const correct = answers.filter(Boolean).length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  let barColor = "bg-red-400";
  let textColor = "text-red-600";
  if (percent >= 80) {
    barColor = "bg-green-400";
    textColor = "text-green-600";
  } else if (percent >= 50) {
    barColor = "bg-yellow-400";
    textColor = "text-yellow-600";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm">
        <p className="mb-1 text-4xl font-bold text-zinc-900">{correct}<span className="text-xl text-zinc-400"> / {total}</span></p>
        <p className={`mb-4 text-lg font-semibold ${textColor}`}>{percent}점</p>
        <div className="h-2 w-full rounded-full bg-zinc-100">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          {percent >= 80 ? "훌륭해요! 챕터를 완벽히 이해했습니다." : percent >= 50 ? "잘 했어요! 조금 더 복습해 보세요." : "다시 한 번 챕터를 읽어 보세요."}
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className={`rounded-xl border px-4 py-3 ${answers[i] ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 text-lg ${answers[i] ? "text-green-500" : "text-red-500"}`}>{answers[i] ? "✓" : "✗"}</span>
              <div>
                <p className="text-sm font-medium text-zinc-800">{q.question}</p>
                {!answers[i] && (
                  <p className="mt-1 text-xs text-zinc-500">정답: {q.choices[q.correctIndex]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          다시 풀기
        </button>
        <button
          onClick={onDone}
          className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          {doneLabel}
        </button>
      </div>
    </div>
  );
}
