import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "JavaScript 종합 시험",
  questions: [
    {
      id: "final-q1",
      question: "JavaScript에서 typeof null의 결과는?",
      choices: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctIndex: 2,
      explanation: 'typeof null이 "object"를 반환하는 것은 JavaScript 초기 구현의 버그입니다. null은 원시값이지만 내부적으로 타입 태그가 객체와 동일하게 0이었기 때문입니다.',
    },
  ],
};

export default finalExam;
