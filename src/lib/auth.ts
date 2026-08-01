import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  DEMO_SESSION_COOKIE,
  type AppRole,
  demoUsers,
  isAppRole,
  isDemoLoginEnabled,
  isSupabaseConfigured,
  verifyDemoSession,
} from "@/lib/env";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  source: "demo" | "supabase";
};

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components can read cookies but cannot always write them.
          }
        },
      },
    },
  );
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (user) {
      const metadataRole = user.app_metadata?.role;
      const role =
        metadataRole === "staff" || metadataRole === "admin"
          ? metadataRole
          : null;

      if (!role) {
        return null;
      }

      return {
        id: user.id,
        email: user.email ?? "",
        name:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : user.email ?? "RezervAZ user",
        role,
        source: "supabase",
      };
    }
  }

  if (!isDemoLoginEnabled()) {
    return null;
  }

  const cookieStore = await cookies();
  const role = await verifyDemoSession(
    cookieStore.get(DEMO_SESSION_COOKIE)?.value,
  );

  if (!role || !isAppRole(role)) {
    return null;
  }

  const demoUser = demoUsers.find((user) => user.role === role);

  if (!demoUser) {
    return null;
  }

  return {
    id: `demo-${demoUser.role}`,
    email: demoUser.email,
    name: demoUser.name,
    role: demoUser.role,
    source: "demo",
  };
}
