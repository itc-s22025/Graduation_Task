import {
  Inter,
  Zen_Maru_Gothic
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthProvider"; // layout.js の位置によって調整

const inter = Inter({ subsets: ["latin"] });
const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ["300", "400"],
  display: "swap"
})

export const metadata = {
  title: "Prettie",
  description: "An application for Graduation Task",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={zenMaruGothic.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
