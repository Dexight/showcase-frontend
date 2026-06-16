const fromEnv = import.meta.env.VITE_API_URL as string | undefined;

export const API_URL =
  fromEnv !== undefined
    ? fromEnv
    : import.meta.env.DEV
      ? "http://localhost:8080"
      : "";
