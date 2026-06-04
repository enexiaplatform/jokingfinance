import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase.auth.getClaims();

    if (!data?.claims?.sub) {
      redirect("/login?redirectTo=/app/dashboard");
    }
  }

  return <AppShell>{children}</AppShell>;
}
