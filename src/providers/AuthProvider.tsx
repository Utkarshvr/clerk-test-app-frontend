import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded } = useUser();
  const [triedToSetToken, setTriedToSetToken] = useState(false);
  console.log({ isSignedIn, isLoaded, triedToSetToken });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      (async () => {
        const token = await getToken();
        console.log("🪙🪙Adding Token🪙🪙");
        axiosInstance.defaults.headers.common["Authorization"] = token;
        setTriedToSetToken(true);
      })();
    }
    if (isLoaded && isSignedIn === false) return setTriedToSetToken(true);
  }, [isSignedIn, getToken, isLoaded]);

  if (!isLoaded && !triedToSetToken) return null;

  if (isLoaded && triedToSetToken) {
    console.log("Children will be returned now");
    return <>{children}</>;
  }
}
