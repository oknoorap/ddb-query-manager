import { useCallback } from "react";
import { proxy, useSnapshot } from "valtio";

const saveStates = proxy({
  isSaveModalOpen: false,
});

const DDB_QUERY_MANAGER_QUERIES_KEY = "DDB_QUERY_MANAGER_QUERIES";

const useSaveQuery = () => {
  const snapshot = useSnapshot(saveStates);

  const onOpenSaveModal = () => {
    saveStates.isSaveModalOpen = true;
  };

  const onCloseSaveModal = () => {
    saveStates.isSaveModalOpen = false;
  };

  const getQueryData = useCallback(async (): Promise<
    { table: string; values: object } | undefined
  > => {
    // It's isolated world we can't get actual DOM properties
    // Solution: https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("/get-scan-or-queries.js");
      script.onload = () => {
        let intervalCount = 0;
        const interval = setInterval(() => {
          const queriesJSON = localStorage.getItem(
            DDB_QUERY_MANAGER_QUERIES_KEY
          );

          if (queriesJSON) {
            let queries = [];

            try {
              queries = JSON.parse(queriesJSON);
            } catch (err) {
              console.error("Error: ", err);
            } finally {
              script.remove();
              localStorage.removeItem(DDB_QUERY_MANAGER_QUERIES_KEY);
              resolve(queries);
              clearInterval(interval);
            }
          }

          if (intervalCount >= 100000) {
            clearInterval(interval);
            resolve(undefined);
          }
        }, 50);
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }, []);

  return {
    ...snapshot,
    onOpenSaveModal,
    onCloseSaveModal,
    getQueryData,
  };
};

export default useSaveQuery;
