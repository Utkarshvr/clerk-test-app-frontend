import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import axiosInstance from "./utils/axiosInstance";
import PrivateInfo from "./components/PrivateInfo";

export default function App() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        const token = await getToken();
        axiosInstance.defaults.headers.common["Authorization"] = token;
      })();
    }
  }, [isSignedIn]);

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <PrivateInfo />
      </SignedIn>
    </header>
  );
}
