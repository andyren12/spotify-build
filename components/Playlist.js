import useSpotify from "@/hooks/useSpotify";
import Songs from "./Songs";
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIDState, playlistState } from "@/atoms/playlistAtom";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function Playlist() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const spotifyApi = useSpotify();
  const playlistID = useRecoilValue(playlistIDState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistID]);

  useEffect(() => {
    if (session) {
      spotifyApi
        .getPlaylist(playlistID)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [session, spotifyApi, playlistID, setPlaylist]);
  return (
    <div>
      <section
        className={`flex items-end space-x-7 
        bg-gradient-to-b to-black ${color} 
        h-80 text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}
