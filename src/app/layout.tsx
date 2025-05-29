import type { Metadata } from "next";
import { Fira_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./Header";
import Background from "./components/Background";
import { Toaster } from "react-hot-toast";

// Import Fira Sans as the primary font
// const firaSans = Fira_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-sans",
// });

const inter = Inter({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Papil.io",
  description: "Automatic Course Making App",
  icons: {
    icon: "/PhButterflyBold.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" 
    // className={firaSans.variable} 
    className={inter.variable}
    suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen relative flex flex-col">
        {/* Background component is rendered first so it sits behind everything */}
        <Background />
        <Providers>
          <Header />
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
          <main className="flex-1 pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
