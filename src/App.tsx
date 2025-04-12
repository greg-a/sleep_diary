import { useEffect, useState } from "react";
import "./App.css";
import { Diary } from "./pages/diary/Diary";
import { addEntry, deleteAllEntries, initDB } from "./db/entries";
import { getMockDayEntries } from "./util/mockEntry";

const MOCK_ENTRIES = true;

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const dbReady = await initDB();
      setIsLoading(!dbReady);
      if (MOCK_ENTRIES) {
        await deleteAllEntries();
        const mockEntries = getMockDayEntries(10, 5);
        mockEntries.forEach((entry) => addEntry(entry));
      }
    })();
  }, []);
  return <>{isLoading ? <p>Loading...</p> : <Diary />}</>;
};
