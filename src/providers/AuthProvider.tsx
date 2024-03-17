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
  const [isTokenSet, setIsTokenSet] = useState(false);
  console.log({ isSignedIn, isLoaded, isTokenSet });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      (async () => {
        const token = await getToken();
        console.log("🪙🪙Adding Token🪙🪙");
        axiosInstance.defaults.headers.common["Authorization"] = token;
        setIsTokenSet(true);
      })();
    }
  }, [isSignedIn, getToken, isLoaded]);

  if (!isLoaded && !isTokenSet) return null;

  if (isLoaded && isTokenSet) {
    console.log("Children will be returned now");
    return <>{children}</>;
  }
}
