import {
  Inter,
  Kosugi_Maru,
  Sawarabi_Mincho,
  Tsukimi_Rounded,
  Zen_Kaku_Gothic_New,
  Zen_Kurenaido, Zen_Maru_Gothic
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/AuthProvider';

const inter = Inter({ subsets: ["latin"] });

const zenKurenaido = Zen_Kurenaido({
  subsets: ['latin'],
  weight: ["400"],
})

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ["400"],
})

export const metadata = {
  title: "Prettie",
  description: "An application for Graduation Task",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={zenMaruGothic.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
