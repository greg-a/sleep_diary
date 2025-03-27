import DeleteIcon from "../../../assets/delete-svgrepo-com.svg";
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
    <ul style={{padding: 0}}>
      {entries.map(({ text, startTime, id }) => (
        <li
          key={id}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>
            {startTime.toLocaleString()} - {text}
          </span>
          <button style={{ padding: 0 }} onClick={() => handleDelete(id)}>
            <img src={DeleteIcon} height={24} width={24} />
          </button>
        </li>
      ))}
    </ul>
  );
};
