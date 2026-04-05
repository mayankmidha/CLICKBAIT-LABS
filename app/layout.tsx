import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clickbait Labs AI",
  description: "Elite Viral Content Factory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#000' }}>
        {children}
      </body>
    </html>
  );
}
