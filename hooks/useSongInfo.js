import { useRecoilState } from "recoil";
import useSpotify from "./useSpotify";
import { currentTrackIDState } from "@/atoms/songAtom";
import { useEffect, useState } from "react";

export default function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackID, setCurrentTrackID] =
    useRecoilState(currentTrackIDState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackID) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackID}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentTrackID, spotifyApi]);
  return songInfo;
}
