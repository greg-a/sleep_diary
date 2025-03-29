import DeleteIcon from "../../../assets/delete-svgrepo-com.svg";
import { Table } from "../../../components/table/Table";
import { deleteEntry } from "../../../db/entries";
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

export const EntryList = ({ entries, onDelete }: Props) => {
  const handleDelete = async (entryId: string) => {
    const response = await deleteEntry(entryId);
    if (response) {
      onDelete(entryId);
    }
  };

  return (
    <Table
      columns={[
        { header: "Note", field: "text" },
        { header: "Start", field: "startTime" },
        { header: "End", field: "endTime" },
        {
          header: "Day",
          field: "startTime",
          body: (entry: Entry) => days[entry.startTime.getDay()],
        },
        {
          header: "Period",
          field: "startTime",
          body: (entry: Entry) =>
            entry.startTime.toLocaleString([], { dayPeriod: "long" }),
        },
        {
          header: "Duration",
          field: "duration",
          body: (entry: Entry) => getDuration(entry.startTime, entry.endTime),
        },
        {
          header: "",
          field: "",
          body: (entry: Entry) => (
            <button onClick={() => handleDelete(entry.id)}>
              <img src={DeleteIcon} height={18} width={18} />
            </button>
          ),
        },
      ]}
      data={entries}
    />
  );
};
