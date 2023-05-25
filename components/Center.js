"use client";

import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Playlist from "./Playlist";
import Home from "./Home";
import { useRecoilValue } from "recoil";
import { displayState } from "@/atoms/displayAtom";

export default function Center() {
  const { data: session } = useSession();
  const display = useRecoilValue(displayState);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center 
        bg-black space-x-3 opacity-90 hover:opacity-80 
        cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      {display === "playlist" && <Playlist />}
      {display === "home" && <Home />}
    </div>
  );
}
