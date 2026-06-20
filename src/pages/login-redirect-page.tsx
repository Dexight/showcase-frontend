import { useEffect } from "react";
import { API_URL } from "@/shared/api/constants";

export function LoginRedirectPage() {
  useEffect(() => {
    window.location.assign(`${API_URL}/oauth2/authorization/azure`);
  }, []);

  return (
    <div className="flex min-h-svh items-center text-center justify-center">
      <h1>Скоро вы будете перенаправлены на страницу аутентификации</h1>
    </div>
  );
}
