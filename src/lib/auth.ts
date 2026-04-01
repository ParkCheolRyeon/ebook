const AUTH_KEY = "ebook-auth";
const EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

interface AuthState {
  authenticated: boolean;
  loginAt: number;
}

const VALID_ID = "pcr";
const VALID_PASSWORD = "1q2w3e4r!@#";

export function login(id: string, password: string): boolean {
  if (id === VALID_ID && password === VALID_PASSWORD) {
    const state: AuthState = {
      authenticated: true,
      loginAt: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return false;

  try {
    const state: AuthState = JSON.parse(raw);
    if (!state.authenticated) return false;

    const elapsed = Date.now() - state.loginAt;
    if (elapsed > EXPIRY_MS) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
}
