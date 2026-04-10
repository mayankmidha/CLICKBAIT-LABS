import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { RoleProvider } from "@/lib/store/RoleContext";

export const metadata: Metadata = {
  title: "CLICKBAIT LABS",
  description: "Production console for Clickbait Labs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased min-h-screen">
        <RoleProvider>
          {/* Desktop: sidebar fixed left + main offset */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="md:ml-64 min-h-screen px-6 md:px-10 py-8 md:py-10 pb-24 md:pb-12">
            {children}
          </main>
          <MobileNav />
        </RoleProvider>
      </body>
    </html>
  );
}
