import { useState } from "react";
import { Input } from "../../components/input/input";
import { Entry, EntryList } from "./entry/EntryList";
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
export const Diary = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<string>("");
  const submitEntry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newEntryTr = newEntry.trim()
    if (e.key === "Enter" && newEntryTr.length > 0) {
      setEntries((prev) => [
        ...prev,
        { text: newEntryTr, id: uuidv4() },
      ]);
      setNewEntry("")
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry(e.target.value)
  }
  return (
    <>
      <h1>Sleep Diary</h1>
      <Input label="Description" onKeyDown={submitEntry} onChange={handleDescription} value={newEntry} />
      <EntryList entries={entries} />
    </>
  );
};
