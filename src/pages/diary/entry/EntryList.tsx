import { useState } from "react";
import { Input } from "../../../components/input/input";
import { Table } from "../../../components/table/Table";
import { deleteEntry, updateEntry } from "../../../db/entries";
import { getDuration } from "../Diary";

export interface Entry {
  startTime: Date;
  endTime?: Date;
  text: string;
  id: string;
}

interface Props {
  entries: Entry[];
  onDelete: (id: string) => void;
  onUpdateEntry: (entry: Entry) => void;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDateTime(d: Date) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export const EntryList = ({ entries, onDelete, onUpdateEntry }: Props) => {
  const [updatingEntries, setUpdatingEntries] = useState<Record<string, Entry>>(
    {}
  );

  const handleDelete = async (entry: Entry) => {
    const response = await deleteEntry(entry.id);
    if (response) {
      onDelete(entry.id);
    }
  };

  const handleEdit = async (entry: Entry) => {
    const updatedEntry = updatingEntries[entry.id];
    if (updatedEntry) {
      const response = await updateEntry(updatedEntry);
      if (response) {
        onUpdateEntry(updatedEntry);
      }
    }
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    entry: Entry
  ) => {
    const { value, id } = e.target;
    const updatingEntry: Entry = {
      ...entry,
      ...updatingEntries[entry.id],
      [id]: value,
    };
    setUpdatingEntries((prev) => ({ ...prev, [entry.id]: updatingEntry }));
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={[
          {
            header: "Note",
            field: "text",
            editBody: (entry: Entry) => (
              <Input
                name="text"
                value={updatingEntries[entry.id]?.text ?? entry.text}
                onChange={(e) => handleUpdateChange(e, entry)}
              />
            ),
          },
          {
            header: "Start",
            field: "startTime",
            editBody: (entry: Entry) => (
              <Input
                name="startTime"
                value={formatDateTime(
                  updatingEntries[entry.id]?.startTime ?? entry.startTime
                )}
                type="datetime-local"
                onChange={console.log} // todo
              />
            ),
          },
          {
            header: "End",
            field: "endTime",
            editBody: (entry: Entry) => (
              <Input
                value={formatDateTime(
                  updatingEntries[entry.id]?.endTime ?? entry.endTime!
                )}
                type="datetime-local"
                onChange={console.log} // todo
              />
            ),
          },
          {
            header: "Day",
            field: "day",
            body: (entry: Entry) => days[entry.startTime.getDay()],
          },
          {
            header: "Period",
            field: "period",
            body: (entry: Entry) =>
              entry.startTime.toLocaleString([], { dayPeriod: "long" }),
          },
          {
            header: "Duration",
            field: "duration",
            body: (entry: Entry) => getDuration(entry.startTime, entry.endTime),
          },
        ]}
        data={entries.sort(function (a, b) {
          const compareStart = a.startTime.getTime() - b.startTime.getTime();
          if (compareStart === 0) {
            return (
              (a.endTime ?? a.startTime).getTime() -
              (b.endTime ?? b.startTime).getTime()
            );
          }
          return compareStart;
        })}
      />
    </div>
  );
};
