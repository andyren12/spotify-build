import { albumIDState } from "@/atoms/albumAtom";
import { displayState } from "@/atoms/displayAtom";
import { useSetRecoilState } from "recoil";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { recommendAlbumState } from "@/atoms/recommendAtom";

export default function Album(album) {
  const setDisplay = useSetRecoilState(displayState);
  const setAlbumID = useSetRecoilState(albumIDState);
  const setRecommendAlbum = useSetRecoilState(recommendAlbumState);
  const [ellipsisOpacity, setEllipsisOpacity] = useState("hidden");
  const [dropDownStyle, setDropDownStyle] = useState("hidden");

  const handleDropDown = () => {
    if (dropDownStyle === "hidden") {
      setDropDownStyle("inline");
    } else {
      setDropDownStyle("hidden");
    }
  };

  return (
    <div
      className="relative flex flex-col cursor-pointer"
      onMouseOver={() => setEllipsisOpacity("opacity-1")}
      onMouseLeave={() => {
        setEllipsisOpacity("opacity-0");
        setDropDownStyle("hidden");
      }}
    >
      <button
        className={`${ellipsisOpacity} absolute left-[4.5rem] md:left-[5.5rem] lg:left-[7.5rem] xl:left-[9.5rem] cursor-pointer z-50`}
        onClick={handleDropDown}
      >
        <EllipsisVerticalIcon className="w-8 h-8" />
      </button>
      <img
        className="relative w-24 h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 mb-2"
        src={album.album.images[0].url}
        alt=""
        onClick={() => {
          setDisplay("album");
          setAlbumID(album.album.id);
        }}
      />
      <div
        className={`${dropDownStyle} absolute right-0 top-8 px-1 bg-gray-800 z-50
      text-sm`}
        onClick={() => {
          setRecommendAlbum((currentState) => [
            ...currentState,
            album.album.id,
          ]);
        }}
      >
        Recommend
      </div>
      <p
        className="w-24 md:w-28 lg:w-36 text-sm lg:text-base text-center truncate"
        onClick={() => {
          setDisplay("album");
          setAlbumID(album.album.id);
        }}
      >
        {album.album.name}
      </p>
    </div>
  );
}
