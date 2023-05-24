"use client";

import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "@/hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIDState } from "@/atoms/playlistAtom";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistID, setPlaylistID] = useRecoilState(playlistIDState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="text-gray-500 p-5 text-xs lg:text-sm 
    border-r border-gray-900 overflow-y-scroll scrollbar-hide 
    h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex"
    >
      <div className="space-y-4">
        <button className="sidebar-button">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="sidebar-button">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button className="sidebar-button">
          <BuildingLibraryIcon className="w-5 h-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="sidebar-button">
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create Playlist</p>
        </button>
        <button className="sidebar-button">
          <HeartIcon className="w-5 h-5" />
          <p>Liked Songs</p>
        </button>
        <button className="sidebar-button ">
          <RssIcon className="w-5 h-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistID(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}
