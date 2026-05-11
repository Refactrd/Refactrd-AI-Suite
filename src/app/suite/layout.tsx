import { Montserrat } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SuiteSidebar } from "@/components/suite/SuiteSidebar";
import { headers } from "next/headers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function SuiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Login page gets no sidebar or font wrapper conflict
  if (pathname.includes("/suite/login")) {
    return (
      <div className={`${montserrat.variable} font-sans`}>
        {children}
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/suite/login");

  return (
    <div
      className={`${montserrat.variable} font-sans flex min-h-screen`}
      style={{
        backgroundColor: "#e6eaf0",
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
    >
      <SuiteSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}