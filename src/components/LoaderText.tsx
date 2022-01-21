import { TableCell } from "@material-ui/core";
import React from 'react';

export interface NoDataCardComponentProps {
  tableCellCount?: number
}

const LoaderText = (props: NoDataCardComponentProps) => {
  const tableCellCount = props.tableCellCount || 10;

  return (
    <TableCell colSpan={tableCellCount}>
      <div style={{ textAlign: 'center' }}>
        <span> Loading</span>
      </div>
    </TableCell>

  )
};

export default LoaderText;
