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
        db?.createObjectStore(Stores.Entries, { keyPath: "id" });
      }
      db.close();
      // no need to resolve hereÏ
    };

    request.onsuccess = () => {
      db = request.result;
      version = db!.version;
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
      db = request.result;
      const tx = db.transaction(Stores.Entries, "readwrite");
      const store = tx.objectStore(Stores.Entries);
      store.add(data);
      db.close();
      resolve(data);
    };
  });
};

export const updateEntry = (data: Entry): Promise<Entry | string | null> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName, version);
    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.Entries, "readwrite");
      const store = tx.objectStore(Stores.Entries);
      store.put(data);
      db.close();
      resolve(data);
    };
  });
};

export const getAllEntries = (): Promise<Entry[]> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName);

    request.onsuccess = () => {
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

export const deleteEntry = (key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // again open the connection
    let db: IDBDatabase;
    const request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.Entries, "readwrite");
      const store = tx.objectStore(Stores.Entries);
      const res = store.delete(key);

      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        resolve(false);
      };
      db.close();
    };
  });
};
