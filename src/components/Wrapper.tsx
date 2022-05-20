import type { FC, PropsWithChildren } from "react";
import { Children } from "react";
import { createPortal } from "react-dom";
import Box from "@awsui/components-react/box";

const AWS_BUTTON_WRAPPER_SELECTOR =
  '.bodyWrapper [class*="awsui_root"][class*="awsui_horizontal"][class*="awsui_horizontal-xs"]';

const Wrapper: FC<PropsWithChildren<{}>> = ({ children }) => {
  const awsButtonWrapper = document.querySelector(AWS_BUTTON_WRAPPER_SELECTOR);
  if (!awsButtonWrapper) return null;

  return createPortal(
    <>
      {Children.map(children, (child) => (
        <Box float="left" margin={{ bottom: "xs", left: "xs" }}>
          {child}
        </Box>
      ))}
    </>,
    awsButtonWrapper
  );
};

export default Wrapper;
