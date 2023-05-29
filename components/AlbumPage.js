import useSpotify from "@/hooks/useSpotify";
import Song from "./Song";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { albumIDState } from "@/atoms/albumAtom";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function AlbumPage() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const spotifyApi = useSpotify();
  const albumID = useRecoilValue(albumIDState);
  const [album, setAlbum] = useState();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [albumID]);

  useEffect(() => {
    if (session) {
      spotifyApi
        .getAlbum(albumID)
        .then((data) => {
          setAlbum(data.body);
          setTracks(data.body.tracks.items);
          console.log(data.body);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [session, spotifyApi, albumID]);

  return (
    <div>
      <section
        className={`flex items-end space-x-7 
        bg-gradient-to-b to-black ${color} 
        h-80 text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>ALBUM</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{album?.name}</h1>
        </div>
      </section>
      <div>
        {tracks.map((track, index) => (
          <Song track={track} order={index} key={track.id} />
        ))}
      </div>
    </div>
  );
}
