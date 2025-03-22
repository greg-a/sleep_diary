export interface Entry {
  text: string;
  id: number | string;
}

interface Props {
  entries: Entry[];
}

export const EntryList = ({ entries }: Props) => {
  return (
    <ul>
      {entries.map(({text, id}) => (
        <li key={id}>{text}</li>
      ))}
    </ul>
  );
};
