import type { FC } from "react";

import LoadButton, { LoadLocation } from "./LoadButton";
import LoadModal from "./LoadModal";
import useLoadQuery from "./useLoadQuery";
import { DDBQueryItem } from "../../hooks/useData";

type LoadQueryProps = {
  items: DDBQueryItem[];
  onRemoveItem?: () => void;
};

const LoadQuery: FC<LoadQueryProps> = ({ items, onRemoveItem }) => {
  const { isLoadModalOpen, onOpenLoadModal, onCloseLoadModal, loadQuery } =
    useLoadQuery();

  const onLoadFromStorage = async (key: string) => {
    await loadQuery(key);
    onCloseLoadModal();
  };

  const onRemoveFromStorage = (key?: string) => {
    if (!key) return;

    const isExists = localStorage.getItem(key);
    if (isExists) {
      localStorage.removeItem(key);
      onRemoveItem?.();
    }
  };

  const onOpenFromFile = async () => {
    const json = {};
    await loadQuery();
  };

  const onLoadButtonClick = (location: LoadLocation) => {
    switch (location) {
      default:
      case LoadLocation.Storage:
        onOpenLoadModal();
        break;

      case LoadLocation.JSON:
        onOpenFromFile();
        break;
    }
  };

  return (
    <>
      <LoadButton onClick={onLoadButtonClick} />
      <LoadModal
        items={items}
        isOpen={isLoadModalOpen}
        onClose={onCloseLoadModal}
        onLoad={onLoadFromStorage}
        onRemove={onRemoveFromStorage}
      />
    </>
  );
};

export default LoadQuery;
