import { proxy, useSnapshot } from "valtio";

const loadStates = proxy({
  isLoadModalOpen: false,
});

const useLoadQuery = () => {
  const snapshot = useSnapshot(loadStates);

  const onOpenLoadModal = () => {
    loadStates.isLoadModalOpen = true;
  };

  const onCloseLoadModal = () => {
    loadStates.isLoadModalOpen = false;
  };

  return {
    ...snapshot,
    onOpenLoadModal,
    onCloseLoadModal,
  };
};

export default useLoadQuery;
