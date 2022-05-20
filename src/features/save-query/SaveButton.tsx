import type { FC } from "react";
import ButtonDropdown from "@awsui/components-react/button-dropdown";

export enum SaveLocation {
  Storage = "Storage",
  JSON = "JSON",
}

const SaveLocationLabel: Record<keyof typeof SaveLocation, string> = {
  [SaveLocation.Storage]: "Save to Local Storage",
  [SaveLocation.JSON]: "Download JSON File",
};

type SaveButtonProps = {
  onClick?: (id: SaveLocation) => void;
};

const SaveButton: FC<SaveButtonProps> = ({ onClick = () => {} }) => {
  return (
    <ButtonDropdown
      variant="primary"
      items={[
        {
          id: SaveLocation.Storage,
          text: SaveLocationLabel.Storage,
          iconName: "copy",
        },
        {
          id: SaveLocation.JSON,
          text: SaveLocationLabel.JSON,
          iconName: "download",
        },
      ]}
      onItemClick={(item) => onClick(item.detail.id as SaveLocation)}
    >
      Save Query
    </ButtonDropdown>
  );
};

export default SaveButton;
