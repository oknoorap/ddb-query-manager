import { useCallback } from "react";
import { proxy, useSnapshot } from "valtio";

const loadStates = proxy({
  isLoadModalOpen: false,
});

const DDB_QM_CURRENT_LOAD_KEY = "DDB_QM_CURRENT_LOAD_KEY";
const DDB_QM_CURRENT_LOAD_JSON = "DDB_QM_CURRENT_LOAD_JSON";
const DDB_QM_CURRENT_LOAD_STATUS = "DDB_QM_CURRENT_LOAD_STATUS";

const useLoadQuery = () => {
  const snapshot = useSnapshot(loadStates);

  const onOpenLoadModal = () => {
    loadStates.isLoadModalOpen = true;
  };

  const onCloseLoadModal = () => {
    loadStates.isLoadModalOpen = false;
  };

  const loadQuery = useCallback(async (key?: string): Promise<boolean> => {
    // It's isolated world we can't get actual DOM properties
    // Solution: https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
    return new Promise((resolve) => {
      if (key) {
        const loadedQuery = localStorage.getItem(key);
        if (!loadedQuery) return;
        localStorage.setItem(DDB_QM_CURRENT_LOAD_KEY, key);
      } else {
        localStorage.setItem(DDB_QM_CURRENT_LOAD_JSON, "true");
      }

      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("/load-data.js");
      script.onload = () => {
        let intervalCount = 0;
        const interval = setInterval(() => {
          const isLoaded = localStorage.getItem(DDB_QM_CURRENT_LOAD_STATUS);
          if (isLoaded || intervalCount >= 100000) {
            script.remove();
            localStorage.removeItem(DDB_QM_CURRENT_LOAD_KEY);
            localStorage.removeItem(DDB_QM_CURRENT_LOAD_JSON);
            localStorage.removeItem(DDB_QM_CURRENT_LOAD_STATUS);
            resolve(true);
            clearInterval(interval);
          }

          intervalCount++;
        }, 50);
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }, []);

  return {
    ...snapshot,
    onOpenLoadModal,
    onCloseLoadModal,
    loadQuery,
  };
};

export default useLoadQuery;
