import { atom } from "recoil";

export const recommendTrackState = atom({
  key: "recommendTrackState",
  default: [],
});

export const recommendAlbumState = atom({
  key: "recommendAlbumState",
  default: [],
});
