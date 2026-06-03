import { API_URL } from "@/shared/api/constants";
import { IS_DEV_MODE } from "@/shared/lib/deployment-mode";
import { getDevToken } from "@/shared/lib/dev-token";

function targetsApi(url: string): boolean {
  if (API_URL === "") return url.startsWith("/");
  return url.startsWith(API_URL);
}

export function installDevFetchInterceptor(): void {
  if (!IS_DEV_MODE) return;
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = getDevToken();
    if (!token) return orig(input, init);

    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    if (!targetsApi(url)) return orig(input, init);

    const headers = new Headers(
      init.headers ?? (input instanceof Request ? input.headers : undefined)
    );
    headers.set("Authorization", `Bearer ${token}`);
    return orig(input, { ...init, headers });
  };
}
