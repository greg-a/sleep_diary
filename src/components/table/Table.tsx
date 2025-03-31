import { ReactNode, useState } from "react";
import LockIcon from "../../assets/lock-keyhole-minimalistic-svgrepo-com.svg";
import UnlockIcon from "../../assets/lock-keyhole-minimalistic-unlocked-svgrepo-com.svg";
import DeleteIcon from "../../assets/delete-svgrepo-com.svg";
import "./table.css";

export interface Column<T> {
  header: string;
  field: keyof T | string;
  accessor?: (d: T) => string | number;
  body?: ReactNode | Function;
  editBody?: ReactNode | Function;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onDelete?: (row: T) => void;
  onEdit?: (row: T) => void;
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

export const Table = <T extends { id: string }>({
  columns,
  data,
  onDelete,
  onEdit,
}: Props<T>) => {
  const [editRows, setEditRows] = useState<string[]>([]);
  const handleEdit = (rowData: T) => {
    if (editRows.includes(rowData.id)) {
      onEdit?.(rowData);
      setEditRows((prev) => prev.filter((row) => row !== rowData.id));
    } else {
      setEditRows((prev) => [...prev, rowData.id]);
    }
  };
  const renderBody = (col: Column<T>, rowData: any) => {
    const renderBody: ReactNode | Function =
      editRows.includes(rowData.id) && !!col.editBody ? col.editBody : col.body;

    if (!renderBody) {
      return formatterFn(rowData[col.field]);
    }
    if (renderBody instanceof Function) {
      return renderBody(rowData);
    } else {
      return renderBody;
    }
  };
  return (
    <table className="main-table">
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
                <td key={String(col.field)}>{renderBody(col, row)}</td>
              ))}
              {(!!onEdit || !!onDelete) && (
                <td>
                  {!!onEdit && (
                    <button onClick={() => handleEdit(row)}>
                      <img
                        src={editRows.includes(row.id) ? UnlockIcon : LockIcon}
                        height={18}
                        width={18}
                      />
                    </button>
                  )}
                  {!!onDelete && (
                    <button onClick={() => onDelete(row)}>
                      <img src={DeleteIcon} height={18} width={18} />
                    </button>
                  )}
                </td>
              )}
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
