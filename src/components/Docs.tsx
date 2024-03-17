import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function Docs() {
  console.log("📄📄📄📄📄Docs Rended📄📄📄📄📄");
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  const [docs, setDocs] = useState([]);
  const [alldocs, setAlldocs] = useState([]);
  const [content, setContent] = useState("");

  console.log({ docs, alldocs });

  const loadDocs = async () => {
    try {
      const { data } = await axiosInstance.get("/docs-beta");
      setDocs(data.docs);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAllDocs = async () => {
    try {
      const { data } = await axiosInstance.get("/docs-beta/all");
      setAlldocs(data.docs);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.length > 0) {
      try {
        console.log({ content });
        await axiosInstance.post("/docs", { content });
        loadDocs();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        const token = await getToken();
        console.log({ token });
        axiosInstance.defaults.headers.common["Authorization"] = token;
      })();
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    loadDocs();
    loadAllDocs();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 0.5 }}>
          <h4>My Docs ({docs.length})</h4>
          {docs.map(
            (doc: {
              content: string;
              _id: string;
              user: { username: string };
            }) => (
              <p key={doc?._id}>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  {doc.user?.username || "undefined user"}:
                </span>{" "}
                {doc.content}
              </p>
            )
          )}
        </div>
        <div style={{ flex: 0.5 }}>
          <h4>All Docs ({docs.length})</h4>
          {alldocs.map(
            (doc: {
              content: string;
              _id: string;
              user: { username: string };
            }) => (
              <p key={doc?._id}>
                <span style={{ fontWeight: "bold" }}>
                  {doc.user?.username || "undefined user"}:
                </span>{" "}
                {doc.content}
              </p>
            )
          )}
        </div>
      </div>
      <div>
        <h6>Create a Doc</h6>
        <form
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
          onSubmit={onSubmit}
        >
          <input
            type="text"
            name="content"
            placeholder="Content"
            id="content_input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button disabled={content.length <= 0}>Create</button>
        </form>
      </div>
    </>
  );
}
