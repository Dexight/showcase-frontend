import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/shared/api/constants";
import { IS_DEV_MODE } from "@/shared/lib/deployment-mode";
import { setDevToken } from "@/shared/lib/dev-token";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function LoginRedirectPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (IS_DEV_MODE) return;
    window.location.assign(`${API_URL}/oauth2/authorization/azure`);
  }, []);

  if (!IS_DEV_MODE) {
    return (
      <div className="flex min-h-svh items-center text-center justify-center">
        <h1>Скоро вы будете перенаправлены на страницу аутентификации</h1>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = token.trim();
    if (!value) return;
    setDevToken(value);
    await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Dev-вход по токену</h1>
        <p className="text-sm text-muted-foreground">
          Введите значение <code>DEV_AUTH_TOKEN</code> из <code>.env</code>{" "}
          бэкенда. Токен сохранится в localStorage и будет автоматически
          добавляться к запросам.
        </p>
        <Input
          type="password"
          placeholder="DEV_AUTH_TOKEN"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoFocus
        />
        <Button type="submit" disabled={!token.trim()}>
          Войти
        </Button>
      </form>
    </div>
  );
}
