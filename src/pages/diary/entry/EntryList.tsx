import DeleteIcon from "../../../assets/delete-svgrepo-com.svg";
import { Table } from "../../../components/table/Table";
import { deleteEntry } from "../../../db/entries";

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
          header: "",
          field: "",
          body: (entry: Entry) => (
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          ),
        },
      ]}
      data={entries}
    />
  );
};
