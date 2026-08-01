import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPageContent } from "@/app/(auth)/login/page";
import { getAdminLoginPath, isAdminIpAllowed } from "@/lib/env";

type PrivateLoginPageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string; next?: string }>;
};

function requestIp(headerStore: Headers) {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    undefined
  );
}

export default async function PrivateLoginPage({
  params,
  searchParams,
}: PrivateLoginPageProps) {
  const { token } = await params;
  const configuredPath = getAdminLoginPath();
  const configuredToken = configuredPath.split("/").filter(Boolean).at(-1);
  const headerStore = await headers();
  const ip = requestIp(headerStore);
  const isLocalDevelopment = process.env.NODE_ENV !== "production" && !ip;

  if (
    token !== configuredToken ||
    (!isAdminIpAllowed(ip) && !isLocalDevelopment)
  ) {
    redirect("/book");
  }

  return <LoginPageContent searchParams={searchParams} />;
}