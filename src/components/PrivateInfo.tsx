import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

type ClerkProfileType = {
  // Define the structure of your user object here
  // For example, if user has an ID, you can define it like this:
  clerkID: string | null;

  username: string | null;

  fullName: string | null;

  firstName: string | null;
  lastName: string | null;

  hasPicture: boolean | null;
  picture: string | null;

  isEmailVerified: boolean | null;
  primaryEmail: string | null;

  phoneNumber: number | null;
};

type MongoProfileType = {
  // Define the structure of your user object here
  // For example, if user has an ID, you can define it like this:
  clerkID: string | null;
  username: string | null;
  email: string | null;
  picture: string | null;
};

export default function PrivateInfo() {
  const [clerkProfile, setClerkProfile] = useState<ClerkProfileType | null>(
    null
  );
  const [mongoProfile, setMongoProfile] = useState<MongoProfileType | null>(
    null
  );

  const getClerkProfile = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/private-resources/clerk-profile"
      );
      setClerkProfile(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const getMongoDBProfile = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/private-resources/mongodb-profile"
      );
      setMongoProfile(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <h2>Fetch a private resource</h2>
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button onClick={getClerkProfile}>Get Clerk profile</button>
        <button onClick={getMongoDBProfile}>Get Mongo DB profile</button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {clerkProfile && (
          <div style={{ flex: 0.5 }}>
            <h4>MongoDB Profile: </h4>
            <ul>
              <li>Username: {clerkProfile.username}</li>
              <li>Full Name: {clerkProfile.fullName}</li>
              <li>Email: {clerkProfile.primaryEmail}</li>
            </ul>
          </div>
        )}
        {mongoProfile && (
          <div style={{ flex: 0.5 }}>
            <h4>MongoDB Profile: </h4>
            <ul>
              <li>Username: {mongoProfile.username}</li>
              <li>Email: {mongoProfile.email}</li>
              {mongoProfile.picture && (
                <img
                  src={mongoProfile.picture}
                  width={36}
                  height={36}
                  style={{ borderRadius: 9999 }}
                  alt="image"
                />
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
