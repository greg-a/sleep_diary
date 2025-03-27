import { useEffect, useState } from "react";
import "./App.css";
import { Diary } from "./pages/diary/Diary";
import { initDB } from "./db/entries";

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const dbReady = await initDB();
      setIsLoading(!dbReady)
    })()
  }, []);
  return (
    <>
      {isLoading ? <p>Loading...</p> :
      <Diary />}
    </>
  );
};
