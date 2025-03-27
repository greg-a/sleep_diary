import { Entry } from "../pages/diary/entry/EntryList";

const dbName = "sleep_diary";
enum Stores {
  Entries = "entries",
}

// let request: IDBOpenDBRequest | undefined = undefined;
// let db: IDBDatabase | undefined = undefined;
let version = 1;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    let db: IDBDatabase;
    const request = indexedDB.open(dbName);

    request.onupgradeneeded = () => {
      db = request?.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Entries)) {
        console.log("Creating users store");
        db?.createObjectStore(Stores.Entries, { keyPath: "id" });
      }
      db.close();
      // no need to resolve hereÏ
    };

    request.onsuccess = () => {
      console.log({ db, request });
      db = request.result;
      version = db!.version;
      console.log("request.onsuccess - initDB", version);
      db.close();
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addEntry = (data: Entry): Promise<Entry | string | null> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      db = request.result;
      const tx = db.transaction(Stores.Entries, "readwrite");
      const store = tx.objectStore(Stores.Entries);
      store.add(data);
      db.close();
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
      db.close();
    };
  });
};

export const getAllEntries = (): Promise<Entry[]> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName);

    request.onsuccess = () => {
      console.log("request.onsuccess - getAllData");
      db = request.result;
      const tx = db.transaction(Stores.Entries, "readonly");
      const store = tx.objectStore(Stores.Entries);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
      db.close();
    };
  });
};
