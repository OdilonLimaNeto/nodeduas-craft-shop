import { AuthProvider } from "@/providers/authProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nó de duas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${inter.className} ${poppins.variable}`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 5000,
              }}
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
