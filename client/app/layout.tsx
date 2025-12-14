import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/Layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RichWin",
  description: "Color Prediction Game",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground pb-20" suppressHydrationWarning={true}>
            {children}
            <Suspense fallback={null}>
              <BottomNav />
            </Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
