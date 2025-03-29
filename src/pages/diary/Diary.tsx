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

const getDefaultNewEntry = (start?: Date, end?: Date): Entry => {
  const startTime = start ?? new Date();
  return {
    text: "",
    startTime,
    endTime: end ?? startTime,
    id: "",
  };
};

function formatDate(d: Date) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(d: Date) {
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

export const getDuration = (start: Date, end: Date | undefined) => {
  const durationStr = [];
  if (!end) {
    return "";
  }
  const startMs = start.getTime();
  const endMs = end.getTime();
  const duration = endMs - startMs;
  const seconds = duration / 1000;
  let minutes = seconds / 60;
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    durationStr.push(`${hours} hours`);
  }
  minutes = Math.floor(minutes % 60);
  if (minutes > 0) {
    durationStr.push(`${minutes} minutes`);
  }
  return durationStr.length > 0 ? durationStr.join(" ") : "0 minutes";
};

export const Diary = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>(getDefaultNewEntry());

  const submitEntry = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const descriptionTxt = newEntry?.text.trim() ?? "";
    if (e.key === "Enter" && descriptionTxt.length > 0) {
      const newEnt = {
        text: descriptionTxt,
        startTime: newEntry.startTime,
        endTime: newEntry.endTime,
        id: uuidv4(),
      };
      setEntries((prev) => [...prev, newEnt]);
      await addEntry(newEnt);
      setNewEntry(getDefaultNewEntry(newEntry.startTime, newEntry.endTime));
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id as "startTime" | "endTime";
    const newTime = new Date(newEntry[key] ?? newEntry.startTime);
    const [hours, minutes] = e.target.value.split(":");
    newTime.setHours(Number(hours));
    newTime.setMinutes(Number(minutes));

    setNewEntry((prev) => ({
      ...prev,
      [key]: newTime,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const newStart = new Date(newEntry.startTime);
    newStart.setFullYear(newDate.getFullYear());
    newStart.setMonth(newDate.getMonth());
    newStart.setDate(newDate.getDate() + 1);
    const newEnd = new Date(newEntry.endTime ?? newEntry.startTime);
    newEnd.setFullYear(newDate.getFullYear());
    newEnd.setMonth(newDate.getMonth());
    newEnd.setDate(newDate.getDate() + 1);
    setNewEntry((prev) => ({ ...prev, startTime: newStart, endTime: newEnd }));
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  useEffect(() => {
    (async () => {
      const entries = await getAllEntries();
      setEntries(entries);
    })();
  }, []);

  return (
    <>
      <h1>Sleep Diary</h1>
      <div style={{ width: "fit-content" }}>
        <Input
          label="Date"
          type="date"
          value={formatDate(newEntry.startTime)}
          onChange={handleDateChange}
        />
      </div>
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
          type="time"
          value={formatTime(newEntry.startTime)}
          onChange={handleTimeChange}
        />
        <Input
          label="End Time"
          name="endTime"
          type="time"
          value={formatTime(newEntry.endTime ?? newEntry.startTime)}
          onChange={handleTimeChange}
        />
        <Input
          label="Duration"
          readOnly
          value={getDuration(newEntry.startTime, newEntry.endTime)}
        />
      </div>
      <EntryList entries={entries} onDelete={handleDeleteEntry} />
    </>
  );
};
