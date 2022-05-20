import type { FC } from "react";
import { useCallback } from "react";

import SaveButton, { SaveLocation } from "./SaveButton";
import SaveModal from "./SaveModal";
import useSaveQuery from "./useSaveQuery";

type SaveQueryProps = {
  onSaveItem?: () => void;
};

const SaveQuery: FC<SaveQueryProps> = ({ onSaveItem }) => {
  const { isSaveModalOpen, onOpenSaveModal, onCloseSaveModal, getQueryData } =
    useSaveQuery();

  const handleSaveToStorage = async (queryName: string) => {
    try {
      const storageKey = `DDB_QUERY_${btoa(queryName)}`.toUpperCase();
      const queries = await getQueryData();
      localStorage.setItem(
        storageKey,
        JSON.stringify({ queryName, ...queries })
      );
      onSaveItem?.();
    } catch (err) {
      console.error(err);
    } finally {
      onCloseSaveModal();
    }
  };

  const handleSaveToData = async () => {
    const now = new Date().toISOString();
    const fileName = `aws-ddb-${now}.json`;
    const queries = await getQueryData();
    const data = JSON.stringify(queries, null, 2);
    const linkDownloader = document.createElement("a");
    const blob = new Blob([data], { type: "octet/stream" });
    const blobURL = window.URL.createObjectURL(blob);
    linkDownloader.setAttribute("href", blobURL);
    linkDownloader.setAttribute("download", fileName);
    linkDownloader.click();
  };

  const onSaveButtonClick = (location: SaveLocation) => {
    switch (location) {
      default:
      case SaveLocation.Storage:
        onOpenSaveModal();
        break;

      case SaveLocation.JSON:
        handleSaveToData();
        break;
    }
  };

  return (
    <>
      <SaveButton onClick={onSaveButtonClick} />
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={onCloseSaveModal}
        onSave={handleSaveToStorage}
      />
    </>
  );
};

export default SaveQuery;
