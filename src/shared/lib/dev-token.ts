const KEY = "dev-auth-token";

export function getDevToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setDevToken(token: string): void {
  localStorage.setItem(KEY, token);
}

export function clearDevToken(): void {
  localStorage.removeItem(KEY);
}
