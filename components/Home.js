import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  useEffect(() => {
    if (session) {
      spotifyApi.getMyTopArtists().then((data) => {
        setTopArtists(data.body.items?.slice(0, 4));
      });
      spotifyApi.getFeaturedPlaylists().then((data) => {
        setFeaturedPlaylists(data.body.playlists.items?.slice(0, 4));
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="flex flex-col text-white p-12 pt-36 h-screen overflow-y-scroll scrollbar-hide">
      <h1 className="text-3xl md:text-4xl mb-16 md:mb-20 xl:mb-24">
        Welcome back {session?.user?.name}
      </h1>
      <div className="mb-12">
        <h2 className="text-lg md:text-2xl mb-4 md:mb-8">Your Top Artists</h2>
        <div className="flex justify-evenly">
          {topArtists?.map((artist) => (
            <div
              className="flex flex-col items-center space-y-4"
              key={artist.id}
            >
              <img
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full"
                src={artist.images[0].url}
                alt=""
              />
              <p className="text-sm md:text-base lg:text-lg">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg md:text-2xl mb-4 md:mb-8">Featured Playlists</h2>
        <div className="flex justify-evenly">
          {featuredPlaylists?.map((playlist) => (
            <div
              className="flex flex-col items-center space-y-4"
              key={playlist.id}
            >
              <img
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40"
                src={playlist.images[0].url}
                alt=""
              />
              <p
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40
               truncate text-center text-sm md:text-base lg:text-lg"
              >
                {playlist.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
