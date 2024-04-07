import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Menu from "@/components/layout/menu";
import { ThemeProvider } from "next-themes";
import PrivyProviderWrapper from "./privy-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pioner Labs",
  description: `Pioner Labs is a cryptocurrency exchange platform`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-poppins antialiased",
          poppins.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PrivyProviderWrapper>
            <div className="bg-black">
              <div className="flex flex-col h-[100vh] bg-background max-w-[1024px] mx-auto">
                <div className="h-full flex flex-col">
                  <div className="h-full max-h-[90vh] overflow-y-auto">
                    <div>{children}</div>
                  </div>
                  <Menu />
                </div>
              </div>
            </div>
            <ToastContainer
              autoClose={2000}
              toastStyle={{ background: "black", color: "white" }}
              progressStyle={{ background: "#E0AD0C" }}
            />
          </PrivyProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
