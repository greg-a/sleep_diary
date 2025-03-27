import { useEffect, useState } from "react";
import "./diary.css";
import { Input } from "../../components/input/input";
import { Entry, EntryList } from "./entry/EntryList";
import { addEntry, getAllEntries } from "../../db/entries";

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

const getDefaultNewEntry = (date?: Date): Entry => {
  const currentDatetime = date ?? new Date();
  return {
    text: "",
    startTime: currentDatetime,
    endTime: currentDatetime,
    id: "",
  };
};

function formatDate(d: Date) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

export const Diary = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>(getDefaultNewEntry());

  const submitEntry = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const descriptionTxt = newEntry?.text.trim() ?? "";
    if (e.key === "Enter" && descriptionTxt.length > 0) {
      const newEnt = {
        text: descriptionTxt,
        startTime: newEntry.startTime,
        id: uuidv4(),
      };
      setEntries((prev) => [...prev, newEnt]);
      await addEntry(newEnt);
      setNewEntry(getDefaultNewEntry(newEntry.startTime));
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry((prev) => ({
      ...prev,
      [e.target.id]: new Date(e.target.value),
    }));
  };

  useEffect(() => {
    (async () => {
      const entries = await getAllEntries();
      setEntries(entries)
    })()
  }, []);
  return (
    <>
      <h1>Sleep Diary</h1>
      <div className="form-container">
        <Input
          label="Description"
          onKeyDown={submitEntry}
          onChange={handleDescription}
          value={newEntry.text}
          autoFocus
        />
        <Input
          label="Start Time"
          name="startTime"
          type="datetime-local"
          value={formatDate(newEntry.startTime)}
          onChange={handleDateChange}
        />
        <Input
          label="End Time"
          name="endTime"
          type="datetime-local"
          value={formatDate(newEntry.endTime ?? newEntry.startTime)}
          onChange={handleDateChange}
        />
      </div>
      <EntryList entries={entries} />
    </>
  );
};
