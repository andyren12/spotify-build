import { artistIDState } from "@/atoms/artistAtom";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Song from "./Song";
import { albumIDState } from "@/atoms/albumAtom";
import { displayState } from "@/atoms/displayAtom";
import { shuffle } from "lodash";
import Album from "./Album";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function Artist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const artistID = useRecoilValue(artistIDState);
  const [artist, setArtist] = useState();
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumID, setAlbumID] = useRecoilState(albumIDState);
  const setDisplay = useSetRecoilState(displayState);
  const [seeMore, setSeeMore] = useState(false);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [albumID]);

  useEffect(() => {
    if (session) {
      spotifyApi.getArtist(artistID).then((data) => {
        setArtist(data.body);
      });
      spotifyApi.getArtistTopTracks(artistID, "US").then((data) => {
        if (!seeMore) {
          setTopTracks(data.body.tracks.slice(0, 5));
        } else {
          setTopTracks(data.body.tracks);
        }
      });
      spotifyApi.getArtistAlbums(artistID, { limit: 4 }).then((data) => {
        setAlbums(data.body.items);
      });
    }
  }, [session, spotifyApi, artistID, seeMore]);

  return (
    <div>
      <section
        className={`flex items-end space-x-7
        h-80 text-white p-8 bg-gradient-to-b to-black ${color} `}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={artist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>ARTIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{artist?.name}</h1>
        </div>
      </section>
      <section className="px-8">
        <h2 className="text-[1.2rem]">Top Tracks</h2>
        <div>
          {topTracks.map((track, index) => (
            <Song key={track.id} order={index} track={track} />
          ))}
          <button
            className="cursor-pointer px-8 text-sm text-white hover:text-gray-200"
            onClick={() => {
              setSeeMore(!seeMore);
            }}
          >
            {seeMore ? "Show less" : "See More"}
          </button>
        </div>
        <h2 className="text-[1.2rem] py-8">Recent Albums</h2>
        <div className="flex justify-evenly mb-40">
          {albums.map((album) => (
            <Album album={album} key={album.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
