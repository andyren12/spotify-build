import { albumIDState } from "@/atoms/albumAtom";
import { artistIDState } from "@/atoms/artistAtom";
import { displayState } from "@/atoms/displayAtom";
import { recommendTrackState } from "@/atoms/recommendAtom";
import { currentTrackIDState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/utils/time";
import { useRecoilState, useSetRecoilState } from "recoil";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const setCurrentTrackID = useSetRecoilState(currentTrackIDState);
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const [display, setDisplay] = useRecoilState(displayState);
  const setArtistID = useSetRecoilState(artistIDState);
  const setAlbumID = useSetRecoilState(albumIDState);
  const setRecommendTrack = useSetRecoilState(recommendTrackState);
  const [ellipsisOpacity, setEllipsisOpacity] = useState("opacity-0");
  const [dropDownStyle, setDropDownStyle] = useState("hidden");

  const play = () => {
    setCurrentTrackID(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  const handleDropDown = () => {
    if (dropDownStyle === "hidden") {
      setDropDownStyle("inline");
    } else {
      setDropDownStyle("hidden");
    }
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg"
      onMouseOver={() => setEllipsisOpacity("opacity-1")}
      onMouseLeave={() => {
        setEllipsisOpacity("opacity-0");
        setDropDownStyle("hidden");
      }}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        {display !== "album" && (
          <img
            className="h-10 w-10 cursor-pointer"
            src={track.album?.images?.[0].url}
            alt=""
            onClick={play}
          />
        )}
        <div className="cursor-pointer">
          <p
            className="w-64 md:w-36 lg:w-64 text-white truncate"
            onClick={play}
          >
            {track.name}
          </p>
          <p
            className="w-40 hover:underline"
            onClick={() => {
              setDisplay("artist");
              setArtistID(track.artists[0].id);
            }}
          >
            {track.artists?.[0]?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p
          className="w-40 hidden md:inline hover:underline cursor-pointer"
          onClick={() => {
            setDisplay("album");
            setAlbumID(track.album.id);
          }}
        >
          {track.album?.name}
        </p>
        <div className="flex space-x-4">
          <div className="flex flex-col relative">
            <p className="justify-self-center">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </p>
            <div className={`${dropDownStyle} absolute top-6`}>
              <p
                className="text-sm cursor-pointer"
                onClick={() => {
                  setRecommendTrack((currentState) => [
                    ...currentState,
                    track.id,
                  ]);
                }}
              >
                Recommend
              </p>
            </div>
          </div>
          <button
            className={`${ellipsisOpacity} cursor-pointer z-50`}
            onClick={handleDropDown}
          >
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
