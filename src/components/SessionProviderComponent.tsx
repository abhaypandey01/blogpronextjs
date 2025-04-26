// filepath: c:\Users\Abhay\Documents\nextjs_projects\blogpro\src\components\SessionProviderWrapper.tsx
"use client"; // Mark this as a Client Component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}