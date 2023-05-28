import { artistIDState } from "@/atoms/artistAtom";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Song from "./Song";

export default function Artist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const artistID = useRecoilValue(artistIDState);
  const [artist, setArtist] = useState();
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [seeMore, setSeeMore] = useState(false);

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
        h-80 text-white p-8`}
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
            <div className="flex flex-col" key={album.id}>
              <img
                className="w-24 h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 mb-2"
                src={album.images[0].url}
                alt=""
              />
              <p className="text-sm lg:text-base text-center">{album.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
