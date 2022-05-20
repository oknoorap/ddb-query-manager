import type { FC, PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import Modal from "@awsui/components-react/modal";
import Button from "@awsui/components-react/button";
import Box from "@awsui/components-react/box";
import Input from "@awsui/components-react/input";

type SaveModalProps = PropsWithChildren<{
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (value: string) => void;
}>;

const SaveModal: FC<SaveModalProps> = ({
  isOpen = false,
  onClose = () => null,
  onSave = () => null,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const FooterComponent = (
    <Box float="right">
      <Box float="left" margin={{ top: "s", left: "s" }}>
        <Button onClick={onClose}>Cancel</Button>
      </Box>
      <Box float="left" margin={{ top: "s", left: "s" }}>
        <Button variant="primary" onClick={() => onSave(value)}>
          Save
        </Button>
      </Box>
    </Box>
  );

  return (
    <Modal
      visible={isOpen}
      onDismiss={onClose}
      header="Save Query"
      footer={FooterComponent}
    >
      <Input
        placeholder="Save as query name"
        value={value}
        onChange={(input) => setValue(input.detail.value)}
      />
    </Modal>
  );
};

export default SaveModal;
