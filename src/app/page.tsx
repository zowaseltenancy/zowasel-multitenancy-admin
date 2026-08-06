import { redirect } from "next/navigation";


export default function Home() {
  const isWorkspace = router.pathname === '/admin/chat-support';

  if (isWorkspace) {
    return <Component {...pageProps} />;
  }
  redirect("/admin");
}
