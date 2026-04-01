import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 기초 ~ 스코프와 실행 컨텍스트",
  coverGroups: ["기초", "함수의 기본", "스코프와 실행 컨텍스트"],
  questions: [
    {
      id: "mid01-q1",
      question: "다음 코드의 출력 결과는?\n\nlet a = 1;\n{\n  let a = 2;\n  console.log(a);\n}\nconsole.log(a);",
      choices: ["2, 2", "2, 1", "1, 1", "ReferenceError"],
      correctIndex: 1,
      explanation: "let은 블록 스코프입니다. 블록 안의 a는 바깥의 a와 별개의 변수입니다.",
    },
  ],
};

export default midQuiz;
