import { FC, PropsWithChildren, useEffect } from "react";
import { useState, useMemo } from "react";
import Modal from "@awsui/components-react/modal";
import Input from "@awsui/components-react/input";
import Button from "@awsui/components-react/button";
import Table from "@awsui/components-react/table";
import Box from "@awsui/components-react/box";
import Alert from "@awsui/components-react/alert";
import Fuse from "fuse.js";

import { DDBQueryItem } from "../../hooks/useData";

type DDBQueryManagerTable = DDBQueryItem[];

type LoadModalProps = PropsWithChildren<{
  items: DDBQueryManagerTable;
  isOpen?: boolean;
  onClose?: () => void;
  onLoad?: (key: string) => void;
  onRemove?: (key?: string) => void;
}>;

const LoadModal: FC<LoadModalProps> = ({
  isOpen = false,
  onClose = () => null,
  onLoad = () => null,
  onRemove = () => null,
  items = [],
}) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredList = useMemo(() => {
    if (!searchValue) {
      return items;
    }

    const fuse = new Fuse(items, {
      threshold: 0.5,
      distance: 40,
      useExtendedSearch: true,
      keys: ["queryName"],
    });

    return fuse.search(searchValue).map((result) => result.item);
  }, [searchValue, items]);

  const isItemsEmpty = useMemo(() => items.length === 0, [items]);

  const isSearchNotFound = useMemo(
    () => searchValue.length >= 1 && filteredList.length === 0,
    [searchValue, filteredList]
  );

  const [isRemoveConfirmationVisible, setRemoveConfirmationVisibility] =
    useState(false);

  const [removeKey, setRemoveKey] = useState<string>();

  const removeItemName = useMemo(
    () => items.find((item) => item.key === removeKey)?.queryName ?? "ERR",
    [items, removeKey]
  );

  const handleOnRemoveConfirmation = (key: string) => {
    setRemoveConfirmationVisibility(() => true);
    setRemoveKey(() => key);
  };

  const onCloseConfirmation = () => {
    setRemoveConfirmationVisibility(() => false);
    setRemoveKey(() => undefined);
  };

  const handleOnRemove = () => {
    onRemove(removeKey);
    onCloseConfirmation();
  };

  useEffect(() => {
    if (isOpen) {
      setSearchValue("");
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        visible={isOpen}
        onDismiss={onClose}
        header="Load Query"
        size="large"
      >
        <Box margin={{ bottom: "m" }}>
          <Input
            inputMode="search"
            placeholder="Search query name"
            value={searchValue}
            disabled={isItemsEmpty}
            onChange={(input) => setSearchValue(input.detail.value)}
          />
        </Box>

        {isSearchNotFound && (
          <Alert>Your search - {searchValue} - did not match any data</Alert>
        )}

        {isItemsEmpty && (
          <Alert>Please add some scan / query and save it</Alert>
        )}

        {!isItemsEmpty && !isSearchNotFound && (
          <Box>
            <Table
              items={filteredList}
              columnDefinitions={[
                {
                  id: "name",
                  header: "Name",
                  cell: (item) => (
                    <Box>
                      <Box
                        fontSize="heading-s"
                        margin={{ bottom: "xs" }}
                        fontWeight="bold"
                      >
                        {item.queryName}
                      </Box>
                      <Box fontSize="body-s" color="text-body-secondary">
                        {item.table}
                      </Box>
                    </Box>
                  ),
                  maxWidth: 200,
                },
                {
                  id: "load",
                  header: "",
                  minWidth: 80,
                  maxWidth: 80,
                  cell: (item) => (
                    <Box float="right">
                      <Box float="left">
                        <Button
                          variant="primary"
                          onClick={() => onLoad(item.key)}
                        >
                          Load
                        </Button>
                      </Box>

                      <Box float="right" margin={{ left: "xs" }}>
                        <Button
                          variant="normal"
                          onClick={() => handleOnRemoveConfirmation(item.key)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ),
                },
              ]}
            />
          </Box>
        )}
      </Modal>

      <Modal
        visible={isRemoveConfirmationVisible}
        onDismiss={onCloseConfirmation}
        size="small"
        header="Remove item"
        footer={
          <Box float="right">
            <Box float="left">
              <Button onClick={onCloseConfirmation}>Cancel</Button>
            </Box>

            <Box float="right" margin={{ left: "xs" }}>
              <Button variant="primary" onClick={handleOnRemove}>
                Remove it!
              </Button>
            </Box>
          </Box>
        }
      >
        <Box>
          <>
            Do you want to remove <strong>{removeItemName}</strong> from the
            list?
          </>
        </Box>
      </Modal>
    </>
  );
};

export default LoadModal;
