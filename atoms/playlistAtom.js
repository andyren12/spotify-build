import { atom } from "recoil";

export const playlistIDState = atom({
  key: "playlistIDState",
  default: "5WlpojFpgARHWCrP6GZW6Y",
});

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

export const trackState = atom({
  key: "trackState",
  default: null,
});
