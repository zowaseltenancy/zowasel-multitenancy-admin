"use client"

import { redirect, useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const isWorkspace = router.pathname === '/admin/chat-support';

  if (isWorkspace) {
    return <Component {...pageProps} />;
  }
  redirect("/admin");
}
