import type { Metadata } from "next";
import {Figtree} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongByUserId from "@/actions/getSongByUserId";
import Player from "@/components/Player";

const font = Figtree({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Listen to music1",
};

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongByUserId()

  return (
    <html lang="en">
      <body
        className={font.className}>
          <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
          <ModalProvider />
          <Sidebar songs={userSongs}>
        {children}
        </Sidebar>
        <Player />
        </UserProvider>
       </SupabaseProvider>
      </body>
    </html>
  );
}
