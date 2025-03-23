export interface Entry {
  date: Date;
  text: string;
  id: number | string;
}

interface Props {
  entries: Entry[];
}

export const EntryList = ({ entries }: Props) => {
  return (
    <ul>
      {entries.map(({text, date, id}) => (
        <li key={id}>{date.toLocaleDateString()} - {text}</li>
      ))}
    </ul>
  );
};
