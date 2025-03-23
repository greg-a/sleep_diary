import { useState } from "react";
import "./diary.css";
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

const defaultNewEntry = {
  text: "",
  date: new Date(),
  id: "",
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const Diary = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>(defaultNewEntry);
  const submitEntry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newEntryTr = newEntry?.text.trim() ?? "";
    if (e.key === "Enter" && newEntryTr.length > 0) {
      setEntries((prev) => [
        ...prev,
        { text: newEntryTr, date: newEntry.date, id: uuidv4() },
      ]);
      setNewEntry({ ...defaultNewEntry, date: newEntry.date });
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(newEntry.date);
    const [year, month, day] = e.target.value.split("-");
    newDate.setFullYear(Number(year));
    newDate.setMonth(Number(month) - 1);
    newDate.setDate(Number(day));

    setNewEntry((prev) => ({ ...prev, date: newDate }));
  };
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
          label="Date"
          type="date"
          value={formatDate(newEntry.date)}
          onChange={handleDateChange}
        />
      </div>
      <EntryList entries={entries} />
    </>
  );
};
