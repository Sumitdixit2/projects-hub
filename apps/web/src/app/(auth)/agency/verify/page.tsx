"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return <div>Email: {email}</div>;
}
