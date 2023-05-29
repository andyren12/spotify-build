import { currentTrackIDState, isPlayingState } from "@/atoms/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import {
  ArrowPathRoundedSquareIcon,
  BackwardIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { displayState } from "@/atoms/displayAtom";
import { artistIDState } from "@/atoms/artistAtom";
import { albumIDState } from "@/atoms/albumAtom";

export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackID, setCurrentTrackID] =
    useRecoilState(currentTrackIDState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const setDisplay = useSetRecoilState(displayState);
  const setArtistID = useSetRecoilState(artistIDState);
  const setAlbumID = useSetRecoilState(albumIDState);

  const songInfo = useSongInfo();

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    const fetchCurrentSong = () => {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setCurrentTrackID(data.body?.item?.id);
          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setIsPlaying(data.body?.is_playing);
          });
        });
      }
    };

    if (spotifyApi.getAccessToken() && !currentTrackID) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [
    currentTrackID,
    spotifyApi,
    session,
    songInfo,
    setCurrentTrackID,
    setIsPlaying,
  ]);

  const debouncedAdjustVolume = useMemo(
    () =>
      debounce((volume) => {
        spotifyApi.setVolume(volume);
      }, 200),
    [spotifyApi]
  );

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

  const handleSkip = () => {
    spotifyApi.skipToNext().then(() => {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackID(data.body?.item?.id);
        setIsPlaying(true);
      });
    });
  };

  const handleRewind = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      if (data.body?.progress_ms > 5000) {
        spotifyApi.seek(0);
      } else {
        spotifyApi.skipToPrevious().then(() => {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            setCurrentTrackID(data.body?.item?.id);
            setIsPlaying(true);
          });
        });
      }
    });
  };

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 
    text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3
            className="mb-0.5 text-sm hover:underline cursor-pointer"
            onClick={() => {
              setDisplay("album");
              setAlbumID(songInfo.album.id);
            }}
          >
            {songInfo?.name}
          </h3>
          <p
            className="text-gray-200 text-xs hover:underline cursor-pointer"
            onClick={() => {
              setDisplay("artist");
              setArtistID(songInfo.artists?.[0]?.id);
            }}
          >
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon className="button" onClick={handleRewind} />
        {isPlaying ? (
          <PauseCircleIcon
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayCircleIcon
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        )}
        <ForwardIcon className="button" onClick={handleSkip} />
        <ArrowPathRoundedSquareIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end">
        <SpeakerXMarkIcon
          onClick={() => volume > 0 && setVolume(0)}
          className="button"
        />
        <input
          className="w-20 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}
