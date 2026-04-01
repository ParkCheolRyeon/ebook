import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const reactChapters: Record<string, ChapterLoader> = {
  "09-useeffect": () => import("./09-useeffect"),
  "10-useref": () => import("./10-useref"),
  "11-usememo-usecallback": () => import("./11-usememo-usecallback"),
  "12-usereducer": () => import("./12-usereducer"),
  "13-usecontext": () => import("./13-usecontext"),
  "14-use-hook": () => import("./14-use-hook"),
  "15-custom-hooks": () => import("./15-custom-hooks"),
  "16-uselayouteffect": () => import("./16-uselayouteffect"),
  "17-usedeferred-usetransition": () => import("./17-usedeferred-usetransition"),
  "18-stale-closure": () => import("./18-stale-closure"),
};
