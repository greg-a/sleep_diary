import { ReactNode } from "react";
import "./table.css";

export interface Column<T> {
  header: string;
  field: keyof T | string;
  accessor?: (d: T) => string | number;
  body?: ReactNode | Function;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
}

const formatterFn = (value: any): string | number => {
  if (["string", "number"].includes(typeof value)) {
    return value;
  }
  if (value instanceof Date) {
    return value.toLocaleString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "";
};

const renderBody = (body: ReactNode | Function, rowData: any) => {
  if (body instanceof Function) {
    return body(rowData);
  } else {
    return <body />;
  }
};

const renderValue = (rowData: any, field: string | number | symbol) => {
  if (field in rowData) {
    return formatterFn(rowData[field]);
  }
};

export const Table = <T extends { id: string }>({
  columns,
  data,
}: Props<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th align="left" key={String(col.field)}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.field)}>
                  {col.body
                    ? renderBody(col.body, row)
                    : renderValue(row, col.field)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td align="center" colSpan={100} style={{ padding: 20 }}>
              no entries
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
