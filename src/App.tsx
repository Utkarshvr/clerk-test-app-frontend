import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import PrivateInfo from "./components/PrivateInfo";
import Docs from "./components/Docs";

export default function App() {
  console.log("APP RENDERED");
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <PrivateInfo />
        <Docs />
      </SignedIn>
    </header>
  );
}
