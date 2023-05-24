const { useSession, signIn } = require("next-auth/react");
const { useEffect } = require("react");
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

export default function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }
    }
    spotifyApi.setAccessToken(session?.user.accessToken);
  }, [session]);

  return spotifyApi;
}
