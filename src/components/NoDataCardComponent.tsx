import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/animations/NoData.json";

export interface NoDataCardComponentProps {
  tableCellCount?: number;
  width?: number;
  height?: number;
  speed?: number;
  isNotTable?: boolean;
}

const NoDataCardComponent = (props: NoDataCardComponentProps) => {
  const tableCellCount = props.tableCellCount || 10;

  const defaultOptions = {
    animationData,
  };
  return props?.isNotTable ? (
    <div>
      <div className={"display-flex flex-one mrg-top-20"}>
        <Lottie width={props?.width || 700} height={props?.height || 350} speed={props?.speed || 1} options={defaultOptions} />
      </div>
    </div>
  ) : (
    <TableRow>
      <TableCell colSpan={tableCellCount}>
        <div className={"display-flex flex-one mrg-top-20"}>
          <Lottie width={props?.width || 700} height={props?.height || 350} speed={props?.speed || 1} options={defaultOptions} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NoDataCardComponent;
