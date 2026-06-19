import { Outlet, Navigate } from "react-router";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGetDatabaseUser } from "@/pages/create-project-page/api/hooks/use-get-database-user";
import { FullPageSpinner } from "@/shared/ui/full-page-spinner";

export function SuperAdminRoute() {
  const { authUser, isAuthLoading } = useAuth();

  const { data: currentUser, isPending } = useGetDatabaseUser(
    authUser?.attributes.email as string,
    !!authUser && !isAuthLoading
  );

  if (isAuthLoading || isPending) {
    return <FullPageSpinner />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role.id !== 4) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}