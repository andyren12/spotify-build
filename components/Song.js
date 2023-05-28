import { artistIDState } from "@/atoms/artistAtom";
import { displayState } from "@/atoms/displayAtom";
import { currentTrackIDState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/utils/time";
import { useRecoilState } from "recoil";

export default function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackID, setCurrentTrackID] =
    useRecoilState(currentTrackIDState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [display, setDisplay] = useRecoilState(displayState);
  const [artistID, setArtistID] = useRecoilState(artistIDState);

  const playSong = () => {
    setCurrentTrackID(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg">
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        {display !== "album" && (
          <img
            className="h-10 w-10"
            src={track.album?.images?.[0].url}
            alt=""
          />
        )}
        <div className="cursor-pointer">
          <p
            className="w-64 md:w-36 lg:w-64 text-white truncate"
            onClick={playSong}
          >
            {track.name}
          </p>
          <p
            className="w-40"
            onClick={() => {
              setDisplay("artist");
              setArtistID(track.artists[0].id);
            }}
          >
            {track.artists[0].name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.album?.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
}
