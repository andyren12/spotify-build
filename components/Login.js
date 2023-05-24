"use client";

import { getProviders, signIn } from "next-auth/react";
import { use } from "react";
import Image from "next/image";
import SpotifyLogo from "@/public/spotify.svg";

export default function Login() {
  const providers = use(getProviders());
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <Image
        className="w-52 mb-5"
        src={SpotifyLogo}
        alt=""
        placeholder=""
        blurDataURL={SpotifyLogo}
      />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => {
              signIn(provider.id, {
                callbackUrl: "/dashboard",
              });
            }}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}
