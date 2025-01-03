import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PopupWidget }  from "@/components/sections/PopupWidget";
import { footNavigation } from "@/components/sections/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Youtuber AI",
  description: "Generate video scripts with any creator style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <div>{children}</div>
          <Footer navigation={footNavigation} />
          <PopupWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
