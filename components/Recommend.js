import {
  recommendAlbumState,
  recommendTrackState,
} from "@/atoms/recommendAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import { displayState } from "@/atoms/displayAtom";
import Search from "./Search";

export default function Recommend() {
  const spotifyApi = useSpotify();
  const [recommendedTracks, setRecommendedTracks] =
    useRecoilState(recommendTrackState);
  const [tracks, setTracks] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] =
    useRecoilState(recommendAlbumState);
  const [albums, setAlbums] = useState([]);
  const setDisplay = useSetRecoilState(displayState);

  useEffect(() => {
    setTracks([]);
    if (recommendedTracks.length <= 3) {
      recommendedTracks.forEach((track) => {
        spotifyApi.getTrack(track).then((data) => {
          setTracks((currentState) => [...currentState, data.body]);
        });
      });
    } else {
      setRecommendedTracks(recommendedTracks.slice(-3));
    }
  }, [recommendedTracks, setRecommendedTracks, spotifyApi]);

  useEffect(() => {
    setAlbums([]);
    if (recommendedAlbums.length <= 3) {
      recommendedAlbums.forEach((album) => {
        spotifyApi.getAlbum(album).then((data) => {
          setAlbums((currentState) => [...currentState, data.body]);
        });
      });
    } else {
      setRecommendedAlbums(recommendedAlbums.slice(-3));
    }
  }, [recommendedAlbums, setRecommendedAlbums, spotifyApi]);

  return (
    <div className="flex flex-col pt-28 justify-end space-y-4 px-8">
      <h1 className="text-2xl">Your Recommendations</h1>
      <section className="flex flex-col space-y-4 pt-8">
        <h2 className="text-[1.2rem]">Songs</h2>
        <div className="flex justify-evenly">
          {tracks.length !== 0 ? (
            tracks.map((track) => (
              <div key={track.id}>
                <img
                  className="w-32 h-32"
                  src={track.album?.images?.[0].url}
                  alt=""
                />
                <p className="w-32 text-sm text-center overflow-wrap">
                  {track.name}
                </p>
                <p className="text-center">{track.album?.artists?.[0]?.name}</p>
              </div>
            ))
          ) : (
            <div>No recommended tracks yet. Find songs to recommend.</div>
          )}
        </div>
      </section>
      <section className="flex flex-col space-y-4 py-8">
        <h2 className="text-[1.2rem]">Albums</h2>
        <div className="flex justify-evenly">
          {albums.length !== 0 ? (
            albums.map((album) => (
              <div key={album.id}>
                <img className="w-32 h-32" src={album.images?.[0].url} alt="" />
                <p className="w-32 text-sm text-center overflow-wrap">
                  {album.name}
                </p>
                <p className="text-center">{album.artists?.[0]?.name}</p>
              </div>
            ))
          ) : (
            <div>No recommended albums yet. Find albums to recommend.</div>
          )}
        </div>
      </section>
      <Search />
    </div>
  );
}
