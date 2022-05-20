import type { FC } from "react";
import ButtonDropdown from "@awsui/components-react/button-dropdown";

export enum LoadLocation {
  Storage = "Storage",
  JSON = "JSON",
}

const LoadLocationLabel: Record<keyof typeof LoadLocation, string> = {
  [LoadLocation.Storage]: "Load from Local Storage",
  [LoadLocation.JSON]: "Load from JSON File",
};

type LoadButtonProps = {
  onClick?: (id: LoadLocation) => void;
};

const LoadButton: FC<LoadButtonProps> = ({ onClick = () => {} }) => {
  return (
    <ButtonDropdown
      items={[
        {
          id: LoadLocation.Storage,
          text: LoadLocationLabel.Storage,
          iconName: "file",
        },
        {
          id: LoadLocation.JSON,
          text: LoadLocationLabel.JSON,
          iconName: "upload",
        },
      ]}
      onItemClick={(item) => onClick(item.detail.id as LoadLocation)}
    >
      Load Query
    </ButtonDropdown>
  );
};

export default LoadButton;
