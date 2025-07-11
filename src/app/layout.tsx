import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/cart-context";

// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: "Food Delivery in Bangladesh | foodit",
    template: "%s | Food Delivery in Bangladesh | foodit",
  },
  description: "The largest platform for food delivery in whole bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased `}> {/* Apply the Poppins font globally  ${poppins.className} */}
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
      <Toaster />
    </ClerkProvider>
  );
}
