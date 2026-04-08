import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const networkChapters: Record<string, ChapterLoader> = {
  "01-osi-tcpip": () => import("./01-osi-tcpip"),
  "02-ip-port-dns": () => import("./02-ip-port-dns"),
  "03-tcp-udp": () => import("./03-tcp-udp"),
  "04-http-basics": () => import("./04-http-basics"),
  "05-http-methods-status": () => import("./05-http-methods-status"),
  "06-http-headers": () => import("./06-http-headers"),
  "07-https-tls": () => import("./07-https-tls"),
  "08-http2-http3": () => import("./08-http2-http3"),
  "09-rest-api": () => import("./09-rest-api"),
  "10-websocket": () => import("./10-websocket"),
  "11-sse": () => import("./11-sse"),
  "12-graphql": () => import("./12-graphql"),
  "13-cors": () => import("./13-cors"),
  "14-cookie-session-token": () => import("./14-cookie-session-token"),
  "15-caching-strategy": () => import("./15-caching-strategy"),
  "16-network-optimization": () => import("./16-network-optimization"),
  "17-xss-csrf": () => import("./17-xss-csrf"),
  "18-csp-security-headers": () => import("./18-csp-security-headers"),
  "19-authentication-oauth": () => import("./19-authentication-oauth"),
};
