export interface Entry {
  startTime: Date;
  endTime?: Date;
  text: string;
  id: number | string;
}

interface Props {
  entries: Entry[];
}

export const EntryList = ({ entries }: Props) => {
  return (
    <ul>
      {entries.map(({text, startTime, id}) => (
        <li key={id}>{startTime.toLocaleDateString()} - {text}</li>
      ))}
    </ul>
  );
};
