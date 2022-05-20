import { useCallback, useEffect, useState } from "react";

export type DDBQueryItem = {
  key: string;
  queryName: string;
  table: string;
  values: object;
};

const useSavedQueries = () => {
  const [savedQueries, setSavedQueries] = useState<DDBQueryItem[]>([]);

  const refetchLocalStorage = useCallback(() => {
    const data = { ...localStorage };
    const queryList = Object.keys(data).filter((key) =>
      key.includes("DDB_QUERY_")
    );

    setSavedQueries(
      queryList.map((key) => {
        let data = {};

        try {
          const item = localStorage.getItem(key);
          if (item) {
            data = JSON.parse(item);
          }
        } catch (err) {
          console.error(err);
        } finally {
          return {
            key,
            ...data,
          };
        }
      }) as DDBQueryItem[]
    );
  }, []);

  useEffect(() => {
    refetchLocalStorage();
  }, []);

  return {
    savedQueries,
    refetchLocalStorage,
  };
};

export default useSavedQueries;
