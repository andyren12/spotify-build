import useSpotify from "@/hooks/useSpotify";
import { useState } from "react";
import Song from "./Song";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import { displayState } from "@/atoms/displayAtom";
import { albumIDState } from "@/atoms/albumAtom";
import Album from "./Album";

export default function Search() {
  const spotifyApi = useSpotify();
  const [input, setInput] = useState();
  const [tracks, setTracks] = useState();
  const [albums, setAlbums] = useState();
  const setDisplay = useSetRecoilState(displayState);
  const setAlbumID = useSetRecoilState(albumIDState);

  const handleSubmit = (e) => {
    e.preventDefault();
    spotifyApi.searchTracks(input).then((data) => {
      setTracks(data.body.tracks.items);
    });
    spotifyApi.searchAlbums(input).then((data) => {
      setAlbums(data.body.albums.items);
    });
  };

  return (
    <div>
      <section
        className="flex items-end justify-center space-x-7} 
        h-40 text-white p-8"
      >
        <form className="flex space-x-4" onSubmit={handleSubmit}>
          <input
            className="text-black rounded-full px-4 h-8"
            type="text"
            placeholder="search"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="relative right-12 text-black">
            <MagnifyingGlassIcon className="w-5 h-5" onClick={handleSubmit} />
          </button>
        </form>
      </section>
      <section className="px-8">
        {tracks && <h2 className="text-[1.2rem]">Songs</h2>}
        {tracks?.map((track, index) => (
          <Song track={track} order={index} key={track.id} />
        ))}
      </section>
      <section className="px-8 mb-40">
        {albums && <h2 className="text-[1.2rem] py-8">Albums</h2>}
        <div className="flex justify-evenly">
          {albums?.slice(0, 4).map((album) => (
            <Album album={album} key={album.id} />
          ))}
        </div>
        {(tracks || albums) && (
          <button
            className="mt-8 mb-40 float-right hover:text-gray-200"
            onClick={() => {
              setAlbums(null);
              setTracks(null);
            }}
          >
            Clear
          </button>
        )}
      </section>
    </div>
  );
}
