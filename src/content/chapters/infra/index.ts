import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const infraChapters: Record<string, ChapterLoader> = {
  "01-git-workflow": () => import("./01-git-workflow"),
  "02-git-advanced": () => import("./02-git-advanced"),
  "03-code-review": () => import("./03-code-review"),
  "04-package-managers": () => import("./04-package-managers"),
  "05-monorepo": () => import("./05-monorepo"),
  "06-module-bundlers": () => import("./06-module-bundlers"),
  "07-vite-deep-dive": () => import("./07-vite-deep-dive"),
  "08-build-optimization": () => import("./08-build-optimization"),
  "09-docker-basics": () => import("./09-docker-basics"),
  "10-dockerfile": () => import("./10-dockerfile"),
  "11-docker-compose": () => import("./11-docker-compose"),
  "12-cicd-concepts": () => import("./12-cicd-concepts"),
  "13-github-actions": () => import("./13-github-actions"),
  "14-deployment-platforms": () => import("./14-deployment-platforms"),
  "15-aws-basics": () => import("./15-aws-basics"),
  "16-cdn-edge": () => import("./16-cdn-edge"),
  "17-monitoring": () => import("./17-monitoring"),
  "18-devops-culture": () => import("./18-devops-culture"),
};
